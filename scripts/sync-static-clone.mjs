import fs from "node:fs";
import path from "node:path";

const sourceRoot =
  process.argv[2] ||
  "Z:/03 Codex Projects/CMS.GoBizIT.ai/Websites - External Customers/littlemandarinstar";
const outFile = path.join(process.cwd(), "src/data/pages.ts");
const routes = [
  { file: "index.html", path: undefined, lang: "en", ogLocale: "en_GB" },
  { file: "es/index.html", path: "es", lang: "es", ogLocale: "es_ES" },
  { file: "fr/index.html", path: "fr", lang: "fr", ogLocale: "fr_FR" }
];

function pick(html, pattern, fallback = "") {
  return html.match(pattern)?.[1]?.trim() || fallback;
}

function bodyFragment(html) {
  let body = pick(html, /<body[^>]*>([\s\S]*?)<\/body>/i);
  body = body.replace(/<script src="[^"]*script\.js"><\/script>/g, "");
  body = body.replaceAll('href="./styles.css"', 'href="/styles.css"');
  body = body.replaceAll('src="./assets/', 'src="/assets/');
  body = body.replaceAll('href="./assets/', 'href="/assets/');
  body = body.replaceAll('src="../assets/', 'src="/assets/');
  body = body.replaceAll('href="../assets/', 'href="/assets/');
  body = body.replaceAll('href="./"', 'href="/"');
  body = body.replaceAll('href="./es/"', 'href="/es/"');
  body = body.replaceAll('href="./fr/"', 'href="/fr/"');
  body = body.replaceAll('href="../"', 'href="/"');
  body = body.replaceAll('href="../es/"', 'href="/es/"');
  body = body.replaceAll('href="../fr/"', 'href="/fr/"');
  return body.trim();
}

const pages = routes.map((route) => {
  const html = fs.readFileSync(path.join(sourceRoot, route.file), "utf8");
  return {
    lang: route.lang,
    path: route.path,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    description: pick(html, /<meta name="description" content="([^"]*)"/i),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/i),
    ogLocale: route.ogLocale,
    html: bodyFragment(html)
  };
});

const contents = `export interface PageData {
  lang: "en" | "es" | "fr";
  path: string | undefined;
  title: string;
  description: string;
  canonical: string;
  ogLocale: string;
  html: string;
}

export const pages: PageData[] = ${JSON.stringify(pages, null, 2)};
`;

fs.writeFileSync(outFile, contents);
console.log(`Synced ${pages.length} static clone pages to ${outFile}`);
