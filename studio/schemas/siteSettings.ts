import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type ever exists
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "artistName",
      type: "string",
      initialValue: "Vitaly Leshukov",
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "One short line. Appears under the name on the home page.",
    }),
    defineField({
      name: "bio",
      title: "Origin story / bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Long-form. Will be styled as a feature article on the home page.",
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      description: "Optional photo of the artist.",
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (r) => r.email(),
    }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({
      name: "social",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "facebook", type: "url" }),
        defineField({ name: "tiktok", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
