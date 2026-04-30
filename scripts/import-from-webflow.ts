/**
 * One-shot import from Webflow CSV exports → Sanity.
 *
 * Reads:
 *   imports/paintings.csv
 *   imports/exhibitions.csv
 *   imports/events.csv
 *
 * Creates:
 *   - 10 series documents
 *   - one painting document per row in paintings.csv (with image asset uploaded)
 *   - one exhibition document per row in exhibitions.csv + events.csv,
 *     differentiated by `kind: "event" | "exhibition"`
 *
 * Skips rows with broken data after logging them to imports/_report.json.
 * Run with:  DRY_RUN=1 npx tsx scripts/import-from-webflow.ts   (parse only, no writes)
 *            npx tsx scripts/import-from-webflow.ts             (real import)
 */
import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { createClient, type SanityClient } from "@sanity/client";

// ──────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────
const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET    = process.env.PUBLIC_SANITY_DATASET || "production";
const TOKEN      = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN    = process.env.DRY_RUN === "1";

if (!PROJECT_ID || !TOKEN) {
  throw new Error("Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env");
}

const client: SanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-10-01",
  token: TOKEN,
  useCdn: false,
});

const ROOT = resolve(process.cwd());
const REPORT: { warnings: string[]; errors: string[] } = { warnings: [], errors: [] };

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Parse "100×100 [cm]" / "100x80 [cm]" / "280х110 [cm}" / "40X40X3" → {w,h} or null. */
function parseSize(raw: string): { width: number; height: number } | null {
  if (!raw) return null;
  // Strip junk: brackets, "cm", quotes
  const cleaned = raw.replace(/[\["'{}\]]/g, "").replace(/cm/i, "").trim();
  // Match digits separated by x/X/×/Cyrillic х (just first two dimensions; ignore depth)
  // Latin x/X, math ×, plus Cyrillic х (U+0445) AND Х (U+0425) — Vitaly used both
  const m = cleaned.match(/(\d+(?:\.\d+)?)\s*[xX×хХ]\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width, height };
}

/** Parse "$8,000" / "1800" / "Sold" / "Contact for price" / etc. */
function parsePrice(raw: string): { price: number | null; sold: boolean | null } {
  if (!raw) return { price: null, sold: null };
  const t = raw.trim();
  if (/sold/i.test(t)) return { price: null, sold: true };
  if (/contact|not available/i.test(t)) return { price: null, sold: null };
  // Pure-numeric (allow $ and commas)
  const m = t.match(/^\$?\s*([\d,]+(?:\.\d+)?)\s*$/);
  if (m) {
    const n = Number(m[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) return { price: n, sold: false };
  }
  // Suspicious value (date or year typed in price) — treat as no price
  return { price: null, sold: null };
}

/** Extract year from a date string like "Mon Sep 04 2023 00:00:00 GMT+0000 (...)". */
function parseYear(raw: string): number | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!isNaN(d.valueOf())) return d.getFullYear();
  // Fallback: pull a 4-digit year out
  const m = raw.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/** Try to recover original series for a "Sold Paintings" row from its image filename. */
function inferSeriesFromFilename(url: string): string | null {
  if (!url) return null;
  const filename = decodeURIComponent(url.split("/").pop() || "");
  const lower = filename.toLowerCase();
  // Patterns Vitaly used in filenames
  if (/birth/i.test(lower))                     return "Birth";
  if (/dream/i.test(lower))                     return "Dream";
  if (/green\s*room/i.test(lower))              return "Green Room";
  if (/koi|gold\s*fish|goldfish/i.test(lower))  return "Koi Symphony";
  if (/landscape/i.test(lower))                 return "Landscape";
  if (/life\s*in.*water|against\s*the\s*current/i.test(lower)) return "Life in Water";
  if (/life\s*in/i.test(lower))                 return "Life in World";
  if (/nude|naked/i.test(lower))                return "Nude Beauty";
  if (/legend|orient/i.test(lower))             return "Oriental Legends";
  return null;
}

/** Download an image URL and return a Buffer + content-type guess. */
async function downloadImage(url: string): Promise<{ buf: Buffer; filename: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      REPORT.errors.push(`Image download failed (${res.status}): ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(url.split("/").pop() || "image.jpg");
    return { buf, filename };
  } catch (err) {
    REPORT.errors.push(`Image download exception: ${url} → ${(err as Error).message}`);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────────
// Series — create the 10 documents up front
// ──────────────────────────────────────────────────────────────────
const SERIES_LABELS = [
  "Birth", "Dream", "Green Room", "Koi Symphony", "Landscape",
  "Life in World", "Life in Water", "Nude Beauty", "Oriental Legends",
];

async function ensureSeries(): Promise<Map<string, string>> {
  // Keys are lowercased so CSV variants like "Life in water" / "Green room"
  // resolve to the same series doc as "Life in Water" / "Green Room".
  const map = new Map<string, string>();
  for (let i = 0; i < SERIES_LABELS.length; i++) {
    const label = SERIES_LABELS[i];
    const slug = slugify(label);
    const _id = `series-${slug}`;
    map.set(label.toLowerCase(), _id);
    if (DRY_RUN) continue;
    await client.createOrReplace({
      _id,
      _type: "series",
      title: label,
      slug: { _type: "slug", current: slug },
      order: i,
    });
  }
  return map;
}

// ──────────────────────────────────────────────────────────────────
// Paintings
// ──────────────────────────────────────────────────────────────────
interface PaintingRow {
  Name: string; Slug: string; "Item ID": string; "Sort Order": string;
  Category: string; Size: string; "Main image": string; Date: string; Price: string;
}

async function importPaintings(seriesMap: Map<string, string>) {
  const csv = await readFile(resolve(ROOT, "imports/paintings.csv"), "utf-8");
  const rows: PaintingRow[] = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  console.log(`📦 Paintings: ${rows.length} rows`);

  let created = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = (row.Name || "").trim();
    if (!title) {
      REPORT.warnings.push(`Row ${i + 2}: empty name, skipping`);
      continue;
    }
    const slug = (row.Slug || slugify(title)).trim();
    const dims = parseSize(row.Size);
    if (!dims) REPORT.warnings.push(`Row ${i + 2} "${title}": couldn't parse Size "${row.Size}"`);

    const { price, sold: priceSold } = parsePrice(row.Price);
    let series = (row.Category || "").trim();
    let sold = false;

    if (series.toLowerCase() === "sold paintings") {
      sold = true;
      const inferred = inferSeriesFromFilename(row["Main image"]);
      if (inferred) {
        series = inferred;
      } else {
        REPORT.warnings.push(`Row ${i + 2} "${title}": sold painting, couldn't infer original series from filename — leaving series unset`);
        series = "";
      }
    } else if (priceSold === true) {
      sold = true;
    }

    const seriesId = series ? seriesMap.get(series.toLowerCase()) : undefined;
    if (series && !seriesId) {
      REPORT.warnings.push(`Row ${i + 2} "${title}": unknown category "${series}"`);
    }

    const year = parseYear(row.Date);
    const _id = `painting-${row["Item ID"] || slug}`;

    if (DRY_RUN) {
      console.log(`  [dry] ${title.slice(0, 50)} | series=${series} | ${dims ? `${dims.width}x${dims.height}` : "no-size"} | price=${price ?? "—"} sold=${sold}`);
      created++;
      continue;
    }

    // Upload image
    const dl = await downloadImage(row["Main image"]);
    let imageRef: string | null = null;
    if (dl) {
      try {
        const asset = await client.assets.upload("image", dl.buf, { filename: dl.filename });
        imageRef = asset._id;
      } catch (err) {
        REPORT.errors.push(`Row ${i + 2} "${title}": image upload failed → ${(err as Error).message}`);
      }
    }

    const doc: Record<string, unknown> = {
      _id,
      _type: "painting",
      title,
      slug: { _type: "slug", current: slug },
      year: year ?? undefined,
      medium: "Oil on canvas",
      sold,
      featured: false,
      order: Number(row["Sort Order"]) || undefined,
    };
    if (dims) doc.dimensions = { width: dims.width, height: dims.height };
    if (price !== null) doc.price = price;
    if (seriesId) doc.series = { _type: "reference", _ref: seriesId };
    if (imageRef) doc.image = { _type: "image", asset: { _type: "reference", _ref: imageRef } };

    try {
      await client.createOrReplace(doc as never);
      created++;
      process.stdout.write(`  ✓ ${i + 1}/${rows.length}  ${title.slice(0, 60)}\n`);
    } catch (err) {
      REPORT.errors.push(`Row ${i + 2} "${title}": create failed → ${(err as Error).message}`);
    }
  }
  console.log(`📦 Paintings: created ${created}`);
}

// ──────────────────────────────────────────────────────────────────
// Exhibitions / Events
// ──────────────────────────────────────────────────────────────────
interface ExhibitionRow {
  Name: string; Slug: string; "Item ID": string; Date: string; Locations: string;
}

async function importExhibitions(file: string, kind: "event" | "exhibition") {
  const csv = await readFile(resolve(ROOT, `imports/${file}`), "utf-8");
  const rows: ExhibitionRow[] = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  console.log(`📅 ${kind}: ${rows.length} rows`);

  let created = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = (row.Name || "").trim();
    if (!title) continue;
    const slug = (row.Slug || slugify(title)).trim();
    const dateRaw = row.Date;
    const date = (() => {
      const d = new Date(dateRaw);
      return isNaN(d.valueOf()) ? null : d.toISOString().slice(0, 10);
    })();
    if (!date) {
      REPORT.warnings.push(`${kind} "${title}": couldn't parse date "${dateRaw}"`);
      continue;
    }
    const _id = `${kind}-${row["Item ID"] || slug}`;

    if (DRY_RUN) {
      console.log(`  [dry] ${kind}: ${title.slice(0, 60)} | ${date} | ${row.Locations}`);
      created++;
      continue;
    }

    try {
      await client.createOrReplace({
        _id,
        _type: "exhibition",
        title,
        slug: { _type: "slug", current: slug },
        date,
        kind,
        location: (row.Locations || "").trim(),
      } as never);
      created++;
    } catch (err) {
      REPORT.errors.push(`${kind} "${title}": create failed → ${(err as Error).message}`);
    }
  }
  console.log(`📅 ${kind}: created ${created}`);
}

// ──────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────
(async () => {
  console.log(DRY_RUN ? "🌱 DRY RUN — no writes" : "🚀 Live import");
  console.log(`   project: ${PROJECT_ID}, dataset: ${DATASET}\n`);

  console.log("⏳ Ensuring series…");
  const seriesMap = await ensureSeries();
  console.log(`   ${seriesMap.size} series ready\n`);

  console.log("⏳ Importing paintings…");
  await importPaintings(seriesMap);
  console.log("");

  console.log("⏳ Importing exhibitions…");
  await importExhibitions("exhibitions.csv", "exhibition");
  console.log("");

  console.log("⏳ Importing events…");
  await importExhibitions("events.csv", "event");
  console.log("");

  await writeFile(resolve(ROOT, "imports/_report.json"), JSON.stringify(REPORT, null, 2));
  console.log(`✅ Done. Report → imports/_report.json`);
  console.log(`   Warnings: ${REPORT.warnings.length}, Errors: ${REPORT.errors.length}`);
})().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
