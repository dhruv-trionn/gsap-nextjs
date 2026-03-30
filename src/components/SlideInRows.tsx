"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/all";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText, DrawSVGPlugin);

/* ─────────────────────────────────────────────
   Per-card 3D tilt + cursor-tracking glow
───────────────────────────────────────────── */
const TiltCard = ({ children }: { children: ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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
  onCardCenter?: (cardIndex: number, isCenter: boolean) => void;
  /** Number of video frames to play during the pinned section */
  frameCount?: number;
  /** Returns the src path for a given 1-based frame index */
  getFramePath?: (index: number) => string;
  /** Shown before pin starts, fades to opacity-0 when pin/video begins */
  preVideoLabel?: ReactNode;
}

const SlideInRows = ({
  items,
  header,
  className = "",
  onCardCenter,
  frameCount,
  getFramePath,
  preVideoLabel,
}: SlideInRowsProps) => {
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  const rowTwo = items.slice(mid);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const leftArc = useRef<SVGPathElement>(null);
  const rightArc = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preVideoLabelRef = useRef<HTMLDivElement>(null);
  const onCardCenterRef = useRef(onCardCenter);
  onCardCenterRef.current = onCardCenter;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;

      const leftSideArc = leftArc.current;
      const rightSideArc = rightArc.current;

      if (!row1 || !row2) return;

      const cards1 = gsap.utils.toArray<HTMLElement>(row1.children);
      const cards2 = gsap.utils.toArray<HTMLElement>(row2.children);

      // ── Canvas / frame-sequence setup ──
      let cleanup: (() => void) | undefined;

      if (frameCount && getFramePath && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const setCanvasSize = () => {
          const ratio = window.devicePixelRatio || 1;
          canvas.width = window.innerWidth * ratio;
          canvas.height = window.innerHeight * ratio;
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);
        cleanup = () => window.removeEventListener("resize", setCanvasSize);

        const images: HTMLImageElement[] = [];
        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          img.src = getFramePath(i + 1);
          images.push(img);
        }

        const playhead = { frame: 0 };

        const render = () => {
          const img = images[Math.round(playhead.frame)];
          if (!img || !img.complete) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
        };

        images[0].onload = () => {
          render();
          ScrollTrigger.refresh();
        };

        // Drive playhead with the same scrub timeline so video stays in sync
        gsap.to(playhead, {
          frame: frameCount - 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            scrub: 1,
          },
        });
      }

      // ── Pinned card arc animation (always active) ──
      // cardTrackers is populated after tl is created; use a late-binding ref
      const cardTrackersRef: { current: Array<{ cardEl: HTMLElement; paths: NodeListOf<SVGPathElement>; lastAnim: number }> } = { current: [] };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          scrub: 1,
          pin: true,
          end: "+=300%",
          onKill: cleanup,
          onUpdate: () => {
            if (!section || cardTrackersRef.current.length === 0) return;
            const secRect = section.getBoundingClientRect();
            const centerX = secRect.left + secRect.width / 2;
            const centerY = secRect.top + secRect.height / 2;
            const nowMs = performance.now();
            for (const tracked of cardTrackersRef.current) {
              const rect = tracked.cardEl.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              if (
                Math.hypot(cx - centerX, cy - centerY) < rect.width * 1.5 &&
                nowMs - tracked.lastAnim > 2500
              ) {
                tracked.lastAnim = nowMs;
                const { paths } = tracked;
                gsap.killTweensOf(paths);
                gsap.fromTo(
                  paths,
                  { drawSVG: "0%" },
                  {
                    drawSVG: "100%",
                    duration: 1,
                    ease: "power2.inOut",
                    stagger: 0.08,
                    onComplete: () => {
                      gsap.to(paths, {
                        drawSVG: "0%",
                        duration: 0.6,
                        ease: "power2.in",
                        delay: 0.3,
                        stagger: 0.05,
                      });
                    },
                  },
                );
              }
            }
          },
        },
        defaults: { ease: "none" },
      });

      // Blast apart the pre-video label characters at the very start of the pin
      if (preVideoLabelRef.current) {
        const split = new SplitText(preVideoLabelRef.current, { type: "chars" });
        tl.to(
          split.chars,
          {
            delay:0.5,
            duration: 0.4,
            opacity: 0,
            x: () => gsap.utils.random(-300, 300),
            y: () => gsap.utils.random(-300, 300),
            rotation: () => gsap.utils.random(-180, 180),
            scale: () => gsap.utils.random(0.2, 1.5),
            stagger: { amount: 0.2, from: "random" },
            ease: "power2.in",
          },
          0,
        );
      }

      const staggerDelay = 0.3;

      // ── Build card trackers for proximity-based DrawSVG ──
      type CardTracker = {
        cardEl: HTMLElement;
        paths: NodeListOf<SVGPathElement>;
        lastAnim: number;
      };
      const cardTrackers: CardTracker[] = [...cards1, ...cards2]
        .map((cardEl) => {
          const paths = cardEl.querySelectorAll<SVGPathElement>("[data-card-svg] path");
          return paths.length ? { cardEl, paths, lastAnim: 0 } : null;
        })
        .filter(Boolean) as CardTracker[];

      // Start all paths invisible and expose trackers to the onUpdate closure
      cardTrackers.forEach(({ paths }) => gsap.set(paths, { drawSVG: "0%" }));
      cardTrackersRef.current = cardTrackers;

      tl.to(cards1, {
        stagger: staggerDelay,
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

      tl.to(
        cards2,
        {
          stagger: staggerDelay,
          motionPath: {
            path: rightSideArc!,
            align: rightSideArc!,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
            start: 1,
            end: 0,
          },
          transformOrigin: "start start",
        },
        "<",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-6 relative overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
     
      {/* Frame-sequence video canvas — only rendered when frameCount/getFramePath are provided */}
      {frameCount && getFramePath && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      <svg
        className="max-h-screen absolute scale-[1.5] opacity-0 invisible"
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
        className="max-h-screen absolute rotate-180 right-0 scale-[1.5] opacity-0 invisible"
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

   

      {/* Pre-video label — visible before pin, fades out when timeline starts */}
      {preVideoLabel && (
        <div
          ref={preVideoLabelRef}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          {preVideoLabel}
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
