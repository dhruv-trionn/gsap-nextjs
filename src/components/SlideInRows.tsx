"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ─────────────────────────────────────────────
   Per-card 3D tilt + cursor-tracking glow
───────────────────────────────────────────── */
const TiltCard = ({ children }: { children: ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const qRotY = gsap.quickTo(card, "rotateY", {
      duration: 0.5,
      ease: "power3.out",
    });
    const qRotX = gsap.quickTo(card, "rotateX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const qScale = gsap.quickTo(card, "scale", {
      duration: 0.4,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const dx = (e.clientX - left - width / 2) / (width / 2); // –1 … 1
      const dy = (e.clientY - top - height / 2) / (height / 2); // –1 … 1

      qRotY(dx * 11);
      qRotX(-dy * 7);
      qScale(1.03);

      // spotlight follows cursor
      const gx = ((e.clientX - left) / width) * 100;
      const gy = ((e.clientY - top) / height) * 100;
      gsap.to(glow, {
        opacity: 1,
        background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
        duration: 0.15,
        overwrite: true,
      });
    };

    const onLeave = () => {
      qRotY(0);
      qRotX(0);
      qScale(1);
      gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: true });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer max-w-[550px]"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* cursor-tracking glow overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
interface SlideInRowsProps {
  items: ReactNode[];
  header?: ReactNode;
  className?: string;
}

const SlideInRows = ({ items, header, className = "" }: SlideInRowsProps) => {
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  const rowTwo = items.slice(mid);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const leftArc = useRef<SVGPathElement>(null);
  const rightArc = useRef<SVGPathElement>(null);

  // /* ── 1. Scroll-triggered entrance (plays once) ── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      const headerEl = headerRef.current;

      const leftSideArc = leftArc.current;
      const rightSideArc = rightArc.current;

      if (!row1 || !row2) return;

      const cards1 = gsap.utils.toArray<HTMLElement>(row1.children);
      const cards2 = gsap.utils.toArray<HTMLElement>(row2.children);

      if (headerEl) gsap.set(headerEl, { y: 50, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          scrub: 1,
          pin: true,
          end: "+=300%",
        },
        defaults: { ease: "none" },
      });

      if (headerEl) {
        tl.to(headerEl, { y: 0, opacity: 1 }, 0);
      }

      const staggerDelay = 0.07;
      
      tl.to(cards1, {
        stagger:staggerDelay,
        motionPath: {
          path: leftSideArc!,
          align: leftSideArc!,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
          start: 1,
          end: 0,
        },
        transformOrigin: "start start",
      });

      tl.to(cards2, {
        stagger:staggerDelay,
        motionPath: {
          path: rightSideArc!,
          align: rightSideArc!,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
          start: 1,
          end: 0,
        },
        transformOrigin: "start start",
      },"<");
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-6 relative overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      <svg
        className="max-h-screen absolute scale-[1.5] "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-0.1 -21.1 24.97 51.21"
      >
        <path
          ref={leftArc}
          d="M 0 -21 C 35 -21 31 31 0 30"
          stroke="#FF0000"
          stroke-width="0.1"
          fill="none"
        />
      </svg>

      <svg
        className="max-h-screen absolute rotate-180 right-0 scale-[1.5]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-0.1 -21.1 24.97 51.21"
      >
        <path
          ref={rightArc}
          d="M 0 -21 C 35 -21 31 31 0 30"
          stroke="#FF0000"
          stroke-width="0.1"
          fill="none"
        />
      </svg>

      {header && (
        <div ref={headerRef} className="mb-14">
          {header}
        </div>
      )}

      {/* Row 1 — slides from LEFT on scroll, drifts right with mouse */}
      <div ref={row1Ref} className="flex flex-col absolute gap-12">
        {rowOne.map((item, i) => (
          <TiltCard key={i}>{item}</TiltCard>
        ))}
      </div>

      {/* Row 2 — slides from RIGHT on scroll, drifts left with mouse */}
      <div ref={row2Ref} className="flex flex-col absolute gap-12 right-0">
        {rowTwo.map((item, i) => (
          <TiltCard key={i}>{item}</TiltCard>
        ))}
      </div>
    </section>
  );
};

export default SlideInRows;
