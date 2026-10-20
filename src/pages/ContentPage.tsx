import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import type { Page } from "../lib/content";

// Plain sectioned page: one <section> per h2 of the markdown. The homepage uses
// this too until the new hero is designed.
export default function ContentPage({ page }: { page: Page }) {
  const navigate = useNavigate();
  // Internal links inside markdown HTML use client-side navigation.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href || !href.startsWith("/") || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    e.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  };
  return (
    <>
      <Seo meta={page} />
      <div className="page" data-route={page.path} onClick={onClick}>
        {page.sections.map((html, i) =>
          i === 0 ? (
            <section key={i} className="wrap section section-first" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <Reveal key={i} className="wrap section">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Reveal>
          ),
        )}
      </div>
    </>
  );
}
