# screenbridge-website

The new screenbridge.tv, on the Reach stack: React + Vite, prerendered to static
HTML at build time (every route ships its head tags and body copy in the raw HTML),
framer-motion for light motion, Tailwind for layout. Content is markdown in git.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck, client build, SSR build, prerender to dist/
npm run preview    # serve dist/ on http://localhost:4173
npm run parity     # Googlebot raw-HTML check against the preview server
```

`npm run parity` (or `python3 -I scripts/check_parity.py <base-url>`) fetches every
route with a Googlebot user agent and fails unless the raw HTML has the page's H1,
one sentence unique to that page, a title, a description and a canonical link.
Run it against any preview URL before shipping.

## Layout

```
content/<route>.md       page copy + front matter (title, description, canonical,
                         ogImage, noindex, jsonld); content/index.md is "/"
content/<coll>/sample.md CMS template placeholders (noindex)
src/                     app: layout, pages, SEO head, consent + GTM
src/styles/tokens.*      GENERATED brand tokens, do not edit
scripts/gen_tokens.mjs   regenerates tokens, fonts and logos from the design system
scripts/extract_webflow.py  one-time import of copy from reference/webflow/
scripts/import_reel.py   builds src/data/work.json (the /work grid) from the reel finder
scripts/prerender.mjs    per-route HTML, 404.html, sitemap.xml, robots.txt
scripts/check_parity.py  SEO parity check (stdlib only)
docs/routes.md           route table, noindex list, 301 map, missing pages
reference/webflow/       the original Webflow export, kept as reference only
```

## Rules

- **Brand tokens come only from the design system**
  (`screenbridge-agents/design_system/colors_and_type.css`). Run `npm run tokens`
  after it changes. Never type a hex into `tailwind.config.js` or the CSS.
- **No dollar figures** anywhere on the site until pricing is settled. Removed figures
  are marked `<!-- TODO(pricing) -->` in the markdown; JSON-LD price fields are dropped.
- **No em dashes** in site copy.
- **GTM (`GTM-M52G95GL`) loads only after consent.** Consent Mode v2 defaults to denied
  in `index.html`; the banner in `src/components/ConsentBanner.tsx` is a stub to be
  replaced before launch. GTM never loads on localhost or `*.vercel.app` previews.
- **Never hand-write a Vimeo link or id.** Videos on `/` and `/work` come from
  `src/data/work.json`, which `scripts/import_reel.py` builds from the reel finder
  (client work only; spec ads are left out). Rerun it to refresh the grid.
- `/` and `/work` are designed pages (`hand_edited: true`): sections are styled by
  their heading through `sec-*` classes in `src/index.css`; the other pages stay plain.
- `BRIEF.md` is history (the Lovable brief). Its prices and color tokens are stale.

## Content import

`python3 -I scripts/extract_webflow.py --force` regenerates `content/` from
`reference/webflow/`. It overwrites hand edits, so only run it before content is
edited by hand. Files marked `hand_edited: true` are never overwritten.

## Work grid

`python3 -I scripts/import_reel.py` runs the reel finder
(`screenbridge-agency/tools/screenbridge-showcase-catalog/find.py`, override with
`--finder` or `SB_REEL_FINDER`) once per tier and writes `src/data/work.json`: one spot
per brand, campaign and tier, preferring the 30s cut. Thumbnails are Vimeo's; the player
iframe loads only when a visitor clicks.
