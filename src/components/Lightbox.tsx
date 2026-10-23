import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { embedUrl, spotName, type Spot } from "../lib/work";

// Full-screen Vimeo player. The rest of the page is inert while it is open, so
// focus stays inside; Esc, the close button or a click on the backdrop closes it.
export default function Lightbox({ spot, onClose }: { spot: Spot | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!spot) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.getElementById("root");
    const html = document.documentElement;
    root?.setAttribute("inert", "");
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root?.removeAttribute("inert");
      html.style.overflow = "";
      opener?.focus();
    };
  }, [spot, onClose]);

  if (!spot) return null;
  const name = spotName(spot);
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name}, ${spot.tier} ad`} onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-bar">
          <p>
            <strong>{name}</strong>
            <span className={`tier tier-${spot.tier.toLowerCase()}`}>{spot.tier}</span>
            {spot.length ? <span className="lightbox-len">{spot.length}</span> : null}
          </p>
          <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close video">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="lightbox-player">
          <iframe
            src={embedUrl(spot)}
            title={`${name} ${spot.tier} Screenbridge ad`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
