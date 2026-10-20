import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE } from "../site";
import type { PageMeta } from "../lib/content";

export default function Seo({ meta }: { meta: PageMeta }) {
  const og = meta.ogImage || DEFAULT_OG_IMAGE;
  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      {meta.noindex ? <meta name="robots" content="noindex,follow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Screenbridge" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={og} />
      {(meta.jsonld ?? []).map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}
