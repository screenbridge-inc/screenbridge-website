import ContentPage from "./ContentPage";
import Hero from "../components/Hero";
import FeaturedWork from "../components/FeaturedWork";
import { BOOK_CALL_URL, REACH_URL } from "../site";
import type { Page, Section } from "../lib/content";

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

function extra(s: Section) {
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
  return null;
}

export default function HomePage({ page }: { page: Page }) {
  return <ContentPage page={page} first={<Hero section={page.sections[0]} />} extra={extra} />;
}
