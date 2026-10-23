#!/usr/bin/env python3
"""Copy-rule lint for www: fails when a banned string reaches content/ or src/.

The rules are section 5 of docs/one-build-plan.md. Prompts drift; this does not.
Stdlib only, never edits a file.

    python3 -I scripts/check_copy_rules.py
Exit code 0 when clean, 1 when any rule is broken.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN = [ROOT / "content", ROOT / "src"]
# Generated catalog: holds every spot, cleared or not. src/lib/work.ts filters it, and the
# built pages in dist/ are checked for the brand rules below.
SKIP = {"src/data/work.json"}
DIST = ROOT / "dist"
BRAND_RULES = {"M&M's", "Graza (not cleared)", "Tatari (page parked)", "Tube Science"}
EXTS = {".md", ".ts", ".tsx", ".json", ".html"}
# Legal pages quote contract language verbatim; only the brand rules apply there.
LEGAL = {"content/terms-conditions.md", "content/privacy-policy.md", "content/ugc-ad-checker-terms-conditions.md"}
# The homepage and the three door pages carry no competitor name.
DOORS = {"content/index.md", "content/creative.md", "content/performance-plan.md", "content/reach.md"}
# The local ladder is the one page with dollar figures (Tim, 2026-10-23). Every other rule applies.
ALLOW_DOLLARS = {"content/for/local-businesses.md"}

# (rule, pattern, applies to legal pages too)
RULES = [
    ("dollar figure (keep TODO(pricing))", r"\$\s?\d", False),
    ("em dash", "—", True),
    ('"month to month"', r"month[\s-]+to[\s-]+month", False),
    ('"no long-term contract"', r"no long[\s-]term contract", False),
    ('"cancel anytime"', r"cancel any\s?time", False),
    ('"no minimum spend"', r"no minimum spend", False),
    ("Tube Science", r"tube\s?science", True),
    ('"Screenbridge Reach" as a brand', r"screenbridge\s+reach\b", True),
    ("Creative Lease buy-out", r"buy[\s-]?out", False),
    ("Creative Lease terms", r"\b(10|5)\s?%\s*(of|on)\s+(ad\s+)?spend", False),
    ("M&M's", r"m\s?(&|&amp;)\s?m", True),
    ("Graza (not cleared)", r"\bgraza\b", True),
    ("Tatari (page parked)", r"\btatari\b", True),
    ("YouTube TV / Fire TV as inventory", r"youtube\s+tv|fire\s?tv", False),
]
COMPETITORS = r"\b(mntn|tvscientific|madhive|innovid|vibe\.co|universal ads|simpli\.?fi|keynes|tubescience)\b"


def files():
    for base in SCAN:
        for p in sorted(base.rglob("*")):
            if p.is_file() and p.suffix in EXTS and "styles" not in p.parts:
                yield p


def main() -> int:
    errors = []
    for p in files():
        rel = p.relative_to(ROOT).as_posix()
        if rel in SKIP:
            continue
        text = p.read_text(encoding="utf-8")
        # A line that names a banned string in order to enforce it (a deny list) opts out.
        text = "\n".join("" if "copy-rules: allow" in l else l for l in text.splitlines())
        if p.suffix in {".ts", ".tsx"}:
            # Code comments and regex sources are not copy; lint string and JSX text only.
            text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
            text = re.sub(r"(^|\s)//.*$", "", text, flags=re.M)
            text = "\n".join(l for l in text.splitlines() if ".replace(" not in l)
        rules = [r for r in RULES if r[2] or rel not in LEGAL]
        if rel in ALLOW_DOLLARS:
            rules = [r for r in rules if not r[0].startswith("dollar figure")]
        if rel in DOORS:
            rules.append(("competitor name on a door page", COMPETITORS, True))
        for n, line in enumerate(text.splitlines(), 1):
            for name, pat, _ in rules:
                if re.search(pat, line, re.I):
                    errors.append(f"{rel}:{n}: {name}: {line.strip()[:120]}")
    # What a visitor actually sees: the prerendered pages, when a build exists.
    if DIST.is_dir():
        for p in sorted(DIST.rglob("*.html")):
            if "server" in p.parts:
                continue
            body = re.sub(r"<[^>]+>", " ", p.read_text(encoding="utf-8"))
            for name, pat, _ in RULES:
                if name in BRAND_RULES and re.search(pat, body, re.I):
                    errors.append(f"{p.relative_to(ROOT).as_posix()}: {name} in the built page")
    for e in errors:
        print(e)
    print(f"check_copy_rules: {'FAIL' if errors else 'ok'} ({len(errors)} finding(s))")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
