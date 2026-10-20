// Markdown content in git: content/<route>.md, front matter + body.
// content/index.md is "/", content/blog-posts/sample.md is "/blog-posts/sample".
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  template?: boolean;
  source?: string;
  jsonld?: Record<string, unknown>[];
};

export type Page = PageMeta & { path: string; h1: string; sections: string[] };

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
      .replace(/<a href="([^"]*)">([\s\S]*?)<\/a>\{\.cta\}/g, '<a class="cta" href="$1">$2</a>')
      .replace(/<img /g, '<img loading="lazy" decoding="async" ')
      // runs of image-only paragraphs become one gallery row
      .replace(/(?:<p>(?:<img [^>]*>\s*)+<\/p>\s*){2,}/g, (run) => {
        const imgs = run.match(/<img [^>]*>/g) ?? [];
        return `<div class="gallery">${imgs.join("")}</div>\n`;
      })
  );
}

function splitSections(html: string): string[] {
  return html
    .split(/(?=<h2[ >])/)
    .map((s) => s.trim())
    .filter(Boolean);
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
