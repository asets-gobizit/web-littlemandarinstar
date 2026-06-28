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

## Current Deployment Status

- Public Astro pages are generated for `/`, `/es/`, and `/fr/`.
- Sanity Studio is mounted at `/admin`.
- `/admin` needs a real `PUBLIC_SANITY_PROJECT_ID` before customer editing is usable.
- The source clone reference remains in `Z:\03 Codex Projects\CMS.GoBizIT.ai\Websites - External Customers\littlemandarinstar`.
