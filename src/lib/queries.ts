import { sanity } from "./sanity";

export interface Painting {
  _id: string;
  title: string;
  slug: { current: string };
  image: {
    asset: { _ref: string; _type: string };
    hotspot?: { x: number; y: number; height: number; width: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  series?: { title: string; slug: { current: string } };
  year?: number;
  dimensions?: { width?: number; height?: number };
  medium?: string;
  price?: number;
  currency?: string;
  sold: boolean;
  featured: boolean;
  description?: string;
  order?: number;
}

export interface Exhibition {
  _id: string;
  title: string;
  date: string;
  type?: "solo" | "group" | "fair" | "auction";
  venue?: string;
  city?: string;
  country?: string;
  link?: string;
}

export interface SiteSettings {
  artistName: string;
  tagline?: string;
  bio?: unknown[];
  portrait?: { asset: { _ref: string; _type: string } };
  email?: string;
  phone?: string;
  address?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

const PAINTING_FIELDS = `
  _id,
  title,
  slug,
  image,
  series->{ title, slug },
  year,
  dimensions,
  medium,
  price,
  currency,
  sold,
  featured,
  description,
  order
`;

export async function getAllPaintings(): Promise<Painting[]> {
  return sanity.fetch(
    `*[_type == "painting"] | order(order asc, year desc) { ${PAINTING_FIELDS} }`,
  );
}

export async function getFeaturedPaintings(): Promise<Painting[]> {
  return sanity.fetch(
    `*[_type == "painting" && featured == true] | order(order asc) { ${PAINTING_FIELDS} }`,
  );
}

export async function getPaintingBySlug(slug: string): Promise<Painting | null> {
  return sanity.fetch(
    `*[_type == "painting" && slug.current == $slug][0] { ${PAINTING_FIELDS} }`,
    { slug },
  );
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  return sanity.fetch(
    `*[_type == "exhibition"] | order(date desc) {
      _id, title, date, type, venue, city, country, link
    }`,
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanity.fetch(
    `*[_type == "siteSettings"][0] {
      artistName, tagline, bio, portrait, email, phone, address, social
    }`,
  );
}
