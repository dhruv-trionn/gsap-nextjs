"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
  forwardRef,
  useImperativeHandle,
} from "react";

gsap.registerPlugin(ScrollTrigger);

/* ── Public handle for controlled (imperative) mode ── */
export interface StripeOverlayHandle {
  /** Set stripe progress 0→1 (0 = fully hidden, 1 = fully covered) */
  setProgress: (t: number) => void;
}

/* ── Props ─────────────────────────────────────────── */
export interface StripeOverlayProps {
  /* ── Common ── */
  /** Number of horizontal stripes (default: 5) */
  stripeCount?: number;
  /** Background colour of each stripe (default: "#D2D2D2") */
  stripeColor?: string;
  /** Direction from which the stripes grow – "bottom" or "top" (default: "bottom") */
  stripeOrigin?: "bottom" | "top";
  /** Order in which stripes animate – "end" means last stripe first (default: "end") */
  staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  /** Total stagger spread across all stripes in 0–1 range (default: 0.5) */
  staggerAmount?: number;

  /* ── Standalone mode (self-managed ScrollTrigger + pin) ── */
  /** The "pinned" content that stays fixed while stripes animate over it.
   *  When provided, the component manages its own ScrollTrigger pin. */
  pinnedContent?: ReactNode;
  /** ScrollTrigger endTrigger element selector (standalone mode) */
  scrollEndTrigger?: string;
  /** ScrollTrigger end position relative to the endTrigger (standalone mode, default: "top center") */
  scrollEnd?: string;
  /** Enable GSAP ScrollTrigger markers for debugging (default: false) */
  markers?: boolean;

  /* ── Styling ── */
  /** Extra className on the outermost wrapper (standalone) or the stripes container (controlled) */
  className?: string;
  /** Extra className on the pinned-content wrapper (standalone only) */
  pinnedClassName?: string;
  /** Extra className on the stripes flex container */
  stripesClassName?: string;
  /** Extra style on each stripe element */
  stripeStyle?: CSSProperties;
}

/* ── Component ─────────────────────────────────────── */
const StripeOverlay = forwardRef<StripeOverlayHandle, StripeOverlayProps>(
  function StripeOverlay(
    {
      stripeCount = 5,
      stripeColor = "#D2D2D2",
      stripeOrigin = "bottom",
      staggerFrom = "end",
      staggerAmount = 0.5,
      pinnedContent,
      scrollEndTrigger,
      scrollEnd = "top center",
      markers = false,
      className = "",
      pinnedClassName = "",
      stripesClassName = "",
      stripeStyle,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stripesRef = useRef<HTMLDivElement[]>([]);

    const isStandalone = !!pinnedContent;

    /* ── Imperative handle for controlled mode ── */
    const applyProgress = (t: number) => {
      const stripes = stripesRef.current;
      const count = stripes.length;
      if (count === 0) return;

      for (let i = 0; i < count; i++) {
        // Determine stagger index based on staggerFrom
        let staggerIdx: number;
        if (staggerFrom === "end") {
          staggerIdx = count - 1 - i;
        } else if (staggerFrom === "center") {
          staggerIdx = Math.abs(i - Math.floor(count / 2));
        } else if (staggerFrom === "edges") {
          staggerIdx = Math.floor(count / 2) - Math.abs(i - Math.floor(count / 2));
        } else {
          // "start" or "random"
          staggerIdx = i;
        }

        const perStripe = 1 - staggerAmount;
        const stripeStart =
          count > 1
            ? (staggerAmount * staggerIdx) / (count - 1)
            : 0;
        const stripeEnd = stripeStart + perStripe;
        const progress = Math.max(
          0,
          Math.min(1, (t - stripeStart) / (stripeEnd - stripeStart)),
        );
        gsap.set(stripes[i]!, { scaleY: progress });
      }
    };

    useImperativeHandle(ref, () => ({ setProgress: applyProgress }));

    /* ── Standalone: self-managed ScrollTrigger ── */
    useGSAP(() => {
      if (!isStandalone) return;

      const container = containerRef.current;
      const stripes = stripesRef.current;
      if (!container || stripes.length === 0) return;

      gsap.set(stripes, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          endTrigger: scrollEndTrigger,
          end: scrollEnd,
          scrub: true,
          pin: true,
          markers,
          pinSpacing: false,
        },
      });

      tl.to(stripes, {
        scaleY: 1,
        ease: "none",
        stagger: {
          amount: staggerAmount,
          from: staggerFrom,
        },
      });
    }, [
      isStandalone,
      stripeCount,
      stripeColor,
      stripeOrigin,
      staggerFrom,
      staggerAmount,
      scrollEndTrigger,
      scrollEnd,
      markers,
    ]);

    /* ── Stripe elements (shared between both modes) ── */
    const stripesEl = (
      <div
        className={`absolute inset-0 pointer-events-none flex flex-col w-full h-full z-30 ${stripesClassName}`}
      >
        {Array.from({ length: stripeCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) stripesRef.current[i] = el;
            }}
            style={{
              flex: 1,
              width: "100%",
              marginTop: i > 0 ? "-0.5px" : undefined,
              paddingBottom: "0.5px",
              backgroundColor: stripeColor,
              transform: "scaleY(0)",
              transformOrigin: stripeOrigin,
              willChange: "transform",
              ...stripeStyle,
            }}
          />
        ))}
      </div>
    );

    /* ── Standalone mode: full wrapper with pinned content ── */
    if (isStandalone) {
      return (
        <section className={`relative overflow-visible ${className}`}>
          <div
            ref={containerRef}
            className={`w-full min-h-screen z-20 mix-blend-difference relative overflow-visible ${pinnedClassName}`}
          >
            {pinnedContent}
            {stripesEl}
          </div>
        </section>
      );
    }

    /* ── Controlled mode: just the stripes overlay ── */
    return stripesEl;
  },
);

export default StripeOverlay;
