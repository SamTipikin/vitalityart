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
      name: "kind",
      type: "string",
      title: "Kind",
      options: {
        list: [
          { title: "Event (recent / upcoming)", value: "event" },
          { title: "Exhibition (archive)", value: "exhibition" },
        ],
        layout: "radio",
      },
      initialValue: "exhibition",
      description: "Events surface on the home page calendar tab. Exhibitions are the full archive.",
    }),
    defineField({
      name: "location",
      type: "string",
      description: "Free-form. Exactly as it should display, e.g. 'Taipei (Taiwan)' or 'Lloret de Mar, Spain'.",
    }),
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
      location: "location",
      kind: "kind",
    },
    prepare({ title, date, location, kind }) {
      const year = date ? new Date(date).getFullYear() : "";
      return {
        title,
        subtitle: [year, kind, location].filter(Boolean).join(" · "),
      };
    },
  },
});
