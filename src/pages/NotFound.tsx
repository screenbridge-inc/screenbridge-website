import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_URL } from "../site";

export default function NotFound() {
  return (
    <>
      <Seo
        meta={{
          title: "Page not found | Screenbridge",
          description: "This page does not exist.",
          canonical: `${SITE_URL}/404`,
          noindex: true,
        }}
      />
      <section className="wrap section section-first">
        <h1>Page not found</h1>
        <p>The page you are looking for has moved or never existed.</p>
        <Link className="cta" to="/">
          Back to the homepage
        </Link>
      </section>
    </>
  );
}
