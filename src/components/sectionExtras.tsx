import FeaturedWork from "./FeaturedWork";
import { BOOK_CALL_URL, CONTACT_EMAIL, REACH_URL } from "../site";
import { PICKS } from "../lib/work";
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

// The full logo wall: every brand on /work except Graza. `null` = no logo file yet, so the
// name shows as a text placeholder. Files under logos-sourced/ are stand-ins pulled from the
// brands' own sites; the designer replaces them (list in the PR).
export const BRANDS: [string | null, string][] = [
  ["AdoreMe.svg", "Adore Me"],
  [null, "BOOST LAB"],
  ["Bare-Necessities.svg", "Bare Necessities"],
  [null, "Bask & Lather"],
  [null, "Beam"],
  [null, "Calpak"],
  ["Carve-Desings.svg", "Carve Designs"],
  ["Cherribundi.svg", "Cheribundi"],
  [null, "DIBS Beauty"],
  ["Dose.svg", "Dose"],
  [null, "EllaOla"],
  [null, "Every Man Jack"],
  [null, "Eyebobs"],
  ["Fatty15.svg", "fatty15"],
  [null, "FungiCure"],
  ["Goodbelly.svg", "GoodBelly"],
  ["Harrys.svg", "Harry's"],
  ["Hyou-logo.svg", "HYOU Fine Jewelry"],
  ["jonesRoad.svg", "Jones Road"],
  ["LSPACE.svg", "L*SPACE"],
  ["Laurageller.svg", "Laura Geller"],
  ["Mixbook.svg", "Mixbook"],
  ["Monarch.svg", "Monarch"],
  [null, "Mustela"],
  [null, "Open Farm"],
  [null, "Porte + Hall"],
  [null, "Prime Fitness Rx"],
  ["Sacheu.svg", "Sacheu Beauty"],
  ["Skinn.svg", "SKINN"],
  ["Smalls.svg", "Smalls"],
  [null, "Stepful"],
  [null, "TeePublic"],
  ["TheSculp-Society.svg", "The Sculpt Society"],
  ["ThirdLove.svg", "ThirdLove"],
  ["trueBotanicals.svg", "True Botanicals"],
  ["TubbyTodd.svg", "Tubby Todd"],
  ["Ultra-mobile.svg", "Ultra Mobile"],
  ["wonderskin-Logo.svg", "Wonderskin"],
];

const BrandWall = () => (
  <ul className="brand-wall">
    {BRANDS.map(([file, name]) => (
      <li key={name}>
        {file ? (
          <img src={`/images/${file}`} alt={name} loading="lazy" decoding="async" />
        ) : (
          <span className="brand-name">{name}</span>
        )}
      </li>
    ))}
  </ul>
);

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
  if (s.cls === "brands") return <BrandWall />;
  if (s.cls === "featured") return <FeaturedWork />;
  if (PICKS[s.cls]) return <FeaturedWork picks={PICKS[s.cls]} />;
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
  // Contact page: one action, plus the mailbox.
  if (s.cls === "contact")
    return (
      <div className="close-ctas">
        <a href={BOOK_CALL_URL} className="btn btn-primary btn-lg">
          Book a call
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-outline btn-lg">
          Email us
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
