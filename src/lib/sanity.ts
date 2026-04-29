import { createClient, type ClientConfig } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error(
    "Missing PUBLIC_SANITY_PROJECT_ID. Set it in .env (and in Vercel env vars for production).",
  );
}

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  useCdn: true,
  perspective: "published",
};

export const sanity = createClient(config);

const builder = imageUrlBuilder(sanity);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
