import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";
import { pages } from "./lib/content";

export { pages };

export function render(url: string) {
  const ctx: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={ctx}>
        <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>,
  );
  const h = ctx.helmet!;
  const head = [h.title, h.priority, h.meta, h.link, h.script].map((t) => t.toString()).filter(Boolean).join("\n");
  return { html, head };
}
