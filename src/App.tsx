import { Route, Routes } from "react-router-dom";
import { LazyMotion } from "framer-motion";
import Layout from "./components/Layout";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";
import { pages } from "./lib/content";

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <Layout>
        <Routes>
          {pages.map((p) => (
            <Route key={p.path} path={p.path} element={<ContentPage page={p} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </LazyMotion>
  );
}
