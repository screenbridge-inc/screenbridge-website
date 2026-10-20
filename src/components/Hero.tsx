import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import Lightbox from "./Lightbox";
import { PlayIcon } from "./VideoCard";
import { BOOK_CALL_URL } from "../site";
import { HERO_CLIPS, findSpot, type Spot } from "../lib/work";
import type { Section } from "../lib/content";

const src = (file: string, ext: string) => `/videos/${file}-transcode.${ext}`;
const poster = (file: string) => `/videos/${file}-poster-00001.jpg`;

// Dark hero: the headline and lede come from content/index.md, the TV plays muted
// client spots one after another (no loop). Reduced motion: nothing autoplays.
export default function Hero({ section }: { section: Section }) {
  const paras = section.html.replace(/<h1[\s\S]*?<\/h1>/, "").match(/<p>[\s\S]*?<\/p>/g) ?? [];
  const [lede, ...rest] = paras;

  const reduce = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState<Spot | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const clip = HERO_CLIPS[i];
  const full = findSpot(clip.brand, clip.tier, clip.campaign ?? "");

  // Autoplay once hydrated, unless the visitor asked for less motion.
  useEffect(() => {
    if (!reduce) setPlaying(true);
  }, [reduce]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing, i]);

  const pick = (n: number) => {
    setI(n);
    setPlaying(true);
  };

  return (
    <section className="hero on-dark" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span className="t-regular">Bring the Power of</span> UGC to <span className="t-accent">CTV</span>
          </h1>
          {lede ? <div className="lead" dangerouslySetInnerHTML={{ __html: lede }} /> : null}
          <div className="hero-ctas">
            <a href={BOOK_CALL_URL} className="btn btn-primary btn-lg">
              Book Your Call
            </a>
            <Link to="/work" className="btn btn-outline btn-lg">
              See the work
            </Link>
          </div>
          <div className="hero-note" dangerouslySetInnerHTML={{ __html: rest.join("") }} />
        </div>

        <div className="hero-tv">
          <div className="tv">
            <div className="tv-screen">
              <video
                key={clip.file}
                ref={video}
                muted
                playsInline
                preload={i === 0 ? "metadata" : "auto"}
                poster={poster(clip.file)}
                onEnded={() => setI((n) => (n + 1) % HERO_CLIPS.length)}
                aria-label={`${clip.brand} ${clip.tier} ad, muted preview`}
              >
                <source src={src(clip.file, "webm")} type="video/webm" />
                <source src={src(clip.file, "mp4")} type="video/mp4" />
              </video>
              <div className="tv-controls">
                <button
                  type="button"
                  className="tv-btn"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause preview" : "Play preview"}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                    </svg>
                  ) : (
                    <PlayIcon />
                  )}
                </button>
                {full ? (
                  <button type="button" className="tv-btn tv-sound" onClick={() => { setPlaying(false); setOpen(full); }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
                      <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                    Watch with sound
                  </button>
                ) : null}
              </div>
            </div>
            <div className="tv-stand" aria-hidden="true" />
          </div>
          <div className="clips" role="group" aria-label="Choose a spot to preview">
            {HERO_CLIPS.map((c, n) => (
              <button key={c.file} type="button" aria-pressed={n === i} aria-label={`${c.brand}, ${c.tier} ad`} onClick={() => pick(n)}>
                <img src={poster(c.file)} alt="" width={128} height={72} loading="lazy" decoding="async" />
                <span>
                  {c.brand}
                  <small>{c.tier}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Lightbox spot={open} onClose={close} />
    </section>
  );
}
