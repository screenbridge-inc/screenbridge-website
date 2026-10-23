import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "./Lightbox";
import VideoCard from "./VideoCard";
import { FEATURED, findSpot, type Spot, type Tier } from "../lib/work";

export default function FeaturedWork({ picks = FEATURED }: { picks?: [string, Tier, string?][] }) {
  const [open, setOpen] = useState<Spot | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const spots = picks.map(([b, t, c]) => findSpot(b, t, c)).filter((s): s is Spot => !!s);
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
