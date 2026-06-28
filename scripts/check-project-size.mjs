import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "dist", ".astro", ".vercel"]);
let bytes = 0;
let files = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      files += 1;
      bytes += fs.statSync(full).size;
    }
  }
}

walk(root);
const mb = bytes / 1024 / 1024;
console.log(`Project source size: ${mb.toFixed(2)} MB across ${files} files.`);
if (mb > 50) {
  console.error("Project source is above 50 MB. Move QA/backups/raw files out before deployment.");
  process.exit(1);
}
