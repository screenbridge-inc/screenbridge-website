# Homepage mockups

Static, non-functional visual directions for a new screenbridge.tv. Each folder holds a
self-contained `homepage-mockup.html` (all images embedded as data URIs, Poppins from Google
Fonts) and 2x renders at 1440px and 390px. The `.template.html` is the same page with
`{{asset}}` placeholders; `build_assets.py` regenerates the asset manifest from `public/images/`.

Reference site studied for the direction: https://www.frontrowgroup.com/en (Next.js + Storyblok
+ Mux on Vercel). Its DNA, not its stack: one typeface at two weights, three colours, real
client photography, one accent band. Every colour here is a Screenbridge Design System token
(`screenbridge-agents/design_system/colors_and_type.css`); nothing is invented.

| Folder | Direction | Artifact link |
|---|---|---|
| `2026-09-30-v1-frontrow-direction/` | Creative-only homepage, full-bleed ad still hero, coral logo band | https://claude.ai/artifact/Vt5V3E6v8n4prbR7Jg5Awe |
| `2026-10-01-v2-ads-plus-reach/` | Reach folded into www: split hero, ads left, "run CTV through Reach and the ads are free" right | https://claude.ai/artifact/YX5ca8kaWkLULmLzu9gmcY |

Copy rules observed in both: claims are verbatim from the live site or from Tim's stated Reach
terms as of 2026-10-01 (month to month; ads free on every Reach plan; no dollar figures shown, plan
minimums to be settled later);
the three result figures are creative results, never attributed to Reach media; no pricing on
the homepage; Peacock is not listed as standard inventory.

Hero stills are web thumbnails with brand text burned in. A real build needs clean frames
exported from the project files.
