import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");

const projectId = env.PUBLIC_SANITY_PROJECT_ID || "replace-with-sanity-project-id";
const dataset = env.PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_READ_TOKEN || undefined;

export default defineConfig({
  site: env.PUBLIC_SITE_URL || "https://www.littlemandarinstar.com",
  integrations: [
    react(),
    sitemap(),
    sanity({
      projectId,
      dataset,
      token,
      useCdn: !token,
      apiVersion: env.PUBLIC_SANITY_API_VERSION || "2026-06-28",
      studioBasePath: "/admin"
    })
  ]
});
