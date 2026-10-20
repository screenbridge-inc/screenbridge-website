import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "./Lightbox";
import VideoCard from "./VideoCard";
import { FEATURED, findSpot, type Spot } from "../lib/work";

export default function FeaturedWork() {
  const [open, setOpen] = useState<Spot | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const spots = FEATURED.map(([b, t, c]) => findSpot(b, t, c)).filter((s): s is Spot => !!s);
  return (
    <>
      <ul className="vgrid vgrid-featured">
        {spots.map((s) => (
          <li key={s.id}>
            <VideoCard spot={s} onOpen={setOpen} />
          </li>
        ))}
      </ul>
      <p className="more">
        <Link to="/work" className="btn btn-ghost">
          See all the work
        </Link>
      </p>
      <Lightbox spot={open} onClose={close} />
    </>
  );
}
