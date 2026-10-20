import { Link } from "react-router-dom";
import { useConsent } from "../lib/consent";

// Stub banner. Replace with the final consent UI before launch.
export default function ConsentBanner() {
  const { consent, ready, decide } = useConsent();
  if (!ready || consent) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" className="consent">
      <p>
        We use cookies to measure how the site is used. Accept to allow analytics, or decline and we load
        nothing. <Link to="/privacy-policy">Privacy policy</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn btn-ghost" onClick={() => decide("denied")}>
          Decline
        </button>
        <button type="button" className="btn btn-primary" onClick={() => decide("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
