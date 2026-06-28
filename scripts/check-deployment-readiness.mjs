const vercelMode = process.argv.includes("--vercel");

const requiredPublicEnv = [
  "PUBLIC_SITE_URL",
  "PUBLIC_SANITY_PROJECT_ID",
  "PUBLIC_SANITY_DATASET",
  "PUBLIC_SANITY_API_VERSION"
];

const forbiddenValues = new Set([
  "replace-with-sanity-project-id",
  "your_sanity_project_id",
  "https://api.example.com"
]);

const missing = [];
const placeholders = [];

for (const key of requiredPublicEnv) {
  const value = process.env[key];
  if (!value) {
    missing.push(key);
    continue;
  }
  if (forbiddenValues.has(value)) {
    placeholders.push(key);
  }
}

if (missing.length || placeholders.length) {
  console.error("Deployment readiness failed.");
  if (missing.length) console.error(`Missing env vars: ${missing.join(", ")}`);
  if (placeholders.length) console.error(`Placeholder env vars: ${placeholders.join(", ")}`);
  console.error("Set real values in Vercel Production and Preview before deploying the full factory site.");
  process.exit(vercelMode ? 1 : 2);
}

for (const optionalSecret of ["SANITY_API_READ_TOKEN", "SANITY_API_WRITE_TOKEN"]) {
  if (!process.env[optionalSecret]) {
    console.warn(`${optionalSecret} is not set. This is acceptable only while the public site uses local fallback content or the Sanity dataset is public.`);
  }
}

console.log("Deployment readiness check passed.");
