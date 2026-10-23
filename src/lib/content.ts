// Markdown content in git: content/<route>.md, front matter + body.
// content/index.md is "/", content/blog-posts/sample.md is "/blog-posts/sample".
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  // full-bleed still behind the first section (a door page)
  hero?: string;
  // `reach`: the light Reach panel from the homepage, CTA to reach.screenbridge.tv
  hero_style?: string;
  noindex?: boolean;
  template?: boolean;
  source?: string;
  jsonld?: Record<string, unknown>[];
};

// One <section> per h2. `## Heading {.name}` gives the section a class; for the
// classes in GROUPED, each h3 and what follows it becomes one card.
export type Section = { html: string; cls: string; id: string };

export type Page = PageMeta & { path: string; h1: string; sections: Section[] };

const GROUPED = new Set(["channels", "tiers", "features", "team", "compare", "faq", "doors", "stats", "frames", "why", "loop"]);

const files = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

function toPath(file: string): string {
  const rel = file.replace(/^\/content\//, "").replace(/\.md$/, "");
  if (rel === "index") return "/";
  return "/" + rel.replace(/\/index$/, "");
}

function splitFrontMatter(raw: string): [Record<string, unknown>, string] {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return [{}, raw];
  return [parseYaml(m[1]) ?? {}, m[2]];
}

function postProcess(html: string): string {
  return (
    html
      // [text](href){.cta} marks a call-to-action link
      .replace(/<a href="([^"]*)">((?:(?!<\/?a[ >])[\s\S])*?)<\/a>\{\.cta\}/g, '<a class="cta" href="$1">$2</a>')
      // <p>Text {.name}</p> gives a paragraph a class (badges, eyebrows)
      .replace(/<p>((?:(?!<\/?p>)[\s\S])*?)\s*\{\.([\w-]+)\}<\/p>/g, '<p class="$2">$1</p>')
      .replace(/<img /g, '<img loading="lazy" decoding="async" ')
      // runs of image-only paragraphs become one gallery row
      .replace(/(?:<p>(?:<img [^>]*>\s*)+<\/p>\s*){2,}/g, (run) => {
        const imgs = run.match(/<img [^>]*>/g) ?? [];
        return `<div class="gallery">${imgs.join("")}</div>\n`;
      })
  );
}

function slug(s: string): string {
  return stripTags(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function group(html: string, cls: string): string {
  const [intro, ...items] = html.split(/(?=<h3[ >])/);
  if (!items.length) return html;
  const cards = items.map((item) => {
    const m = item.match(/^(<h3[^>]*>[\s\S]*?<\/h3>)([\s\S]*)$/);
    if (cls === "faq" && m) return `<details class="item"><summary>${m[1]}</summary>${m[2]}</details>`;
    return `<article class="item">${item}</article>`;
  });
  return `${intro}<div class="items">${cards.join("")}</div>`;
}

function splitSections(html: string): Section[] {
  return html
    .split(/(?=<h2[ >])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      let cls = "";
      s = s.replace(/^(<h2[^>]*>)([\s\S]*?)\s*\{\.([\w-]+)\}<\/h2>/, (_m, open, text, c) => {
        cls = c;
        return `${open}${text}</h2>`;
      });
      const h2 = s.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/);
      return { html: GROUPED.has(cls) ? group(s, cls) : s, cls, id: h2 ? slug(h2[1]) : "" };
    });
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
}

export const pages: Page[] = Object.entries(files)
  .map(([file, raw]) => {
    const [fm, body] = splitFrontMatter(raw);
    const html = postProcess(marked.parse(body, { async: false }) as string);
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    return {
      ...(fm as PageMeta),
      jsonld: Array.isArray(fm.jsonld) ? (fm.jsonld as Record<string, unknown>[]) : [],
      path: toPath(file),
      h1: h1 ? stripTags(h1[1]) : "",
      sections: splitSections(html),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

export const pageByPath = new Map(pages.map((p) => [p.path, p]));
