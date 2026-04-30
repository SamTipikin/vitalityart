import { sanity, urlFor } from "./sanity";

// ────────────────────────────────────────────────────────────────
// Types — mirror the Sanity shape, not the Webflow CSV.
// ────────────────────────────────────────────────────────────────
export interface SanityImageRef {
  asset: { _ref: string; _type: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SeriesRef {
  _id?: string;
  title: string;
  slug: { current: string };
  order?: number;
}

export interface Painting {
  _id: string;
  title: string;
  slug: { current: string };
  image?: SanityImageRef;
  series?: SeriesRef;
  year?: number;
  dimensions?: { width?: number; height?: number };
  medium?: string;
  price?: number | null;
  sold: boolean;
  featured?: boolean;
  description?: string;
  order?: number;
}

export interface Series {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  order?: number;
  count: number;
}

export interface Exhibition {
  _id: string;
  title: string;
  date: string;
  kind: "event" | "exhibition";
  location?: string;
}

// ────────────────────────────────────────────────────────────────
// Query fragments
// ────────────────────────────────────────────────────────────────
const PAINTING_FIELDS = `
  _id,
  title,
  slug,
  image,
  year,
  dimensions,
  medium,
  price,
  sold,
  featured,
  description,
  order,
  "series": series->{ _id, title, slug, order }
`;

// ────────────────────────────────────────────────────────────────
// Queries
// ────────────────────────────────────────────────────────────────
export async function getAllPaintings(): Promise<Painting[]> {
  return sanity.fetch(
    `*[_type == "painting"] | order(order asc, year desc) { ${PAINTING_FIELDS} }`,
  );
}

export async function getFeaturedPaintings(limit = 6): Promise<Painting[]> {
  // Prefer featured-flagged paintings; if none are flagged, fall back to the first N.
  const featured: Painting[] = await sanity.fetch(
    `*[_type == "painting" && featured == true] | order(order asc) [0...$limit] { ${PAINTING_FIELDS} }`,
    { limit },
  );
  if (featured.length > 0) return featured;
  return sanity.fetch(
    `*[_type == "painting" && defined(image)] | order(order asc, year desc) [0...$limit] { ${PAINTING_FIELDS} }`,
    { limit },
  );
}

export async function getPaintingBySlug(slug: string): Promise<Painting | null> {
  return sanity.fetch(
    `*[_type == "painting" && slug.current == $slug][0] { ${PAINTING_FIELDS} }`,
    { slug },
  );
}

export async function getAllPaintingSlugs(): Promise<string[]> {
  return sanity.fetch(
    `*[_type == "painting" && defined(slug.current)].slug.current`,
  );
}

export async function getRelatedPaintings(
  seriesId: string | undefined,
  excludeSlug: string,
  limit = 6,
): Promise<Painting[]> {
  if (!seriesId) return [];
  return sanity.fetch(
    `*[_type == "painting" && series._ref == $seriesId && slug.current != $excludeSlug] | order(order asc) [0...$limit] { ${PAINTING_FIELDS} }`,
    { seriesId, excludeSlug, limit },
  );
}

export async function getAllSeries(): Promise<Series[]> {
  return sanity.fetch(
    `*[_type == "series"] | order(order asc) {
      _id, title, slug, description, order,
      "count": count(*[_type == "painting" && references(^._id)])
    }`,
  );
}

export async function getExhibitions(kind?: "event" | "exhibition"): Promise<Exhibition[]> {
  if (kind) {
    return sanity.fetch(
      `*[_type == "exhibition" && kind == $kind] | order(date desc) {
        _id, title, date, kind, location
      }`,
      { kind },
    );
  }
  return sanity.fetch(
    `*[_type == "exhibition"] | order(date desc) {
      _id, title, date, kind, location
    }`,
  );
}

// ────────────────────────────────────────────────────────────────
// Image URL helper — gracefully handles missing images
// ────────────────────────────────────────────────────────────────
export function paintingImageUrl(p: Painting, opts: { width?: number; quality?: number } = {}): string | null {
  if (!p.image?.asset) return null;
  let b = urlFor(p.image);
  if (opts.width) b = b.width(opts.width);
  if (opts.quality) b = b.quality(opts.quality);
  return b.url();
}

// Convenience — keep the slug helper here so pages don't import from playground
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
