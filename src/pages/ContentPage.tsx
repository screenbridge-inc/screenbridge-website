import { useNavigate } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import StillHero from "../components/StillHero";
import { sectionExtra } from "../components/sectionExtras";
import type { Page, PageMeta, Section } from "../lib/content";

// Section classes (`## Heading {.name}` in markdown) that sit on a dark band.
const DARK = new Set(["testimonials", "book", "close"]);

type Props = {
  page: Page;
  meta?: PageMeta;
  // replaces the first section (the homepage hero)
  first?: ReactNode;
  // extra React content appended inside a section, after its markdown
  extra?: (s: Section, i: number) => ReactNode;
};

// One <section> per h2 of the markdown.
export default function ContentPage({ page, meta, first, extra = sectionExtra }: Props) {
  if (!first && page.hero) first = <StillHero section={page.sections[0]} src={page.hero} />;
  const navigate = useNavigate();
  // Internal links inside markdown HTML use client-side navigation.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href || !href.startsWith("/") || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    if (e.defaultPrevented) return;
    e.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  };
  return (
    <>
      <Seo meta={meta ?? page} />
      <div className="page" data-route={page.path} onClick={onClick}>
        {page.sections.map((s, i) => {
          if (i === 0 && first) return <div key={i}>{first}</div>;
          const cls = [
            "section",
            s.cls ? `sec-${s.cls}` : "plain",
            DARK.has(s.cls) ? "on-dark" : "",
            i === 0 ? "section-first" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const body = (
            <div className="wrap">
              <div className="md" dangerouslySetInnerHTML={{ __html: s.html }} />
              {extra?.(s, i)}
            </div>
          );
          return i === 0 ? (
            <section key={i} id={s.id || undefined} className={cls}>
              {body}
            </section>
          ) : (
            <Reveal key={i} id={s.id || undefined} className={cls}>
              {body}
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
