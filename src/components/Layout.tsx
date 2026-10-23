import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import ConsentBanner from "./ConsentBanner";
import { pageByPath } from "../lib/content";
import { BOOK_CALL_URL, CONTACT_EMAIL, FACTS, FOOTER_LINKS, LEGAL_LINKS, NAV, SIGN_IN_URL } from "../site";

// A link shows only once its page exists (see NAV in site.ts).
const live = <T extends { to: string }>(links: T[]) => links.filter((l) => pageByPath.has(l.to));

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link to="/" className="logo" aria-label="Screenbridge home">
          <img src="/brand/horizontal-logo-dark.png" alt="Screenbridge" width="168" height="25" />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav id="site-nav" className={open ? "site-nav open" : "site-nav"} aria-label="Main">
          {live(NAV).map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}>
              {n.label}
            </NavLink>
          ))}
          <a href={SIGN_IN_URL} className="nav-quiet">
            Sign In
          </a>
          <a href={BOOK_CALL_URL} className="btn btn-primary">
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="wrap footer-grid">
        <div>
          <img src="/brand/horizontal-logo-light.png" alt="Screenbridge" width="168" height="25" loading="lazy" />
          <p className="footer-facts">{FACTS}</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <a href={BOOK_CALL_URL} className="btn btn-primary">
            Book a call
          </a>
        </div>
        <nav aria-label="Footer">
          {live(FOOTER_LINKS).map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
          <a href={SIGN_IN_URL}>Sign In</a>
        </nav>
        <nav aria-label="Legal">
          {LEGAL_LINKS.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="wrap footer-base">© {new Date().getFullYear()} Screenbridge Inc.</div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ConsentBanner />
    </>
  );
}
