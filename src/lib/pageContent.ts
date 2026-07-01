import { sanityClient } from "sanity:client";
import { pages as fallbackPages, type PageData } from "../data/pages";

type SupportedLanguage = PageData["lang"];

interface SanityPageDocument {
  title?: string;
  language?: string;
  path?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  ogLocale?: string;
  html?: string;
}

const supportedLanguages: SupportedLanguage[] = ["en", "es", "fr", "ru"];

function isConfiguredSanityProject() {
  return Boolean(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID &&
      import.meta.env.PUBLIC_SANITY_PROJECT_ID !== "replace-with-sanity-project-id"
  );
}

function normalizeRoutePath(path?: string) {
  if (!path || path === "/") {
    return undefined;
  }

  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed || undefined;
}

function isSupportedLanguage(language?: string): language is SupportedLanguage {
  return supportedLanguages.includes(language as SupportedLanguage);
}

function mapDocumentToPage(doc: SanityPageDocument, fallback: PageData): PageData {
  return {
    lang: isSupportedLanguage(doc.language) ? doc.language : fallback.lang,
    path: normalizeRoutePath(doc.path) ?? fallback.path,
    title: doc.seoTitle || doc.title || fallback.title,
    description: doc.seoDescription || fallback.description,
    canonical: doc.canonical || fallback.canonical,
    ogLocale: doc.ogLocale || fallback.ogLocale,
    html: doc.html || fallback.html
  };
}

function findFallbackForDocument(doc: SanityPageDocument) {
  return fallbackPages.find((page) => page.lang === doc.language) || fallbackPages[0];
}

export async function getPages(): Promise<PageData[]> {
  if (!isConfiguredSanityProject()) {
    return fallbackPages;
  }

  try {
    const documents = await sanityClient.fetch<SanityPageDocument[]>(
      `*[_type == "page"] | order(language asc){
        title,
        language,
        path,
        seoTitle,
        seoDescription,
        canonical,
        ogLocale,
        html
      }`
    );

    if (!Array.isArray(documents) || documents.length === 0) {
      return fallbackPages;
    }

    return fallbackPages.map((fallback) => {
      const document = documents.find((doc) => doc.language === fallback.lang);
      return document ? mapDocumentToPage(document, fallback) : fallback;
    });
  } catch (error) {
    console.warn("Sanity page fetch failed. Falling back to local page data.", error);
    return fallbackPages;
  }
}

export function getFallbackForSanityDocument(doc: SanityPageDocument): PageData {
  return findFallbackForDocument(doc);
}
