#!/usr/bin/env python3
"""One-off importer: reference/webflow/*.html -> content/*.md (text only).

Stdlib only. Keeps headings, paragraphs, list items, images and CTA links in
document order; skips nav, the shared footer section, lightboxes, scripts,
hidden Webflow conditions and the paid-traffic hero variants. Every dollar
figure is replaced with a TODO comment until pricing is settled.

Usage: python3 scripts/extract_webflow.py [--force]
Existing content files are left alone unless --force is given, because the
markdown is hand-edited after import. Files whose front matter says
`hand_edited: true` (the designed pages) are never overwritten, even with --force.
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "reference" / "webflow"
OUT = ROOT / "content"
SITE = "https://www.screenbridge.tv"

SKIP_TAGS = {"script", "style", "noscript", "svg", "nav", "iframe", "form", "select", "textarea", "template", "head"}
VOID = {"img", "br", "hr", "input", "meta", "link", "source", "area", "base", "col", "embed", "param", "track", "wbr"}
SKIP_CLASS = re.compile(r"(sb_sectionfooter|sb_footer|lightbox|w-condition-invisible|w-nav|navbar|sb_menu|w-dyn-empty|w-form-fail|cookie)", re.I)
BLOCK = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote"}
DOLLAR = re.compile(r"(?:US)?\$\s?\d[\d,]*(?:\.\d+)?\s?(?:[kKmM]\b)?(?:\s?(?:/|per)\s?\w+)?(?:\s?[-–]\s?\$?\s?\d[\d,]*(?:\.\d+)?[kKmM]?)?\+?")
PRICE_TODO = "<!-- TODO(pricing): figure removed until pricing is settled -->"

LINK_MAP = {"index.html": "/"}

PRICE_KEYS = {"price", "priceSpecification", "lowPrice", "highPrice", "priceRange", "priceCurrency"}


def scrub_prices(node):
    """Drop every price field from JSON-LD until pricing is settled."""
    if isinstance(node, dict):
        return {k: scrub_prices(v) for k, v in node.items() if k not in PRICE_KEYS}
    if isinstance(node, list):
        return [scrub_prices(v) for v in node]
    return node


# The four Work pages share one layout and differ only in which tab (Standard,
# Premium, Signature) is open; the ad grid itself is CMS. Each gets its intro
# line, taken from the package descriptions in the homepage schema, so every
# route carries copy of its own.
WORK_INTRO = {
    "work": "Browse Standard, Premium and Signature ads made from real creator content.",
    "work-standard": "Standard: the fastest, simplest way to launch UGC on CTV. Transform one finished social ad with static custom designs and simple motion graphics.",
    "work-premium": "Premium: our most popular option to elevate your UGC into a premium TV-ready format. Transform your raw UGC or creator material with animated custom designs.",
    "work-signature": "Signature: make a splash with a hero ad built for brand awareness and long-term use. Best-in-class storytelling and pacing that grabs attention.",
}

# Pages whose body is a copy of another page get one line of their own after
# the H1, so each route has copy that identifies it. Creators uses its own meta
# description, which is the only text on that page that differs from the homepage.
LEDE = {
    "creators": "Free creator network. Get hired directly by brands with 0% platform fee, or earn 2% recurring CTV ad-spend (or 10% project fee) for referrals.",
    "search": "Results from across the Screenbridge site appear here.",
    "ugc-ad-checker-testingpage": "This is the test version of the UGC Ad Checker, kept out of search.",
}

# Utility pages that should stay out of the index even though Webflow did not
# mark them: the post-form thank-you page and on-site search results.
NOINDEX_EXTRA = {"launch", "search"}


def map_href(href: str) -> str:
    href = href.strip()
    if href.endswith(".html") and "/" not in href:
        return LINK_MAP.get(href, "/" + href[:-5])
    if href.startswith("https://www.screenbridge.tv"):
        return href[len("https://www.screenbridge.tv"):] or "/"
    return href


class Extractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, skip)
        self.blocks = []  # (kind, text)
        self.cur = None  # [kind, parts]
        self.link = None  # [href, parts]

    @property
    def skipping(self):
        return any(s for _, s in self.stack)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class") or ""
        skip = (
            tag in SKIP_TAGS
            or bool(SKIP_CLASS.search(cls))
            or "display:none" in (a.get("style") or "").replace(" ", "")
            or a.get("data-variant") is not None
            or a.get("aria-hidden") == "true"
        )
        if tag in VOID:
            if tag == "img" and not self.skipping and not skip:
                src = a.get("src") or ""
                if src.startswith("images/") and not src.endswith(".svg"):
                    self.flush()
                    self.blocks.append(("img", (src, a.get("alt") or "")))
            if tag == "br" and self.cur is not None:
                self.cur[1].append(" ")
            return
        self.stack.append((tag, skip))
        if self.skipping:
            return
        if tag in BLOCK:
            self.flush()
            self.cur = [tag, []]
        elif tag == "a":
            self.link = [a.get("href") or "", []]
        elif tag in ("div", "section") and self.cur is None:
            pass

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        # pop to matching tag (tolerate sloppy markup)
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                was_skipping = self.skipping
                del self.stack[i:]
                if was_skipping and self.skipping:
                    return
                break
        else:
            return
        if self.skipping:
            return
        if tag == "a" and self.link is not None:
            href, parts = self.link
            text = norm("".join(parts))
            self.link = None
            if self.cur is not None:
                if text and href and not href.startswith("#"):
                    self.cur[1].append(f"[{text}]({map_href(href)})")
                else:
                    self.cur[1].append(text)
            elif text and href and not href.startswith("#") and not href.startswith("javascript"):
                self.blocks.append(("cta", (text, map_href(href))))
            return
        if tag in BLOCK and self.cur is not None and self.cur[0] == tag:
            self.flush()
        if tag in ("div",) and self.cur is None:
            pass

    def handle_data(self, data):
        if self.skipping:
            return
        if self.link is not None:
            self.link[1].append(data)
        elif self.cur is not None:
            self.cur[1].append(data)
        else:
            t = norm(data)
            if len(t) > 2:
                self.blocks.append(("text", t))

    def flush(self):
        if self.cur is None:
            return
        kind, parts = self.cur
        self.cur = None
        t = norm("".join(parts))
        if t:
            self.blocks.append((kind, t))


def norm(s: str) -> str:
    s = s.replace(" ", " ").replace("‍", "")
    s = re.sub(r"\s+", " ", s).strip()
    # no em dashes in site copy
    s = s.replace(" — ", ", ").replace("—", ", ")
    return s


BARE_PRICE = re.compile(r"^\d{1,3}(?:,\d{3})+(?:\.\d\d)?$")  # struck-through prices without "$"
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2190-\u21FF\uFE0F]")

# Pages whose Webflow build has no <h1>: the H1 the new page uses.
H1_OVERRIDE = {
    "ugc-ad-checker": "Screenbridge UGC Ad Checker",
    "keynesdigital-screenbridge": "Keynes Digital + Screenbridge",
}


def strip_prices(s: str) -> tuple[str, int]:
    s = EMOJI.sub("", s).strip()
    if BARE_PRICE.match(s.lstrip("#- ")):
        return "", 1
    n = len(DOLLAR.findall(s))
    s = DOLLAR.sub("", s)
    s = re.sub(r"\(\s*\)|\s{2,}", " ", s).strip()
    return s, n


def to_markdown(blocks):
    lines = []
    seen_h1 = False
    last = None
    prices = 0
    seen = set()
    for kind, val in blocks:
        if kind == "img":
            src, alt = val
            line = f"![{alt}](/{src})"
        elif kind == "cta":
            text, href = val
            if not text or len(text) > 60:
                continue
            line = f"[{text}]({href}){{.cta}}"
        else:
            text = val
            if kind == "h1":
                if seen_h1:
                    kind = "h2"
                seen_h1 = True
            if kind.startswith("h"):
                line = "#" * int(kind[1]) + " " + text
            elif kind == "li":
                line = "- " + text
            elif kind == "blockquote":
                line = "> " + text
            else:
                line = text
        line, n = strip_prices(line)
        prices += n
        if n:
            line = (line + "\n" + PRICE_TODO) if line.strip("#- ") else PRICE_TODO
        # Webflow ships desktop and mobile copies of the same blocks (and
        # carousel clones), so keep only the first occurrence of each line.
        key = line.lstrip("#>- ").strip()
        if line == last or (key in seen and (len(key) > 12 or kind == "img")):
            continue
        seen.add(key)
        lines.append(line)
        last = line
    out = []
    for i, line in enumerate(lines):
        if line.startswith("- ") and out and out[-1].startswith("- "):
            out.append(line)
        else:
            if out:
                out.append("")
            out.append(line)
    return "\n".join(out).strip() + "\n", seen_h1, prices


def meta(s, name=None, prop=None):
    if name:
        m = re.search(r'<meta[^>]+name="%s"[^>]+content="([^"]*)"' % re.escape(name), s) or re.search(
            r'<meta[^>]+content="([^"]*)"[^>]+name="%s"' % re.escape(name), s)
    else:
        m = re.search(r'<meta[^>]+property="%s"[^>]+content="([^"]*)"' % re.escape(prop), s) or re.search(
            r'<meta[^>]+content="([^"]*)"[^>]+property="%s"' % re.escape(prop), s)
    return html.unescape(m.group(1)).strip() if m else ""


def yaml_str(v: str) -> str:
    return json.dumps(v, ensure_ascii=False)


def main():
    force = "--force" in sys.argv
    OUT.mkdir(exist_ok=True)
    report = []
    for f in sorted(REF.glob("*.html")):
        s = f.read_text(encoding="utf-8", errors="replace")
        title = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1)).strip() if "<title>" in s else ""
        p = Extractor()
        body = s[s.find("<body"):]
        p.feed(body)
        p.flush()
        md, has_h1, prices = to_markdown(p.blocks)
        stem = f.stem
        template = stem.startswith("detail_")
        if template:
            # CMS template: no real item exists in the export. Render a labelled
            # sample so the route and layout exist; items come from the Webflow
            # API later. The empty schema blocks are dropped.
            coll = stem[len("detail_"):]
            label = coll.replace("-", " ")
            md = (f"# Sample {label} item\n\n"
                  f"This is the template for one {label} item. The real items load from the Webflow CMS later.\n\n" + md)
            has_h1 = True
        if stem in LEDE:
            md = re.sub(r"^(# .+)\n*", lambda m: m.group(1) + "\n\n" + LEDE[stem] + "\n\n", md, count=1, flags=re.M)
        if stem in WORK_INTRO:
            md = md.replace("# Real UGC Transformed Into CTV Ads\n\n",
                            "# Real UGC Transformed Into CTV Ads\n\n" + WORK_INTRO[stem] + "\n\n", 1)
        if not has_h1 and stem in H1_OVERRIDE:
            md = f"# {H1_OVERRIDE[stem]}\n\n" + md
        report.append((stem, title, has_h1, prices, len(md)))
        target = OUT / (f"{coll}/sample.md" if template else f"{stem}.md")
        target.parent.mkdir(exist_ok=True)
        if target.exists() and (not force or "\nhand_edited: true\n" in target.read_text()):
            continue
        desc = meta(s, name="description") or meta(s, prop="og:description")
        if not desc:
            # Webflow left it blank: use the first real paragraph, cut at a word.
            for line in md.splitlines():
                t = re.sub(r"\[([^\]]*)\]\([^)]*\)(\{\.cta\})?", r"\1", line).strip()
                if len(t) >= 40 and not t.startswith(("#", "!", "<!--", "-", "*")):
                    desc = t if len(t) <= 155 else t[:155].rsplit(" ", 1)[0].rstrip(",.;:") + "..."
                    break
        route = f"/{coll}/sample" if template else ("/" if stem == "index" else "/" + stem)
        if template:
            title = f"Sample {label} item | Screenbridge"
        canonical = SITE + ("/" if route == "/" else route)
        robots = re.search(r'<meta[^>]*content="noindex"[^>]*name="robots"', s)
        noindex = bool(robots) or stem in NOINDEX_EXTRA or template
        jsonld = []
        for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try:
                j = json.loads(m)
            except ValueError:
                continue
            if isinstance(j, dict) and j.get("@type") in ("WebPage", "CollectionPage"):
                j["url"] = canonical
            if not template:
                jsonld.append(scrub_prices(j))
        jl = json.dumps(jsonld, ensure_ascii=False, indent=2)
        jl = re.sub(r"\s*\u2014\s*", ", ", jl)  # no em dashes in site copy
        # The Webflow-hosted logo goes away with Webflow; point at our own lockup.
        jl = jl.replace(
            "https://cdn.prod.website-files.com/678681240b4fb7a9e9a627c4/6792bc8b832af44fcb8fdbf1_screenBridgeLogoClear.svg",
            SITE + "/brand/horizontal-logo-dark.png",
        )
        jl, n = DOLLAR.subn("", jl)
        if n:
            print(f"  ! {stem}: removed {n} dollar figure(s) from JSON-LD")
        fm = [
            "---",
            f"title: {yaml_str(title)}",
            f"description: {yaml_str(desc)}",
            f"canonical: {canonical}",
            f"ogImage: {SITE}/images/OpengraphScreenbridge.png",
            f"noindex: {'true' if noindex else 'false'}",
            f"source: reference/webflow/{f.name}",
            *(["template: true"] if template else []),
            "jsonld: " + jl.replace("\n", "\n  "),
            "---",
            "",
        ]
        target.write_text("\n".join(fm) + md, encoding="utf-8")
    for r in report:
        print("%-36s h1=%-5s prices=%-3d chars=%d  %s" % (r[0], r[2], r[3], r[4], r[1]))


if __name__ == "__main__":
    main()
