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
      `<h1>Little Star Mandarin School</h1>\n          <h2>Let your kids shine!</h2>`,
      `<h1>Little Star Mandarin School</h1>\n          <p class="hero-answer">Little Star Mandarin School is a real-world Mandarin Chinese school for children in Valencia.</p>\n          <h2>Let your kids shine!</h2>`
    )
    .replace(
      `We provide effective language training to non-native speakers. We provide a variety of\n            <span class="accent">Chinese courses</span> and programs for children, both for short term\n            and long-term learning.`,
      `Little Star Mandarin School is a real-world Mandarin Chinese school for children in La Canyada, Paterna, and Valencia. We offer 3 program paths: beginner Mandarin, long-term learning, and Chinese culture activities.`
    )
    .replace(
      `Whether you want your kids to learn Mandarin for personal, academic, or professional reasons,\n          our courses and programmes will help them achieve their goals and unlock their potential.`,
      `Courses and Programs are designed for children learning Mandarin for personal, academic, or future professional reasons. First, beginners can learn Chinese sounds, words, and characters. Second, continuing learners can build confidence through conversation practice. Third, culture activities help children connect Mandarin with calligraphy, festivals, food, and Chinese traditions.`
    )
    .replace(
      `<p class="eyebrow">Little Star Mandarin School</p>\n            <h2>Let your kids shine!</h2>\n            <p>\n              Little Star Mandarin School provides effective language training to non-native speakers.`,
      `<p class="eyebrow">Little Star Mandarin School</p>\n            <h2>Mandarin classes for children in Valencia</h2>\n            <p>\n              Little Star Mandarin School provides effective language training to non-native speakers.`
    );

  if (language === "en" && !normalized.includes("seo-answer-block")) {
    const aiAnswerSummary =
      "Little Star Mandarin School is a children's Mandarin Chinese school serving La Canyada, Paterna, and Valencia with face-to-face classes and Chinese culture activities. First, children can start with beginner Mandarin lessons that introduce sounds, useful words, simple characters, calligraphy, and short conversations. Second, returning learners can continue with long-term Mandarin programs that build confidence through repeated practice and classroom games. Third, schools and groups can ask about Chinese culture programs for extra-curriculum activities. The real-world example on this website is clear: parents see 3 program paths, 4 website languages, a Valencia-area address, WhatsApp, phone, and email contact options in one place. Parents can contact Little Star Mandarin School to explain a child's age, current Mandarin level, and learning goals before choosing a suitable class. Little Star Mandarin School classes are built for children who are learning Mandarin as a non-native language. First, lessons make pronunciation, useful vocabulary, and Chinese characters easier to remember through games and short practice tasks. Second, daily conversation practice helps children use Mandarin in relaxed classroom situations. Third, cultural activities connect language learning with calligraphy, festivals, food, and Chinese traditions. This real-world approach is useful for families who want a friendly Mandarin class in the Valencia area and for schools that want Chinese culture activities as part of an extra-curriculum program.";
    const aiProgramSummary =
      "According to the site information, Little Star Mandarin School programs are organized around 3 practical learning needs: beginner Mandarin, long-term Mandarin learning, and Chinese culture activities. First, beginner lessons are for children who need a friendly start with Chinese sounds, useful words, and simple characters. Second, long-term learning is for children who need steady practice, classroom confidence, and daily conversation habits. Third, culture programs are for schools, groups, and families who want children to connect Mandarin with calligraphy, festivals, food, and Chinese traditions. This real-world structure helps parents compare the main options before asking about a child's age, current level, and learning goals.";
    const aiContactSummary =
      "According to the contact details on the website, Little Star Mandarin School is based around Carrer 295, 46182 La Canyada, Valencia, Spain. Parents can use WhatsApp, phone, or email to ask which Mandarin class fits a child before enrolling. First, the parent can describe the child's age and whether Mandarin is completely new. Second, the parent can explain whether the goal is beginner vocabulary, long-term conversation practice, or Chinese culture enrichment. Third, the school can point the family toward the most suitable program path listed on the site. This real-world contact flow is useful for families in La Canyada, Paterna, and Valencia who want clear next steps. The same contact path is also useful for schools or groups asking about Chinese culture activities.";
    const answerBlock = `\n      <section class="seo-answer-block" aria-labelledby="seo-answer-title">\n        <div class="seo-answer-inner">\n          <p class="eyebrow">For parents in Valencia</p>\n          <h2 id="seo-answer-title">What Mandarin classes does Little Star offer?</h2>\n          <p>\n            Little Star Mandarin School offers face-to-face Mandarin Chinese classes for children in La Canyada, Paterna, and Valencia. Children can start with beginner Mandarin lessons or continue with long-term learning programs that build confidence over time. Classes focus on Chinese sounds, useful words, characters, simple conversation, calligraphy, and Chinese culture activities. Parents can contact the school by WhatsApp, phone, or email to ask which class fits their child's age, current level, and learning goals.\n          </p>\n          <div class="seo-answer-grid">\n            <article>\n              <h3>Who the classes are for</h3>\n              <p>Children can join beginner Mandarin lessons, long-term learning programs, and Chinese culture activities for schools or groups.</p>\n            </article>\n            <article>\n              <h3>How children learn</h3>\n              <p>Lessons combine language practice, character memory games, daily conversation, culture activities, and relaxed face-to-face guidance.</p>\n            </article>\n            <article>\n              <h3>How parents can ask</h3>\n              <p>Parents can contact the school by WhatsApp, phone, or email to ask about their child's age, level, goals, and suitable class options.</p>\n            </article>\n          </div>\n        </div>\n      </section>`;
    const optimizedAnswerBlock = answerBlock.replace(
      "Little Star Mandarin School offers face-to-face Mandarin Chinese classes for children in La Canyada, Paterna, and Valencia. Children can start with beginner Mandarin lessons or continue with long-term learning programs that build confidence over time. Classes focus on Chinese sounds, useful words, characters, simple conversation, calligraphy, and Chinese culture activities. Parents can contact the school by WhatsApp, phone, or email to ask which class fits their child's age, current level, and learning goals.",
      aiAnswerSummary
    ).replace(
      `<div class="seo-answer-grid">`,
      `<p>${aiProgramSummary}</p>\n          <p>${aiContactSummary}</p>\n          <div class="seo-answer-grid">`
    );

    normalized = normalized.replace(`\n      <section id="why-us"`, `${optimizedAnswerBlock}\n\n      <section id="why-us"`);
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
