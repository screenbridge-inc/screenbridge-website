import { Link } from "react-router-dom";
import { BOOK_CALL_URL, REACH_URL } from "../site";
import type { Section } from "../lib/content";

// Door-page hero: one full-bleed ad still (front matter `hero`) under the H1 and lead
// of the first section. Frames are picked with empty space top-left for the copy.
// `variant="reach"` is the light Reach panel from the homepage; its CTA goes to Reach.
export default function StillHero({ section, src, variant }: { section: Section; src: string; variant?: string }) {
  const h1 = section.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  const lead = section.html.replace(/<h1[\s\S]*?<\/h1>/, "");
  const reach = variant === "reach";
  return (
    <section className={`hero hero-still${reach ? " hero-still-reach" : ""}`} aria-labelledby="hero-title">
      <div className={`hero-pane ${reach ? "hero-reach" : "hero-ads on-dark"}`}>
        <img src={src} alt="" width={1920} height={1080} {...{ fetchpriority: "high" }} decoding="async" />
        <div className="hero-copy">
          {reach && <p className="eyebrow">Reach</p>}
          <h1 id="hero-title" dangerouslySetInnerHTML={{ __html: h1 }} />
          <div className="lead" dangerouslySetInnerHTML={{ __html: lead }} />
          <div className="hero-ctas">
            {reach ? (
              <>
                <a href={REACH_URL} className="btn btn-ink btn-lg">
                  Plan a campaign
                </a>
                <a href={BOOK_CALL_URL} className="btn btn-outline btn-lg">
                  Book a call
                </a>
              </>
            ) : (
              <>
                <a href={BOOK_CALL_URL} className="btn btn-primary btn-lg">
                  Book a call
                </a>
                <Link to="/work" className="btn btn-outline btn-lg">
                  See the ads
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
