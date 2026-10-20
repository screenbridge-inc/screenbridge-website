import { useCallback, useEffect, useState } from "react";
import Lightbox from "./Lightbox";
import VideoCard from "./VideoCard";
import { TIERS, WORK, type Spot, type Tier } from "../lib/work";

type Filter = "All" | Tier;
const FILTERS: Filter[] = ["All", ...TIERS];

// Filterable grid of every client spot. All cards are in the prerendered HTML;
// ?tier=premium deep-links a filter.
export default function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<Spot | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tier");
    const match = TIERS.find((x) => x.toLowerCase() === t?.toLowerCase());
    if (match) setFilter(match);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "All") url.searchParams.delete("tier");
    else url.searchParams.set("tier", f.toLowerCase());
    window.history.replaceState(window.history.state, "", url);
  };

  const shown = filter === "All" ? WORK : WORK.filter((s) => s.tier === filter);
  return (
    <div className="work">
      <div className="filters" role="group" aria-label="Filter by package">
        {FILTERS.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => choose(f)}>
            {f}
            <span>{f === "All" ? WORK.length : WORK.filter((s) => s.tier === f).length}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {filter === "All" ? "" : filter} ads
      </p>
      <ul className="vgrid" key={filter}>
        {shown.map((s) => (
          <li key={s.id}>
            <VideoCard spot={s} onOpen={setOpen} />
          </li>
        ))}
      </ul>
      <Lightbox spot={open} onClose={close} />
    </div>
  );
}
