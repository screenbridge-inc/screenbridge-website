# Screenbridge Instant on the site: integration plan

Status: draft for the team walkthrough, 2026-10-23. Marketing surface only. Instant's
product scope (features, credit model, naming) belongs to Steve; nothing here decides it.

## The brand map

Screenbridge is the umbrella. Three business lines (decided 2026-10-23):

| Line | What it is | Who it fits |
| --- | --- | --- |
| Ads (Standard / Premium / Signature, at /creative) | Custom CTV ads made to order by our team. Two ways to pay: upfront per ad, or the Performance Plan (a share of media spend) | Brands that want the best ad |
| Reach | CTV media buying with the ads included | Brands that want one team for ad and media |
| **Instant** | Self-serve tool: upload your own video, get TV versions, pay with credits | In-house teams, smaller budgets, anyone testing TV |

The Performance Plan is a payment option on the Ads page, not its own page: /performance-plan
redirects to /creative. No dollar figures on the Ads page; the call sorts budget and plan.

Positioning rule: Instant is close to our Standard package and made by the customer;
a Screenbridge ad is custom, higher production value, more animation. Every Instant
surface offers the upgrade path to a Screenbridge ad.

## Phase 1: built on this branch (draft, noindex)

- **Nav:** "Instant" after Reach in the top bar and footer.
- **/instant:** hero (dark still, early-access CTA), how it works (Upload, Pick, Export,
  Test), who it is for, Instant vs a Screenbridge ad, credit tiers (no figures), FAQ,
  dark close. `noindex`, left out of the sitemap, no JSON-LD yet.
- **Homepage band:** "Prefer to make them yourself?" panel above the platforms section,
  linking to /instant.
- **CTA:** a mailto for early access (`INSTANT_ACCESS_URL` in `src/site.ts`), one place
  to swap for the real signup link.

## Open decisions before it goes live

1. **Credit model** (Steve + Tim): credits per version, pack sizes, prices, whether Team is
   monthly. Pricing on the page is credits only until this is set; dollar figures stay off
   every page except /for/local-businesses.
2. **Signup URL:** replace the mailto with the product's signup or waitlist page.
3. **Feature claims:** check every line in "How it works" and the tier bullets against what
   Instant actually does at launch (three versions, export sizes, brand kit, seats).
4. **Name:** "Screenbridge Instant" or "Instant by Screenbridge" (mirror "Reach by
   Screenbridge" if that is the house pattern).
5. **Imagery:** the hero uses a Tubby Todd still; confirm clearance or swap for product UI
   or before/after frames of an Instant export, which sell it better.
6. **Demo:** a 15-second before/after (phone UGC in, TV version out) would carry the page.
   Needs footage rights from the customer whose video it is.

## Phase 2: at launch

- Remove `noindex`, add Service + FAQPage JSON-LD (same pattern as creative.md),
  add /instant to the sitemap, and run parity.
- Real signup CTA everywhere `INSTANT_ACCESS_URL` is used.
- Cross-links: a line on /creative ("Making them yourself? Try Instant"), a line on /reach
  FAQ for in-house media teams, and Instant as the low tier on /for/* audience pages where
  budget is the objection.
- "Compare" section or page across the three lines (Ads, Reach, Instant) so visitors self-sort.

## Phase 3: after launch

- Upgrade path inside the product to a Screenbridge ad, mirrored on the site with a
  case study of an Instant version that was upgraded.
- Instant examples on /work, labelled as Instant so they never pass as custom ads.
- SEO: a spoke page for "make a TV ad from UGC" style queries pointing to /instant, via the
  content_writer brief bus.
- Tracking: a GA4 event for early-access and signup clicks, kept separate from booked-call
  conversions so Instant leads do not inflate the Creative/Reach funnel.
