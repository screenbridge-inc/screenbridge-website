# screenbridge.tv: one build

Written 2026-10-22 by the "Screenbridge.tv Web Design" thread. Merges three threads into one
build. **Opus executes this; Tim approves each gate.** Everything that was decided elsewhere is
restated here so no other thread needs to be read.

## 1. The three threads and what each contributed

| Thread | Contribution | Fate |
|---|---|---|
| Screenbridge.tv website redesign (started the build) | The code: branch `claude/site-shell-b38f19`, PR #1, 28 routes ported from Webflow, Vercel preview, design pass 1 (TV-frame hero, cards) | **Owns the build from here** |
| Website structure for Screenbridge (2026-10-20) | The page map: one topic per page, a sentence as the H1, product pages, "who it is for" pages, one case-study page per brand, an About page with plain facts for Google and AI, keep every URL with redirects | Archived once this doc is on the branch |
| Screenbridge.tv Web Design (this one) | The look: mockups v1/v2, stills library, 7 design rules, the `/creative` `/performance-plan` `/reach` idea | Archived once this doc is on the branch |

## 2. Decisions (settled, do not reopen)

1. **One codebase:** `screenbridge-inc/screenbridge-website`, branch `claude/site-shell-b38f19`
   (PR #1). Base is `lovable-rebuild`; `main` is the old Pages export. No other branch gets site work.
2. **Stack stays:** Vite + React + Tailwind, prerendered static HTML per route, copy as markdown in
   `content/`, tokens generated from `design_system/colors_and_type.css`, Poppins, GTM after consent.
   No 3D, no scroll-jacking, no new dependencies.
3. **Target look:** mockup v2 (`mockups/2026-10-01-v2-ads-plus-reach/desktop.jpg`) and the 7 rules
   in section 4. Design pass 1 on the branch is the baseline to replace, not extend.
4. **Page map:** section 3. Tim's three doors (`/creative`, `/performance-plan`, `/reach`) are the
   spine; the structure thread's "who it is for", case-study, and About pages hang off it.
5. **Naming:** `/creative`, not `/ctv-ads`. The H1 carries the search intent as a sentence.
6. **No `/pricing` page.** No dollar figure anywhere on www. The `TODO(pricing)` markers stay until
   Tim names a figure for a specific page. Percentages already on pages stay (Tim, 2026-10-23); any
   change to one is decided page by page with Tim.
7. **Reach stays on its own domain.** `/reach` on www is a premium overview whose main CTA goes to
   reach.screenbridge.tv. The SEO spokes stay on reach. Folding the two domains is a later decision.
8. **All 28 current URLs keep resolving.** Pages that move get a 301 in `vercel.json`.
9. **Timing:** Phase 1 done. Phase 2 started 2026-10-23 on Tim's go, without waiting for Dmitry.
10. **Package pages keep their flat URLs** (`/work-standard`, `/work-premium`, `/work-signature`):
    they are the indexed addresses, and moving them would trade ranking for nothing (Tim, 2026-10-23).
11. **CI:** a GitHub Actions workflow runs the build, `npm run parity` and `check_copy_rules.py` on
    every push to the PR. It never deploys.

## 3. Page map

Every page: one H1 that is a sentence, the answer in the first block, body links to its parent and
two siblings, one CTA. Routes not listed keep their current content and get the new shell only.

| Route | H1 (draft, Tim edits) | Purpose | Sections |
|---|---|---|---|
| `/` | Bring the power of UGC to CTV. | Three doors | Split hero (v2), trust strip, three door cards (creative / performance plan / Reach), selected ads (6), one big quote, 3-stat row, channel logos, closing CTA |
| `/creative` | UGC-style TV ads, built from the social content you already have. | Creative only, the current business | Full-bleed still hero, from-the-feed-to-the-living-room (3 frames), Standard / Premium / Signature with delivery times (10 / 15 / 20 business days) and no prices, selected ads, how a project runs (dashboard), FAQ, CTA |
| `/performance-plan` | We make the ads. You pay as they run. | The Creative Lease, in plain words | Hero still, how it works (we build, you tag spend, new batch when the last one is live), who it fits, what you get, FAQ, CTA = book a call. **No lease rate, floor or term on the page**; those are quoted on the call |
| `/reach` | Run CTV through Reach and the ads are included. | Premium overview of the media product | Hero (fatty15 light panel from v2), why run CTV through Reach (6 cards from v2, minus "month to month"), the loop, attribution, CTA = reach.screenbridge.tv |
| `/for/dtc-brands`, `/for/local-businesses`, `/for/agencies` | one sentence each | Who it is for | Short: the fit, which door, 3 ads, CTA. Local shows the monthly ladder: $2,500 a month ("about $83 a day" beneath it) / $5,000 / $10,000 / $20,000+, 3-month commitment, Offer JSON-LD. All monthly, no per-day tier (Tim, 2026-10-23). The lint's dollar rule is lifted for that one file only; DTC and agencies show no figures |
| `/work`, `/work-standard`, `/work-premium`, `/work-signature` | existing | Proof hub | Keep the grid; re-skin to the rules |
| `/case-studies/<brand>` | existing templates | One page per client-approved story | Mixbook, Carve, fatty15 first; numbers only where the client approved them |
| `/about` | Screenbridge is a New York video agency that makes UGC-style TV ads and runs them on CTV. | Plain facts for people and crawlers | The facts block, founders, Organization JSON-LD; same facts verbatim in every footer |
| `/contact` | Book a 15-minute intro call. | One action | Calendar embed or mailto, nothing else |

**Redirects (301, in `vercel.json`):** `/ctv-media-buying-services` to `/reach`, added in the
Reach step. The package pages stay flat (decision 10). Nothing else moves.

**Nav:** Creative, Performance Plan, Reach, Work, About, Book a call. Six items, no dropdowns.

## 4. The seven design rules (from the v2 mockup)

1. **Real ad stills, full bleed.** No gradient hero, no TV frame, no device mockup. Frames with empty
   space at the top, since the copy sits up there (`mockups/stills-library/README.md` lists which).
2. **Fewer, bigger sections.** About 8 on the homepage, never 12. No icon grids, no team grid, no
   before/after table on the homepage (team goes to `/about`).
3. **Big, tight headlines, short copy.** Two lines max for an H1, one sentence under it.
4. **Three surfaces, one accent.** Ink (`#19182A`) / white / pale. Coral (`#FF7F60`) only on CTAs,
   quote marks and one trust band. Drop the purple wash; brand purple (`#453DA4`) is for links and
   small marks only.
5. **Whitespace, one idea per screen.** Section padding doubles what pass 1 uses.
6. **Proof shown simply.** One large quote, a three-stat row, channel logos in a strip. No testimonial
   card decks.
7. **An oversized closing CTA.** "Start with the ad, or start with the campaign." Two buttons.

Tokens only, from `src/styles/tokens.css`. Never a Front Row colour.

## 5. Copy rules (lint these, do not trust the prompt)

- No dollar figure, no "from $X" on any www page. `TODO(pricing)` stays.
- No competitor name on the homepage or the three door pages. Competitor contrasts live on reach spokes.
- No "month to month", "no long-term contract", "cancel anytime", "no minimum spend". The Reach term is
  3 months or unstated. The v2 mockup's "Month to month" card is **wrong as of 2026-10-22**; drop it.
- "The ads are included" / "creative included on every Reach plan" is current and allowed.
- Creative Lease: never the 10% / 5% / $2,500 / 12-month terms, never "buy-out", never the Tube
  Science name. No Tube Science anywhere on the site.
- The three result figures (3x ROAS Carve, -34% CPA fatty15, 2x return Mixbook) are **creative**
  results; never attribute them to Reach media.
- No em dashes. En dashes only inside number ranges.
- "Screenbridge Reach" is never written as a brand; it is "Reach" or "run CTV through Reach".
- Peacock is "by arrangement", not standard inventory. YouTube TV and Fire TV are not named as inventory.
- Copy is verbatim from the live site, the v2 mockup, or `mockups/copy-sources/`; new sentences are
  listed in the PR for Tim.

Add `scripts/check_copy_rules.py` (stdlib) to grep `content/` and `src/` for the banned strings
above and run it next to `npm run parity` in CI.

## 6. Clearance before anything goes public

- Every brand named or shown on a page: confirm the case-study clause in HubSpot / the signed SOW.
  Graza is unlisted on Vimeo and is **not** cleared until someone checks.
- Hero stills are web thumbnails with text burned in; a real build needs clean frames exported from
  the project files (Filmkraft). List the frames needed in the PR.
- M&M's stays off (dropped 2026-10-22). Tatari page stays parked until Tatari clears it.
- DNS cutover is a separate decision from Tim; the Webflow hold only blocks the cutover, not the build.

## 7. Execution steps

### Phase 1: make it one build (now)

1. `gh api user --jq .login` must print `screenbridge`.
2. In `~/Code/screenbridge-website`, fetch, then merge `mockups/homepage-directions` into
   `claude/site-shell-b38f19` (the `mockups/` folder and this doc are new paths; expect no conflicts).
   Push. Confirm PR #1 picks it up.
3. Add this doc to `README.md` on the branch under "Start here"; retire `BRIEF.md` (the Lovable brief,
   it still lists prices) by replacing its body with a pointer to this doc.
4. Send the build session (`local_5e9ef779-984e-4869-90e8-bed98b97edf8`, "Screenbridge.tv website
   redesign") the handoff in section 8. **Tim OKs the message first.**
5. Archive `local_585e13f8-ac9c-4d1d-af75-9585fd27f4a6` ("Website structure for Screenbridge") and
   this thread (`e88428f5`). **Tim OKs first.**
6. Update memory `project_www_rebuild_frontrow_reference` with: one build, this doc is the SoT.

### Phase 2: the premium pass (started 2026-10-23)

Each item is its own commit with a 1440 and 375 screenshot in `docs/screenshots/design-pass-2/`
and `npm run parity` + `check_copy_rules.py` green.

1. Tokens and layout: section padding, surface rhythm, nav to six items, footer facts block.
2. Homepage to the v2 structure (section 3 row 1). Remove the TV frame, channel tiles, testimonial
   deck, dashboard, feature grid, team grid, before/after.
3. `/creative` from the current homepage's tier and process content.
4. `/reach` from `content/ctv-media-buying-services.md` plus the v2 copy; 301 the old route.
5. `/performance-plan` new; copy drafted from `project_creative_lease` memory in plain words, no terms.
6. `/about` and `/contact`; `/for/*` pages last.
7. `/work` re-skin.
8. Clearance list (section 6) and the new-sentence list in the PR body for Tim.

### Phase 3: ship (Tim)

Dmitry sign-off on the preview, clearance list closed, then DNS. Not before.

## 8. Handoff message for the build session (draft, Tim approves)

> One build from here. The three website threads are merged into
> `docs/one-build-plan.md` on your branch (`claude/site-shell-b38f19`); the mockups and stills
> from the design thread are now under `mockups/` on the same branch. That doc is the single
> brief: page map, the seven design rules, the copy rules to lint, the clearance list, and the
> execution steps. Phase 2 (the premium pass) starts after Dmitry's feedback on the current
> preview unless Tim says sooner. Read section 2 first; those decisions are settled.
