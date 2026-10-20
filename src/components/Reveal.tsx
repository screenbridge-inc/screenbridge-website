import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";

// Tasteful, lazy reveal. Server HTML is always fully visible; after hydration,
// only sections still below the fold fade up once when scrolled to.
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [state, setState] = useState<"shown" | "hidden">("shown");

  useEffect(() => {
    if (reduce || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) setState("hidden");
  }, [reduce]);

  useEffect(() => {
    if (inView) setState("shown");
  }, [inView]);

  return (
    <m.section
      ref={ref}
      className={className}
      initial={false}
      animate={state}
      variants={{
        hidden: { opacity: 0, y: 16, transition: { duration: 0 } },
        shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {children}
    </m.section>
  );
}
