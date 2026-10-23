import ContentPage from "./ContentPage";
import Hero from "../components/Hero";
import type { Page } from "../lib/content";

export default function HomePage({ page }: { page: Page }) {
  return <ContentPage page={page} first={<Hero section={page.sections[0]} />} />;
}
