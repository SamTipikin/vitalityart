import { defineType, defineField } from "sanity";

export default defineType({
  name: "painting",
  title: "Painting",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      description:
        "Use the hotspot tool to set the focal point — this controls how the image is cropped on different layouts.",
    }),
    defineField({
      name: "series",
      type: "reference",
      to: [{ type: "series" }],
      description: "Optional. Group this painting under a series.",
    }),
    defineField({
      name: "year",
      type: "number",
      validation: (r) => r.min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "dimensions",
      type: "object",
      fields: [
        defineField({ name: "width", type: "number", title: "Width (cm)" }),
        defineField({ name: "height", type: "number", title: "Height (cm)" }),
      ],
      options: { columns: 2 },
    }),
    defineField({
      name: "medium",
      type: "string",
      description: 'e.g. "Oil on canvas"',
    }),
    defineField({
      name: "price",
      type: "number",
      description: "Leave blank for 'Price on request'.",
    }),
    defineField({
      name: "currency",
      type: "string",
      initialValue: "USD",
      options: { list: ["USD", "EUR", "GBP"] },
    }),
    defineField({
      name: "sold",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
      description: "Show on the homepage.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Manual sort. Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      sold: "sold",
      media: "image",
    },
    prepare({ title, year, sold, media }) {
      return {
        title: title || "Untitled",
        subtitle: [year, sold ? "SOLD" : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
