import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "language", title: "Language", type: "string" }),
    defineField({ name: "path", title: "Path", type: "string" }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text" }),
    defineField({ name: "canonical", title: "Canonical URL", type: "url" }),
    defineField({ name: "ogLocale", title: "Open Graph locale", type: "string" }),
    defineField({ name: "sections", title: "Editable section notes", type: "array", of: [{ type: "text" }] })
  ]
});
