import { defineType, defineField } from "sanity";

export default defineType({
  name: "exhibition",
  title: "Exhibition",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      type: "date",
      validation: (r) => r.required(),
      description: "Use the first day of the exhibition.",
    }),
    defineField({
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "Solo show", value: "solo" },
          { title: "Group show", value: "group" },
          { title: "Art fair", value: "fair" },
          { title: "Auction", value: "auction" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "venue", type: "string" }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "country", type: "string" }),
    defineField({
      name: "link",
      type: "url",
      description: "Optional link to gallery, fair, or press.",
    }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      city: "city",
      type: "type",
    },
    prepare({ title, date, city, type }) {
      const year = date ? new Date(date).getFullYear() : "";
      return {
        title,
        subtitle: [year, type, city].filter(Boolean).join(" · "),
      };
    },
  },
});
