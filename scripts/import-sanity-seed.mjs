import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const required = ["PUBLIC_SANITY_PROJECT_ID", "PUBLIC_SANITY_DATASET", "SANITY_API_WRITE_TOKEN"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Create a local .env.local or set these variables in the shell before importing.");
  process.exit(1);
}

const seedPath =
  process.argv[2] || path.join(process.cwd(), "sanity", "seed", "littlemandarinstar.ndjson");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-06-28",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
});

const docs = fs
  .readFileSync(seedPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

for (const doc of docs) {
  if (!doc._id || !doc._type) {
    throw new Error(`Seed document is missing _id or _type: ${JSON.stringify(doc)}`);
  }
}

const transaction = client.transaction();
for (const doc of docs) {
  transaction.createOrReplace(doc);
}

await transaction.commit();
console.log(`Imported ${docs.length} Sanity seed documents from ${seedPath}`);
