# Little Star Mandarin School

Astro/Sanity project for the Little Mandarin Star customer website.

## Local Commands

```powershell
npm install
npm run sync:static
npm run build
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and fill real Sanity values when the Sanity project is created.

Do not commit `.env.local`.

For Vercel, add these environment variables to both Production and Preview before deploying:

- `PUBLIC_SITE_URL`
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_API_VERSION`
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- `SANITY_API_READ_TOKEN` if the Sanity dataset is private
- `SANITY_API_WRITE_TOKEN` only when import or write automation is needed

## Current Deployment Status

- Public Astro pages are generated for `/`, `/es/`, and `/fr/`.
- Sanity Studio is mounted at `/admin`.
- Vercel uses `npm run build:vercel`, which blocks deployment if Sanity env vars are missing or still placeholders.
- `/admin` needs a real `PUBLIC_SANITY_PROJECT_ID` before customer editing is usable.
- The source clone reference remains in `Z:\03 Codex Projects\CMS.GoBizIT.ai\Websites - External Customers\littlemandarinstar`.
