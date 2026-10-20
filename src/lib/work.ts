// Client work for /work and the homepage. src/data/work.json is generated from the
// reel finder by scripts/import_reel.py; never hand-type a Vimeo id or link.
import data from "../data/work.json";

export const TIERS = ["Standard", "Premium", "Signature"] as const;
export type Tier = (typeof TIERS)[number];

export type Spot = {
  id: string;
  hash: string;
  brand: string;
  campaign: string;
  tier: Tier;
  length: string;
  seconds: number | null;
  verticals: string[];
  title: string;
  url: string;
  thumb: string;
  added: string;
};

export const WORK = data as Spot[];

export function embedUrl(s: Spot): string {
  const q = new URLSearchParams({ autoplay: "1", dnt: "1", title: "0", byline: "0", portrait: "0" });
  if (s.hash) q.set("h", s.hash);
  return `https://player.vimeo.com/video/${s.id}?${q}`;
}

export function spotName(s: Spot): string {
  return [s.brand, s.campaign].filter(Boolean).join(", ");
}

export function findSpot(brand: string, tier: Tier, campaign = ""): Spot | undefined {
  return WORK.find((s) => s.brand === brand && s.tier === tier && s.campaign === campaign);
}

// Homepage picks, by brand + campaign + tier so they follow the catalog.
export const FEATURED: [string, Tier, string?][] = [
  ["Harry's", "Premium", "Body Wash"],
  ["Sacheu Beauty", "Signature"],
  ["Wonderskin", "Standard"],
  ["Jones Road", "Premium", "Miracle Balm"],
  ["Carve Designs", "Signature", "Summer 2026"],
  ["The Sculpt Society", "Standard"],
];

// Muted previews in the hero, served from public/videos (client work, see the catalog).
export type HeroClip = { brand: string; tier: Tier; campaign?: string; file: string };
export const HERO_CLIPS: HeroClip[] = [
  {
    brand: "Jones Road",
    tier: "Premium",
    campaign: "The Face Pencil & Miracle Balm",
    file: "jones_road___the_face_pencil__miracle_balm___30_second_premium_screenbridge_ad_v1-720p",
  },
  { brand: "Dose", tier: "Signature", campaign: "Remix", file: "dose___remix___30_second_signature_screenbridge_ad-720p" },
  { brand: "The Sculpt Society", tier: "Standard", file: "the_sculpt_society___30_second_standard_screenbridge_ad_v1-720p" },
  { brand: "Dose", tier: "Premium", file: "Dose___30_Second_Premium_Screenbridge_Ad" },
  { brand: "Goodbelly", tier: "Standard", file: "Sb102Goodbelly-Ctvad-Finishing-V02" },
];
