import ContentPage from "./ContentPage";
import WorkGrid from "../components/WorkGrid";
import { WORK, spotName } from "../lib/work";
import type { Page } from "../lib/content";

// The CollectionPage JSON-LD in content/work.md gets one VideoObject per spot,
// built from the same data as the grid.
function withVideos(page: Page): Page {
  const videos = WORK.map((s) => ({
    "@type": "VideoObject",
    name: `${spotName(s)} ${s.tier} CTV Ad`,
    description: `${s.length ? `${s.length} ` : ""}${s.tier} Screenbridge ad for ${spotName(s)}.`,
    thumbnailUrl: s.thumb,
    uploadDate: s.added,
    url: s.url,
    embedUrl: `https://player.vimeo.com/video/${s.id}${s.hash ? `?h=${s.hash}` : ""}`,
    ...(s.seconds ? { duration: `PT${s.seconds}S` } : {}),
  }));
  const jsonld = (page.jsonld ?? []).map((b) => (b["@type"] === "CollectionPage" ? { ...b, hasPart: videos } : b));
  return { ...page, jsonld };
}

export default function WorkPage({ page }: { page: Page }) {
  return <ContentPage page={page} meta={withVideos(page)} extra={(_s, i) => (i === 0 ? <WorkGrid /> : null)} />;
}
