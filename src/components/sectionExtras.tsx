import FeaturedWork from "./FeaturedWork";
import { BOOK_CALL_URL, REACH_URL } from "../site";
import type { Section } from "../lib/content";

// React content a markdown section gets by its class, on any page that uses it.

// Cleared clients only (no Graza until its case-study clause is checked).
const TRUST = [
  ["Harrys.svg", "Harry's"],
  ["Mixbook.svg", "Mixbook"],
  ["Fatty15.svg", "fatty15"],
  ["Carve-Desings.svg", "Carve Designs"],
  ["Cherribundi.svg", "Cheribundi"],
  ["Sacheu.svg", "Sacheu"],
  ["Dose.svg", "Dose"],
  ["Smalls.svg", "Smalls"],
  ["TheSculp-Society.svg", "The Sculpt Society"],
  ["TubbyTodd.svg", "Tubby Todd"],
];

// Standard inventory only: Peacock is by arrangement, Fire TV and YouTube TV are not named.
const PLATFORMS = [
  ["Hulu-Logo.svg", "Hulu"],
  ["Roku-tv-Logo.svg", "Roku"],
  ["apple-tv-logo.svg", "Apple TV"],
  ["YoutubeIcon.svg", "YouTube"],
  ["AmazonIcon.svg", "Amazon"],
];

const Logos = ({ list, cls }: { list: string[][]; cls: string }) => (
  <ul className={`logos ${cls}`}>
    {list.map(([file, name]) => (
      <li key={file}>
        <img src={`/images/${file}`} alt={name} loading="lazy" decoding="async" />
      </li>
    ))}
  </ul>
);

export function sectionExtra(s: Section) {
  if (s.cls === "trust") return <Logos list={TRUST} cls="logos-trust" />;
  if (s.cls === "featured") return <FeaturedWork />;
  if (s.cls === "platforms") return <Logos list={PLATFORMS} cls="logos-platforms" />;
  if (s.cls === "close")
    return (
      <div className="close-ctas">
        <a href={BOOK_CALL_URL} className="btn btn-primary btn-lg">
          Book a call
        </a>
        <a href={REACH_URL} className="btn btn-outline btn-lg">
          Plan a Reach campaign
        </a>
      </div>
    );
  // Reach page close: the campaign planner leads, the call follows.
  if (s.cls === "close-reach")
    return (
      <div className="close-ctas">
        <a href={REACH_URL} className="btn btn-primary btn-lg">
          Plan a campaign
        </a>
        <a href={BOOK_CALL_URL} className="btn btn-outline btn-lg">
          Book a call
        </a>
      </div>
    );
  return null;
}
