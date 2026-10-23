export const SITE_URL = "https://www.screenbridge.tv";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/OpengraphScreenbridge.png`;
export const GTM_ID = "GTM-M52G95GL";
export const BOOK_CALL_URL = "https://meetings.hubspot.com/screenbridge/screenbridge-call";
export const REACH_URL = "https://reach.screenbridge.tv";
export const SIGN_IN_URL = "https://dashboard.screenbridge.tv/dashboard";
export const CONTACT_EMAIL = "info@screenbridge.tv";

// Six items, no dropdowns (docs/one-build-plan.md section 3). Layout shows a link only once its
// page exists, so the doors light up as each Phase 2 step lands instead of linking to a 404.
export const NAV = [
  { to: "/creative", label: "Creative" },
  { to: "/performance-plan", label: "Performance Plan" },
  { to: "/reach", label: "Reach" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export const FOOTER_LINKS = [
  ...NAV,
  { to: "/case-studies", label: "Case Studies" },
  { to: "/beauty", label: "Beauty" },
  { to: "/ugc-ad-checker", label: "UGC Checker" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// The plain facts, verbatim in every footer and on /about (section 3). Draft; Tim edits.
export const FACTS = "Screenbridge is a New York video agency that makes UGC-style TV ads and runs them on CTV.";

export const LEGAL_LINKS = [
  { to: "/terms-conditions", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
];
