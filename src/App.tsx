import { Route, Routes } from "react-router-dom";
import { LazyMotion } from "framer-motion";
import Layout from "./components/Layout";
import ContentPage from "./pages/ContentPage";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import NotFound from "./pages/NotFound";
import { pages, type Page } from "./lib/content";

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

function PageFor({ page }: { page: Page }) {
  if (page.path === "/") return <HomePage page={page} />;
  if (page.path === "/work") return <WorkPage page={page} />;
  return <ContentPage page={page} />;
}

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <Layout>
        <Routes>
          {pages.map((p) => (
            <Route key={p.path} path={p.path} element={<PageFor page={p} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </LazyMotion>
  );
}
