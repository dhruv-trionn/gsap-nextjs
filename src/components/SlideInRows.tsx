"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface SlideInRowsProps {
  /** Items for the first row — slides in from the LEFT */
  rowOne: ReactNode[];
  /** Items for the second row — slides in from the RIGHT */
  rowTwo: ReactNode[];
  /** Optional header rendered above the rows */
  header?: ReactNode;
  className?: string;
  /** ScrollTrigger start. Default: "top bottom" */
  start?: string;
  /** ScrollTrigger end. Default: "bottom top" */
  end?: string;
}

/**
 * SlideInRows
 *
 * Single scrubbed timeline spanning the full section scroll:
 *  - Intro: Row 1 slides in from LEFT, Row 2 from RIGHT
 *  - Outro: Row 1 exits to LEFT, Row 2 exits to RIGHT
 */
const SlideInRows = ({
  rowOne,
  rowTwo,
  header,
  className = "",
  start = "top bottom",
  end = "bottom top",
}: SlideInRowsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      if (!row1 || !row2) return;

      const vw = window.innerWidth;

      gsap.set(row1, { x: -vw });
      gsap.set(row2, { x: vw });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start,
          end,
          scrub: 1,
          markers: true,
          invalidateOnRefresh: true,
        },
      });

      // Intro: both rows slide to resting position
      tl.to(row1, { x: vw, ease: "none" }, 0).to(
        row2,
        { x: -vw, ease: "none" },
        0,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`py-16 px-6 overflow-hidden ${className}`}
    >
      {header && <div className="mb-12">{header}</div>}

      {/* Row 1 — slides from LEFT */}
      <div
        ref={row1Ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        {rowOne.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>

      {/* Row 2 — slides from RIGHT */}
      <div
        ref={row2Ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {rowTwo.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </section>
  );
};

export default SlideInRows;
