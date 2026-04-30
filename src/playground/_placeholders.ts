// Placeholder painting data for design variants.
// These are real image URLs from the live Webflow CDN (vitalityart.es).
// Use only for visual prototyping — replaced by Sanity data once CSV imports.

export interface PlaceholderPainting {
  title: string;
  series: string;
  year: number;
  width: number;  // cm
  height: number; // cm
  medium: string;
  price: number | null;
  sold: boolean;
  image: string;
  ratio: number; // height / width — for layout placement
}

const cdn = "https://cdn.prod.website-files.com/6625a5df3e3abfceb75b8e81";

// Eight base paintings that we'll cycle to demo a fuller gallery.
const _base: PlaceholderPainting[] = [
  {
    title: "Legends of the East — Be the Sun",
    series: "Legends",
    year: 2024,
    width: 80, height: 80,
    medium: "Oil on canvas",
    price: 4800, sold: false,
    image: `${cdn}/6671d418f8c320701f639e4c_Legends%20of%20the%20East%20-%20Be%20the%20Sun%2080x80%20cm.%2072DPI.jpg`,
    ratio: 1,
  },
  {
    title: "Against the Current — From a Dream to a Goal",
    series: "Life In",
    year: 2024,
    width: 110, height: 280,
    medium: "Oil on canvas",
    price: null, sold: true,
    image: `${cdn}/6672a70205c12cf0821f2e86_Against%20The%20Current%20-%20From%20A%20Dream%20To%20A%20Goalhttps%20110x280%20cm.%2072DPI.jpg`,
    ratio: 280 / 110,
  },
  {
    title: "Life in the World — X",
    series: "Life In",
    year: 2024,
    width: 170, height: 110,
    medium: "Oil on canvas",
    price: 8200, sold: false,
    image: `${cdn}/6672a8fb87ce84094abe56c6_Series-Life%20In%20the%20World-X%20170X110%20cm.%2072DPI.jpg`,
    ratio: 110 / 170,
  },
  {
    title: "Goldfish III",
    series: "Goldfish",
    year: 2023,
    width: 80, height: 50,
    medium: "Oil on canvas",
    price: 2400, sold: false,
    image: `${cdn}/6672a9ef8c4fdfb7422fda6f_Golg%20Fish%203%2080X50%20cm.%2072DPI%20.jpg`,
    ratio: 50 / 80,
  },
  {
    title: "Dream",
    series: "Dreams",
    year: 2023,
    width: 80, height: 80,
    medium: "Oil on canvas",
    price: null, sold: true,
    image: `${cdn}/6672aa02684c647583c162ff_Dream%2080x80%20cm.%2072DPI%20.jpg`,
    ratio: 1,
  },
  {
    title: "Creation of the World — 7",
    series: "Birth",
    year: 2023,
    width: 120, height: 120,
    medium: "Oil on canvas",
    price: 6400, sold: false,
    image: `${cdn}/6672aac26a12b9d115188382_Series%20-%20Creation%20of%20the%20world-7%20120x120%20cm.%2072DPI.jpg`,
    ratio: 1,
  },
  {
    title: "Yin Yang — Creation",
    series: "Birth",
    year: 2023,
    width: 160, height: 100,
    medium: "Oil on canvas",
    price: 7800, sold: false,
    image: `${cdn}/6672ad633bf55254c6c0ddc7_Yin%20Yang%20-%20Creation%20160X100%2072%20DPI%20.jpg`,
    ratio: 100 / 160,
  },
  {
    title: "Blue Irises",
    series: "Naked Beauty",
    year: 2024,
    width: 120, height: 60,
    medium: "Oil on canvas",
    price: 4200, sold: false,
    image: `${cdn}/6672b32923a74cf99770d067_Series%20-%20Nude%20beauty%20-%20Blue%20Irises%20120X60%20cm.%2072DPI.jpg%204%2C1MB.jpg`,
    ratio: 60 / 120,
  },
];

// Generate ~24 paintings by varying the base set across years/sizes/prices.
// Real Sanity data will replace this once the CSV import lands.
const _variations: Array<{ titleSuffix: string; year: number; priceMultiplier: number; sold?: boolean }> = [
  { titleSuffix: "II", year: 2023, priceMultiplier: 0.9 },
  { titleSuffix: "III", year: 2022, priceMultiplier: 0.8, sold: true },
];

export const paintings: PlaceholderPainting[] = [
  ..._base,
  ..._variations.flatMap((v) =>
    _base.map((p, i) => ({
      ...p,
      title: `${p.title.split(" — ")[0]} ${v.titleSuffix}`,
      year: v.year,
      price: p.price ? Math.round(p.price * v.priceMultiplier / 100) * 100 : null,
      sold: v.sold ?? (i % 5 === 0),
    })),
  ),
];

// Series taxonomy — used by the gallery filter
export const seriesList = [
  { slug: "all",          label: "All works" },
  { slug: "legends",      label: "Legends" },
  { slug: "life-in",      label: "Life In" },
  { slug: "goldfish",     label: "Goldfish" },
  { slug: "dreams",       label: "Dreams" },
  { slug: "birth",        label: "Birth" },
  { slug: "naked-beauty", label: "Naked Beauty" },
];

export const seriesSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const artist = {
  name: "Vitaly Leshukov",
  origin: "Spanish-based contemporary painter",
  // Dramatic single-line: came back from a coma to paint
  pullQuote: "After the coma, the only thing left was color.",
  bioShort:
    "Born in the Urals, working today from Spain. After a coma in 2018, Vitaly returned to the canvas with a single conviction — that paint, large and unflinching, was the only honest record of being alive. The work since has been shown in Taipei, Dubai, Bordeaux, Lausanne, and Tokyo.",
};

export const exhibitions = [
  { year: 2024, title: "Art Taipei",        type: "fair",    city: "Taipei" },
  { year: 2024, title: "World Art Dubai",   type: "fair",    city: "Dubai" },
  { year: 2024, title: "Solo — Bordeaux",   type: "solo",    city: "Bordeaux" },
  { year: 2023, title: "Lausanne Art Fair", type: "fair",    city: "Lausanne" },
  { year: 2023, title: "Tokyo International Art Fair", type: "fair", city: "Tokyo" },
  { year: 2023, title: "Group — Madrid",    type: "group",   city: "Madrid" },
  { year: 2022, title: "Solo — Valencia",   type: "solo",    city: "Valencia" },
];
