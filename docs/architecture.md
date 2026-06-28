# Architecture

This project follows the GoBizIT website factory pattern:

- Astro renders the public site.
- Sanity Studio is mounted at `/admin`.
- Static clone content is currently synced from the verified local clone as a safe baseline.
- Sanity schemas are present so customer editing can be connected after the Sanity project/dataset credentials are available.
- GitHub and Vercel remain GoBizIT-owned deployment surfaces.

The original verified static clone source is:

```text
Z:\03 Codex Projects\CMS.GoBizIT.ai\Websites - External Customers\littlemandarinstar
```
