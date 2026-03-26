"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

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

    const qRotY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
    const qRotX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
    const qScale = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const dx = (e.clientX - left - width / 2) / (width / 2);   // –1 … 1
      const dy = (e.clientY - top - height / 2) / (height / 2);  // –1 … 1

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
      className="relative cursor-pointer"
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

const SlideInRows = ({
  items,
  header,
  className = "",
}: SlideInRowsProps) => {
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  const rowTwo = items.slice(mid);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  /* ── 1. Scroll-triggered entrance (plays once) ── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      const headerEl = headerRef.current;
      if (!row1 || !row2) return;

      const cards1 = gsap.utils.toArray<HTMLElement>(row1.children);
      const cards2 = gsap.utils.toArray<HTMLElement>(row2.children);

      /* hidden starting state — use xPercent so mouse-parallax x stays independent */
      gsap.set(row1, { xPercent: -120, opacity: 0 });
      gsap.set(row2, { xPercent: 120, opacity: 0 });
      gsap.set([...cards1, ...cards2], { y: 40, scale: 0.9, opacity: 0 });
      if (headerEl) gsap.set(headerEl, { y: 50, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (headerEl) {
        tl.to(headerEl, { y: 0, opacity: 1, duration: 0.75 }, 0);
      }

      tl.to(row1, { xPercent: 0, opacity: 1, duration: 1 }, 0.1)
        .to(row2, { xPercent: 0, opacity: 1, duration: 1 }, 0.1)

        /* cards stagger in after rows land */
        .to(
          cards1,
          { y: 0, scale: 1, opacity: 1, stagger: 0.09, duration: 0.6, ease: "back.out(1.6)" },
          0.55
        )
        .to(
          cards2,
          { y: 0, scale: 1, opacity: 1, stagger: -0.09, duration: 0.6, ease: "back.out(1.6)" },
          0.6
        );
    },
    { scope: sectionRef }
  );

  /* ── 2. Mouse-move parallax: rows drift in opposite directions ── */
  useEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    /* quickTo uses x (pixels) — independent of xPercent used for entrance */
    const r1x = gsap.quickTo(row1, "x", { duration: 1, ease: "power3.out" });
    const r1y = gsap.quickTo(row1, "y", { duration: 1, ease: "power3.out" });
    const r2x = gsap.quickTo(row2, "x", { duration: 1, ease: "power3.out" });
    const r2y = gsap.quickTo(row2, "y", { duration: 1, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = section.getBoundingClientRect();
      const dx = (e.clientX - left - width / 2) / (width / 2);   // –1 … 1
      const dy = (e.clientY - top - height / 2) / (height / 2);  // –1 … 1

      /* row 1 follows the mouse, row 2 pushes away */
      r1x(dx * 32);
      r1y(dy * 10);
      r2x(-dx * 32);
      r2y(-dy * 10);
    };

    const onLeave = () => {
      r1x(0); r1y(0); r2x(0); r2y(0);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-6 overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      {header && (
        <div ref={headerRef} className="mb-14">
          {header}
        </div>
      )}

      {/* Row 1 — slides from LEFT on scroll, drifts right with mouse */}
      <div
        ref={row1Ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        {rowOne.map((item, i) => (
          <TiltCard key={i}>{item}</TiltCard>
        ))}
      </div>

      {/* Row 2 — slides from RIGHT on scroll, drifts left with mouse */}
      <div
        ref={row2Ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {rowTwo.map((item, i) => (
          <TiltCard key={i}>{item}</TiltCard>
        ))}
      </div>
    </section>
  );
};

export default SlideInRows;
