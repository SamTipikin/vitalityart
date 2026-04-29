import type { StructureResolver } from "sanity/structure";

// Custom Studio structure: pin Site Settings as a singleton at the top.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      S.documentTypeListItem("painting").title("Paintings"),
      S.documentTypeListItem("series").title("Series"),
      S.documentTypeListItem("exhibition").title("Exhibitions"),
    ]);
