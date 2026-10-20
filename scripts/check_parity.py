#!/usr/bin/env python3
"""SEO parity check: does each route serve its real copy in the raw HTML?

For every content/<route>.md, fetches the route with a Googlebot user agent
(no JavaScript runs, exactly what a crawler sees first) and asserts that the
raw HTML contains:
  - the page's H1 (inside an <h1>),
  - one body sentence that is unique to that page's markdown,
  - a <title>, a meta description and a canonical link.

Stdlib only. Usage:
    python3 -I scripts/check_parity.py http://localhost:4173
    python3 -I scripts/check_parity.py https://preview.example.com --only /beauty
Exit code 0 when every route passes, 1 otherwise.
"""
import argparse
import html
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"


def route_for(md: Path) -> str:
    rel = md.relative_to(CONTENT).with_suffix("").as_posix()
    if rel == "index":
        return "/"
    return "/" + re.sub(r"/index$", "", rel)


def body_of(raw: str) -> str:
    m = re.match(r"^---\n.*?\n---\n?(.*)$", raw, re.S)
    return m.group(1) if m else raw


def plain(md_line: str) -> str:
    """Markdown inline -> the text a reader sees."""
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", md_line)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)(\{\.cta\})?", r"\1", s)
    s = re.sub(r"[*_`]+", "", s)
    s = re.sub(r"<!--.*?-->", "", s)
    s = re.sub(r"\s*\{\.[\w-]+\}", "", s)  # {.class} markers (see src/lib/content.ts)
    s = re.sub(r"^>\s?", "", s)  # blockquote markers
    return re.sub(r"\s+", " ", s).strip()


def norm(s: str) -> str:
    s = html.unescape(s)
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip()


def page_text(raw_html: str) -> str:
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", raw_html, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return norm(s)


def candidates(body: str):
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith(("#", "<!--", "!", "|", "---")):
            continue
        line = re.sub(r"^([-*+]|\d+\.)\s+", "", line)
        text = plain(line)
        if len(text) >= 30:
            yield text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("base", help="base URL, e.g. http://localhost:4173")
    ap.add_argument("--only", action="append", help="check just these routes")
    args = ap.parse_args()
    base = args.base.rstrip("/")

    files = sorted(CONTENT.rglob("*.md"))
    bodies = {route_for(f): body_of(f.read_text(encoding="utf-8")) for f in files}
    all_text = {r: norm(" ".join(plain(l) for l in b.splitlines())) for r, b in bodies.items()}

    failures = 0
    rows = []
    for route, body in bodies.items():
        if args.only and route not in args.only:
            continue
        h1m = re.search(r"^# (.+)$", body, re.M)
        h1 = norm(plain(h1m.group(1))) if h1m else ""
        sentence = ""
        for c in candidates(body):
            c = norm(c)
            if not any(c in t for r, t in all_text.items() if r != route):
                sentence = c
                break
        problems = []
        try:
            req = urllib.request.Request(base + route, headers={"User-Agent": GOOGLEBOT})
            with urllib.request.urlopen(req, timeout=20) as resp:
                status = resp.status
                raw = resp.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            status, raw = e.code, ""
        except OSError as e:
            status, raw = 0, ""
            problems.append(f"fetch failed: {e}")
        if status != 200:
            problems.append(f"HTTP {status}")
        h1s = [norm(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", raw, re.S)]
        if not h1:
            problems.append("no H1 in markdown")
        elif h1 not in h1s:
            problems.append(f"H1 missing: {h1!r} (raw has {h1s!r})")
        if not sentence:
            problems.append("no unique sentence in markdown")
        elif sentence not in page_text(raw):
            problems.append(f"sentence missing: {sentence[:70]!r}")
        if not re.search(r"<title[^>]*>[^<]+</title>", raw):
            problems.append("no <title>")
        if not re.search(r'<meta[^>]+name="description"', raw):
            problems.append("no meta description")
        if not re.search(r'<link[^>]+rel="canonical"', raw):
            problems.append("no canonical")
        ok = not problems
        failures += not ok
        rows.append((route, ok, h1, sentence, problems))

    for route, ok, h1, sentence, problems in rows:
        print(f"{'PASS' if ok else 'FAIL'}  {route}")
        print(f"      h1: {h1[:80]}")
        print(f"      sentence: {sentence[:80]}")
        for p in problems:
            print(f"      ! {p}")
    print(f"\n{len(rows) - failures}/{len(rows)} routes pass (Googlebot UA, raw HTML, no JS)")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
