import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // react-helmet-async ships CommonJS; bundle it into the SSR build so Node can import it.
  ssr: { noExternal: ["react-helmet-async"] },
});
