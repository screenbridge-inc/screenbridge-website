// Post-build: render every content route to static HTML so crawlers get the
// real head tags and body copy without running JavaScript. React hydrates on top.
// Also writes 404.html, sitemap.xml and robots.txt.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://www.screenbridge.tv";
const dist = path.resolve("dist");
const shell = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, pages } = await import(pathToFileURL(path.join(dist, "server", "entry-server.js")).href);

function page(url) {
  const { html, head } = render(url);
  if (!shell.includes("<!--app-head-->") || !shell.includes("<!--app-html-->")) throw new Error("shell placeholders missing");
  return shell.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
}

let count = 0;
for (const p of pages) {
  const out = p.path === "/" ? path.join(dist, "index.html") : path.join(dist, p.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = page(p.path);
  if (!p.h1 || !html.includes("<h1")) throw new Error(`${p.path}: no H1 rendered`);
  fs.writeFileSync(out, html);
  count++;
}
fs.writeFileSync(path.join(dist, "404.html"), page("/__not-found__"));

// Sitemap: indexable routes only. No lastmod: we only publish dates we actually know.
const urls = pages
  .filter((p) => !p.noindex)
  .map((p) => `  <url><loc>${p.canonical || SITE_URL + p.path}</loc></url>`)
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.rmSync(path.join(dist, "server"), { recursive: true, force: true });
console.log(`prerendered ${count} routes + 404, sitemap has ${pages.filter((p) => !p.noindex).length} urls`);
