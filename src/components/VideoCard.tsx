import type { MouseEvent } from "react";
import type { Spot } from "../lib/work";

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

// A link to the spot on Vimeo; with JavaScript it opens the lightbox instead.
export default function VideoCard({ spot, onOpen }: { spot: Spot; onOpen: (s: Spot) => void }) {
  const open = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    onOpen(spot);
  };
  return (
    <a className="vcard" href={spot.url} onClick={open}>
      <span className="vcard-media">
        <img src={spot.thumb} alt="" width={960} height={540} loading="lazy" decoding="async" />
        <span className="vcard-play">
          <PlayIcon />
        </span>
      </span>
      <span className="vcard-meta">
        <span className="vcard-brand">{spot.brand}</span>
        <span className={`tier tier-${spot.tier.toLowerCase()}`}>{spot.tier}</span>
      </span>
      <span className="vcard-sub">
        {[spot.campaign, spot.length].filter(Boolean).join(" · ")}
        <span className="sr-only"> {spot.tier} ad, play video</span>
      </span>
    </a>
  );
}
