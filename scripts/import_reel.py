#!/usr/bin/env python3
"""Build src/data/work.json (the /work video grid) from the reel finder.

Stdlib only. Runs the reel finder (screenbridge-agency/tools/screenbridge-showcase-catalog/
find.py) once per tier with --json, so its rules apply: spec work and non-public videos
are left out. Never hand-write a Vimeo link or id into the site; rerun this instead.

    python3 -I scripts/import_reel.py
    python3 -I scripts/import_reel.py --finder /path/to/find.py [--catalog /path/to/catalog.json]

One spot per brand + campaign + tier: variants and YouTube cuts are dropped, and the
30s cut is preferred over the 15s.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "work.json"
DEFAULT_FINDER = Path.home() / "Code/screenbridge-agency/tools/screenbridge-showcase-catalog/find.py"
TIERS = ("Standard", "Premium", "Signature")
SKIP_FORMATS = {"Variant", "YouTube Cut"}
LENGTH_PREF = {"30s": 0, "15s": 1, "60s": 2, "6s": 3}


def run_finder(finder: Path, catalog: str | None, tier: str) -> list[dict]:
    cmd = [sys.executable, "-I", str(finder), "--tier", tier, "--json"]
    if catalog:
        cmd += ["--catalog", catalog]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        sys.exit(f"reel finder failed for {tier}: {res.stderr.strip()}")
    return json.loads(res.stdout)


def vimeo_ref(url: str) -> tuple[str, str]:
    # vimeo.com/<id> or vimeo.com/<id>/<hash> (unlisted spots need the hash)
    m = re.match(r"https://vimeo\.com/(\d+)(?:/([0-9a-f]+))?", url)
    if not m:
        sys.exit(f"unexpected Vimeo url: {url}")
    return m.group(1), m.group(2) or ""


def key(v: dict) -> tuple:
    campaign = re.sub(r"[^a-z0-9]", "", (v.get("campaign") or "").lower())
    return (v["company"].lower(), campaign, v["tier"])


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--finder", default=os.environ.get("SB_REEL_FINDER", str(DEFAULT_FINDER)))
    p.add_argument("--catalog", help="catalog.json, if not next to find.py")
    a = p.parse_args()
    finder = Path(a.finder)
    if not finder.exists():
        sys.exit(f"reel finder not found: {finder} (pass --finder or set SB_REEL_FINDER)")

    spots = []
    for tier in TIERS:
        spots += run_finder(finder, a.catalog, tier)

    best: dict[tuple, dict] = {}
    for v in sorted(spots, key=lambda v: (LENGTH_PREF.get(v.get("length"), 9), v.get("added", ""))):
        if v.get("spec") or not v.get("public", True):
            continue  # belt and braces: the finder already hides these
        if set(v.get("formats", [])) & SKIP_FORMATS:
            continue
        best.setdefault(key(v), v)

    out = []
    for v in sorted(best.values(), key=lambda v: v.get("added", ""), reverse=True):
        vid, h = vimeo_ref(v["url"])
        out.append(
            {
                "id": vid,
                "hash": h,
                "brand": v["company"],
                "campaign": v.get("campaign") or "",
                "tier": v["tier"],
                "length": v.get("length", ""),
                "seconds": v.get("seconds"),
                "verticals": v.get("verticals", []),
                "title": v["title"],
                "url": v["url"],
                # the catalog stores 480x270; Vimeo serves the same frame at 960x540
                "thumb": v["thumb"].replace("_480x270", "_960x540"),
                "added": v.get("added", ""),
            }
        )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    counts = {t: sum(1 for v in out if v["tier"] == t) for t in TIERS}
    print(f"wrote {OUT.relative_to(ROOT)}: {len(out)} spots {counts}, {len({v['brand'] for v in out})} brands")
    return 0


if __name__ == "__main__":
    sys.exit(main())
