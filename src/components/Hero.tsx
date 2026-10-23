import { Link } from "react-router-dom";
import { BOOK_CALL_URL, REACH_URL } from "../site";
import type { Section } from "../lib/content";

// Split hero (mockup v2): two full-bleed ad stills. Left, dark: the ads. Right, a light
// panel: Reach. Copy comes from content/index.md; the h3 starts the Reach half.
export default function Hero({ section }: { section: Section }) {
  const [ads, reach = ""] = section.html.replace(/<h1[\s\S]*?<\/h1>/, "").split(/(?=<h3[ >])/);
  const reachTitle = reach.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? "";
  const reachBody = reach.replace(/<h3[\s\S]*?<\/h3>/, "");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-pane hero-ads on-dark">
        <img src="/stills/openfarm-cat.jpg" alt="" width={1920} height={1080} {...{ fetchpriority: "high" }} decoding="async" />
        <div className="hero-copy">
          <p className="eyebrow">Screenbridge ads</p>
          <h1 id="hero-title">
            Bring the power of UGC to <span className="t-accent">CTV</span>.
          </h1>
          <div className="lead" dangerouslySetInnerHTML={{ __html: ads }} />
          <div className="hero-ctas">
            <Link to="/work" className="btn btn-primary btn-lg">
              See the ads
            </Link>
            <a href={BOOK_CALL_URL} className="btn btn-outline btn-lg">
              Book a call
            </a>
          </div>
        </div>
      </div>
      <div className="hero-pane hero-reach">
        <img src="/stills/fatty15-signature-bottle.jpg" alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        <div className="hero-copy">
          <p className="eyebrow">Reach</p>
          <h2 dangerouslySetInnerHTML={{ __html: reachTitle }} />
          <div className="lead" dangerouslySetInnerHTML={{ __html: reachBody }} />
          <div className="hero-ctas">
            <a href={REACH_URL} className="btn btn-ink btn-lg">
              Plan a campaign
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
