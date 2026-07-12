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
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es",
          fr: "fr",
          ru: "ru"
        }
      },
      serialize(item) {
        if (!item.links || item.links.length === 0) {
          return item;
        }

        return {
          ...item,
          links: [
            ...item.links,
            {
              lang: "x-default",
              url: "https://www.littlemandarinstar.com/"
            }
          ]
        };
      }
    }),
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
