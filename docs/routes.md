# Routes

One route per page in the Webflow export (`reference/webflow/`, 28 files). Paths are
kept exactly as Webflow serves them: the file name without `.html`, and
`index.html` is `/`. No trailing slashes (`vercel.json` sets `trailingSlash: false`).
Each route's copy lives in `content/<route>.md`.

Title and H1 are the current Webflow values. Where the new shell's H1 differs, the
note says what the shell renders (Webflow pages with no H1 get one, since every
route must carry an H1 in its raw HTML).

| Webflow file | Route | Current title | Current H1 | Notes |
|---|---|---|---|---|
| `beauty.html` | `/beauty` | Screenbridge for Beauty Brands | Turn your best beauty UGC into premium CTV ads in days |  |
| `blog.html` | `/blog` | Blog | Tips for best performance |  |
| `case-studies.html` | `/case-studies` | Case studies | Client Success Stories |  |
| `creators.html` | `/creators` | Creators | Bring the Power of UGC to CTV |  |
| `ctv-media-buying-services.html` | `/ctv-media-buying-services` | CTV Media Buying Services | Screenbridge+ Expand into new channels with your UGC. Creative is free. |  |
| `detail_addons.html` | `/addons/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample addons item |
| `detail_blog-posts.html` | `/blog-posts/sample` | &#124; Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample blog posts item |
| `detail_case-studies.html` | `/case-studies/sample` | Case Study &#124; Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample case studies item |
| `detail_categories.html` | `/categories/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample categories item |
| `detail_clients-ads.html` | `/clients-ads/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample clients ads item |
| `detail_new-members.html` | `/new-members/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample new members item |
| `detail_stripeproducts.html` | `/stripeproducts/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample stripeproducts item |
| `detail_work.html` | `/work/sample` | Screenbridge | (none in Webflow) | template, items from Webflow API later (noindex); shell H1: Sample work item |
| `index.html` | `/` | Transform UGC Videos into CTV Ads &#124; Screenbridge | Bring the Power of UGC to CTV |  |
| `keynesdigital-screenbridge.html` | `/keynesdigital-screenbridge` | Keynes Digital + Screenbridge | (none in Webflow) | noindex; shell H1: Keynes Digital + Screenbridge |
| `launch.html` | `/launch` | Launch | Thank You for Submitting Your Form! | noindex |
| `privacy-policy.html` | `/privacy-policy` | Privacy policy | Screenbridge Privacy Policy |  |
| `screenbridge-youtube.html` | `/screenbridge-youtube` | Screenbridge-youtube | The Power of UGC Content on YouTube |  |
| `search.html` | `/search` | Search Results | Search results | noindex |
| `terms-conditions.html` | `/terms-conditions` | Terms & conditions | Screenbridge Terms & Conditions |  |
| `ugc-ad-check-v2.html` | `/ugc-ad-check-v2` | ugc Ad Check v2 | Screenbridge UGC Ad Checker | noindex |
| `ugc-ad-checker-terms-conditions.html` | `/ugc-ad-checker-terms-conditions` | AI tool Terms & conditions | Screenbridge UGC Ad Checker – Terms & Conditions |  |
| `ugc-ad-checker-testingpage.html` | `/ugc-ad-checker-testingpage` | Screenbridge UGC Ad Checker - Analyze Your UGC and Creator Content for Performance | Screenbridge UGC Ad Checker | noindex |
| `ugc-ad-checker.html` | `/ugc-ad-checker` | Screenbridge UGC Ad Checker - Analyze Your UGC and Creator Content for Performance | (none in Webflow) | shell H1: Screenbridge UGC Ad Checker |
| `work-premium.html` | `/work-premium` | work Premium | Real UGC Transformed Into CTV Ads |  |
| `work-signature.html` | `/work-signature` | work Signature | Real UGC Transformed Into CTV Ads |  |
| `work-standard.html` | `/work-standard` | work standard | Real UGC Transformed Into CTV Ads |  |
| `work.html` | `/work` | Work | Real UGC Transformed Into CTV Ads |  |

## CMS templates

The eight `detail_*.html` files are Webflow CMS templates, not pages. Each one is
wired as `/<collection>/sample` with a labelled placeholder item, `noindex`, and is
left out of the sitemap. **Template, items from Webflow API later**: when Webflow
work resumes, a build step pulls each collection's items and renders
`/<collection>/<slug>` with the same layout.

The `/blog-posts/` and `/case-studies/` prefixes match the live sitemap. The other
six prefixes are taken from the template file names; confirm each against the
collection's slug in Webflow before items go live.

## noindex

`keynesdigital-screenbridge`, `ugc-ad-check-v2` and `ugc-ad-checker-testingpage`
are `noindex` in Webflow and stay that way. `launch` (the post-form thank-you page),
`search` and the eight template samples are also `noindex`. Everything else is in
`sitemap.xml` (15 URLs).

## 301 map

**No redirects.** Every Webflow path is served at the same path, so no URL changes and
nothing needs a 301. `vercel.json` carries an empty `redirects` list for when one is
needed; add entries there as `{ "source": "/old", "destination": "/new", "permanent": true }`.

| From | To | Why |
|---|---|---|
| (none) | | |

## Live pages missing from the export

These are in the live sitemap but not in the June 2026 export, so the shell has no
route for them yet. Each needs a fresh export or its content written into
`content/` before launch, or the URL will 404:

- `/creator-affiliate-program`
- `/faq`
- `/fashion`
- `/performance-model`

Live CMS items under `/blog-posts/<slug>` and `/case-studies/<slug>` also need the
Webflow API import above.
