import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  "replace-with-sanity-project-id";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "littlemandarinstar",
  title: "Little Star Mandarin School",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes
  }
});
