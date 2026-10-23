// Colors come from the design system via scripts/gen_tokens.mjs.
// Never type a hex here: every color is a CSS variable from src/styles/tokens.css.
import fs from "node:fs";

const tokens = JSON.parse(fs.readFileSync(new URL("./src/styles/tokens.json", import.meta.url), "utf8"));

const colors = Object.fromEntries(tokens.colors.map((name) => [name, `var(--${name})`]));

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      maxWidth: {
        content: "var(--content)",
        narrow: "var(--content-narrow)",
        wide: "var(--content-wide)",
      },
      borderRadius: {
        pill: "var(--radius-pill)",
      },
      backgroundImage: {
        "grad-dark-blue": "var(--grad-dark-blue)",
        "grad-neon-blue": "var(--grad-neon-blue)",
      },
    },
  },
  // The design system's tokens.css carries the base type scale; Tailwind's reset would flatten it.
  corePlugins: { preflight: false },
  plugins: [],
};
