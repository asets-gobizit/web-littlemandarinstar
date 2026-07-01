import fs from "node:fs";
import vm from "node:vm";

const pagesPath = "src/data/pages.ts";
const seedPath = "sanity/seed/littlemandarinstar.ndjson";

function extractPagesArray(source) {
  const marker = "export const pages";
  const exportIndex = source.indexOf(marker);
  if (exportIndex === -1) {
    throw new Error(`Could not find "${marker}" in ${pagesPath}`);
  }

  const assignmentIndex = source.indexOf("=", exportIndex);
  if (assignmentIndex === -1) {
    throw new Error(`Could not find page array assignment in ${pagesPath}`);
  }

  const start = source.indexOf("[", assignmentIndex);
  if (start === -1) {
    throw new Error(`Could not find page array start in ${pagesPath}`);
  }

  let depth = 0;
  let stringQuote = null;
  let escaped = false;

  for (let i = start; i < source.length; i += 1) {
    const char = source[i];

    if (stringQuote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === stringQuote) {
        stringQuote = null;
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      stringQuote = char;
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  throw new Error(`Could not find page array end in ${pagesPath}`);
}

function normalizePublicPath(path) {
  return path ? `/${path.replace(/^\/+|\/+$/g, "")}/` : "/";
}

const pagesSource = fs.readFileSync(pagesPath, "utf8");
const pagesArray = extractPagesArray(pagesSource);
const pages = vm.runInNewContext(`(${pagesArray})`, {}, { timeout: 1000 });

const docs = fs
  .readFileSync(seedPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const pageByLanguage = new Map(pages.map((page) => [page.lang, page]));
const docsByPageLanguage = new Map(
  docs.filter((doc) => doc._type === "page").map((doc) => [doc.language, doc])
);

for (const page of pages) {
  if (!docsByPageLanguage.has(page.lang)) {
    const doc = {
      _id: `page-home-${page.lang}`,
      _type: "page",
      title: "Little Star Mandarin School",
      language: page.lang,
      path: normalizePublicPath(page.path),
      seoTitle: page.title,
      seoDescription: page.description,
      canonical: page.canonical,
      ogLocale: page.ogLocale,
      sections: [],
      html: page.html
    };
    docs.push(doc);
    docsByPageLanguage.set(page.lang, doc);
  }
}

for (const doc of docs) {
  if (doc._type !== "page") {
    continue;
  }

  const page = pageByLanguage.get(doc.language);
  if (!page) {
    continue;
  }

  doc.path = normalizePublicPath(page.path);
  doc.seoTitle = page.title;
  doc.seoDescription = page.description;
  doc.canonical = page.canonical;
  doc.ogLocale = page.ogLocale;
  doc.html = page.html;
}

fs.writeFileSync(seedPath, `${docs.map((doc) => JSON.stringify(doc)).join("\n")}\n`, "utf8");

console.log(`Synced ${pageByLanguage.size} page HTML documents into ${seedPath}`);
