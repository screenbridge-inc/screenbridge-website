// Consent gate for Google Tag Manager. Consent Mode v2 defaults to denied in
// index.html; GTM itself is only injected after the visitor accepts.
import { useCallback, useEffect, useState } from "react";
import { GTM_ID } from "../site";

export type Consent = "granted" | "denied" | null;
const KEY = "sb-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// Never fire tags from local builds or previews (Reach lesson: dev traffic polluted GA4).
const DENY_HOSTS = [/^localhost$/, /^127\.0\.0\.1$/, /^\[::1\]$/, /\.local$/, /\.vercel\.app$/];

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

let gtmLoaded = false;
function loadGtm() {
  if (gtmLoaded || DENY_HOSTS.some((re) => re.test(location.hostname))) return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

function gtagConsent(state: "granted" | "denied") {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  const gtag = function (..._args: unknown[]) {
    // gtag expects the arguments object, not an array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export function useConsent() {
  // null until mounted, so server and first client render match
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setReady(true);
    if (c === "granted") {
      gtagConsent("granted");
      loadGtm();
    }
  }, []);

  const decide = useCallback((c: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* private mode: decision lasts for this page view */
    }
    setConsent(c);
    gtagConsent(c);
    if (c === "granted") loadGtm();
  }, []);

  return { consent, ready, decide };
}
