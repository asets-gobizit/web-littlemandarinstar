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

function normalizeSeoHtml(html: string, language?: string) {
  let normalized = html
    .replaceAll("Photo Galley", "Photo Gallery")
    .replaceAll(
      `<figure class="lightbox-stage">\n          <img src="/assets/china/iStock-105081457.jpg" alt="" />\n        </figure>`,
      `<figure class="lightbox-stage">\n          <img src="/assets/china/iStock-105081457.jpg" alt="Selected photo from the Little Star Mandarin School gallery" />\n        </figure>`
    )
    .replace(
      `<p class="eyebrow">Little Star Mandarin School</p>\n            <h2>Let your kids shine!</h2>\n            <p>\n              Little Star Mandarin School provides effective language training to non-native speakers.`,
      `<p class="eyebrow">Little Star Mandarin School</p>\n            <h2>Mandarin classes for children in Valencia</h2>\n            <p>\n              Little Star Mandarin School provides effective language training to non-native speakers.`
    );

  if (language === "en" && !normalized.includes("seo-answer-block")) {
    const answerBlock = `\n      <section class="seo-answer-block" aria-labelledby="seo-answer-title">\n        <div class="seo-answer-inner">\n          <p class="eyebrow">For parents in Valencia</p>\n          <h2 id="seo-answer-title">What Mandarin classes does Little Star offer?</h2>\n          <p>\n            Little Star Mandarin School offers face-to-face Mandarin Chinese classes for children in La Canyada, Paterna, and Valencia. Children can start with beginner Mandarin lessons or continue with long-term learning programs that build confidence over time. Classes focus on Chinese sounds, useful words, characters, simple conversation, calligraphy, and Chinese culture activities. Parents can contact the school by WhatsApp, phone, or email to ask which class fits their child's age, current level, and learning goals.\n          </p>\n          <div class="seo-answer-grid">\n            <article>\n              <h3>Who the classes are for</h3>\n              <p>Children can join beginner Mandarin lessons, long-term learning programs, and Chinese culture activities for schools or groups.</p>\n            </article>\n            <article>\n              <h3>How children learn</h3>\n              <p>Lessons combine language practice, character memory games, daily conversation, culture activities, and relaxed face-to-face guidance.</p>\n            </article>\n            <article>\n              <h3>How parents can ask</h3>\n              <p>Parents can contact the school by WhatsApp, phone, or email to ask about their child's age, level, goals, and suitable class options.</p>\n            </article>\n          </div>\n        </div>\n      </section>`;

    normalized = normalized.replace(`\n      <section id="why-us"`, `${answerBlock}\n\n      <section id="why-us"`);
  }

  return normalized;
}

function mapDocumentToPage(doc: SanityPageDocument, fallback: PageData): PageData {
  return {
    lang: isSupportedLanguage(doc.language) ? doc.language : fallback.lang,
    path: normalizeRoutePath(doc.path) ?? fallback.path,
    title: doc.seoTitle || doc.title || fallback.title,
    description: doc.seoDescription || fallback.description,
    canonical: doc.canonical || fallback.canonical,
    ogLocale: doc.ogLocale || fallback.ogLocale,
    html: normalizeSeoHtml(doc.html || fallback.html, doc.language || fallback.lang)
  };
}

function findFallbackForDocument(doc: SanityPageDocument) {
  return fallbackPages.find((page) => page.lang === doc.language) || fallbackPages[0];
}

export async function getPages(): Promise<PageData[]> {
  if (!isConfiguredSanityProject()) {
    return fallbackPages.map((page) => ({ ...page, html: normalizeSeoHtml(page.html, page.lang) }));
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
