"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MarqueeV2 from "@/components/MarqueeV2";
import { Odometer } from "@/components/Odometer";

type RowType = "image-logos" | "video-bottom" | "marquee" | "video-popup";

interface RowData {
  id: number;
  label: string;
  description: string;
  value: number;
  digitCount: number;
  suffix: string;
  type: RowType;
  media?: string;
  logos?: string[];
}

const ROWS: RowData[] = [
  {
    id: 1,
    label: "Projects completed",
    description: "90% of our clients seek our services for a second project.",
    value: 999,
    digitCount: 3,
    suffix: "+",
    type: "image-logos",
    logos: [
      "/work-kuros.jpg",
      "/work-luxury-presence.jpg",
      "/work-willam-jonshan.jpg",
    ],
  },
  {
    id: 2,
    label: "Featured & awards",
    description: "90% of our clients seek our services for a second project.",
    value: 50,
    digitCount: 2,
    suffix: "+",
    type: "video-bottom",
    media: "/lion-v3.mp4",
  },
  {
    id: 3,
    label: "Brands we work with",
    description: "90% of our clients seek our services for a second project.",
    value: 220,
    digitCount: 3,
    suffix: "+",
    type: "marquee",
  },
  {
    id: 4,
    label: "Our team members",
    description: "90% of our clients seek our services for a second project.",
    value: 20,
    digitCount: 2,
    suffix: "+",
    type: "video-popup",
    media: "/banner-t.mp4",
  },
];

const MARQUEE_ITEMS = [
  "Brands we work with",
  "220+ Partners",
  "Global Reach",
  "Trusted by leaders",
  "World-class clients",
  "Industry pioneers",
];

/* ─── Row height and card dimensions ─────────── */
const ROW_H = 190; /* px – must be ≥ card height so card stays in bounds */
const CARD_W = 255; /* px */
const CARD_H = 240; /* px */

export default function KeyFacts() {
  const [activeRow, setActiveRow] = useState(-1);
  const [activeLogo, setActiveLogo] = useState(0);
  const [triggerStates, setTriggerStates] = useState<boolean[]>(
    ROWS.map(() => false),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // the animated el
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lineLeftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeRowRef = useRef(-1);
  const isInsideRef = useRef(false);
  const logoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  /* ── Init: cards start below, hidden ─────────────────────── */
  useGSAP(
    () => {
      ROWS.forEach((row, i) => {
        if (row.type !== "marquee") {
          /* Start straight (rotateZ:0) from below – arc swings to tilted on show */
          gsap.set(cardRefs.current[i], {
            y: row.type === "video-bottom" ? 120 : 75,
            opacity: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          });
        }
      });
      gsap.set(marqueeRef.current, { opacity: 0 });
      gsap.set(bgRef.current, { opacity: 0, height: 0 });
      // Explicitly init all lines so GSAP owns the transform from the start
      ROWS.forEach((_, i) => {
        gsap.set([lineLeftRefs.current[i], lineRightRefs.current[i]], {
          scaleX: 1,
          backgroundColor: "#9ca3af",
        });
      });
    },
    { scope: containerRef },
  );

  /* ── Lines ─────────────────────────────────────────────────
     Using ONLY scaleY – centering is via marginTop (not transform),
     so GSAP never clobbers the vertical centering.
  ────────────────────────────────────────────────────────── */
  const activateLines = contextSafe((i: number) => {
    [lineLeftRefs.current[i], lineRightRefs.current[i]].forEach((el) => {
      if (el) {
        gsap.killTweensOf(el);
        gsap.to(el, {
          scaleX: 2.3,
          backgroundColor: "#111",
          duration: 0.55,
          ease: "power3.inOut",
        });
      }
    });
  });
  const deactivateLines = contextSafe((i: number) => {
    [lineLeftRefs.current[i], lineRightRefs.current[i]].forEach((el) => {
      if (el) {
        gsap.killTweensOf(el);
        gsap.to(el, {
          scaleX: 1,
          backgroundColor: "#9ca3af",
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    });
  });

  /* ── Show / hide row content ───────────────────────────── */
  const showRow = contextSafe((i: number) => {
    const row = ROWS[i];
    const card = cardRefs.current[i];

    // Kill any in-flight tweens to prevent jerk
    gsap.killTweensOf(textRefs.current[i]);
    gsap.killTweensOf(numRefs.current[i]);
    if (card) gsap.killTweensOf(card);

    gsap.to(textRefs.current[i], { color: "#fff", duration: 0.35 });
    gsap.to(numRefs.current[i], { color: "#fff", duration: 0.35 });

    setTriggerStates((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });

    if (row.type === "image-logos" && card) {
      gsap.to(card, { y: 0, opacity: 1, rotateZ: 8, delay: 0.5, duration: 0.55, ease: "power3.out" });
      if (logoTimerRef.current) clearInterval(logoTimerRef.current);
      let idx = 0;
      logoTimerRef.current = setInterval(() => {
        idx = (idx + 1) % (row.logos?.length ?? 1);
        setActiveLogo(idx);
      }, 1300);
    }

    if (row.type === "video-bottom" && card) {
      gsap.to(card, { y: 0, opacity: 1, rotateZ: 8, delay: 0.5, duration: 0.65, ease: "power3.out" });
      const v = videoRefs.current[i];
      if (v) {
        v.currentTime = 0;
        v.play();
      }
    }

    if (row.type === "marquee") {
      gsap.to(textRefs.current[i], {
        opacity: 0,
        x: -28,
        duration: 0.28,
        ease: "power2.in",
      });
      gsap.to(numRefs.current[i], {
        opacity: 0,
        x: 28,
        duration: 0.28,
        ease: "power2.in",
      });
      gsap.to(marqueeRef.current, {
        opacity: 1,
        duration: 0.45,
        delay: 0.22,
        ease: "power2.out",
      });
    }

    if (row.type === "video-popup" && card) {
      gsap.to(card, { y: 0, opacity: 1, rotateZ: 8, delay: 0.5, duration: 0.55, ease: "power3.out" });
      const v = videoRefs.current[i];
      if (v) {
        v.currentTime = 0;
        v.play();
      }
    }
  });

  const hideRow = contextSafe((i: number) => {
    const row = ROWS[i];
    const card = cardRefs.current[i];

    // Kill any in-flight tweens to prevent jerk
    gsap.killTweensOf(textRefs.current[i]);
    gsap.killTweensOf(numRefs.current[i]);
    if (card) gsap.killTweensOf(card);

    gsap.to(textRefs.current[i], { color: "#1a1a1a", duration: 0.4 });
    gsap.to(numRefs.current[i], { color: "#1a1a1a", duration: 0.4 });

    // Reset trigger so next hover re-runs the counter animation
    setTriggerStates((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });

    if (row.type === "image-logos" && card) {
      gsap.to(card, { y: 75, opacity: 0, rotateZ: 0, duration: 0.38, ease: "power2.in" });
      if (logoTimerRef.current) {
        clearInterval(logoTimerRef.current);
        logoTimerRef.current = null;
      }
      setActiveLogo(0);
    }
    if (row.type === "video-bottom" && card) {
      gsap.to(card, { y: 120, opacity: 0, rotateZ: 0, duration: 0.38, ease: "power2.in" });
      videoRefs.current[i]?.pause();
    }
    if (row.type === "marquee") {
      gsap.killTweensOf(marqueeRef.current);
      gsap.to(textRefs.current[i], {
        opacity: 1,
        x: 0,
        color: "#1a1a1a",
        duration: 0.38,
        delay: 0.08,
        ease: "power2.out",
      });
      gsap.to(numRefs.current[i], {
        opacity: 1,
        x: 0,
        color: "#1a1a1a",
        duration: 0.38,
        delay: 0.08,
        ease: "power2.out",
      });
      gsap.to(marqueeRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
    if (row.type === "video-popup" && card) {
      gsap.to(card, { y: 75, opacity: 0, rotateZ: 0, duration: 0.38, ease: "power2.in" });
      videoRefs.current[i]?.pause();
    }
  });

  /* ── Mouse handlers ─────────────────────────────────────── */
  const handleContainerEnter = contextSafe(() => {
    isInsideRef.current = true;
  });

  const handleRowEnter = contextSafe((index: number) => {
    // Guard: if mouse already left the container, ignore late-firing events
    if (!isInsideRef.current) return;

    const prev = activeRowRef.current;
    if (prev === index) return;

    /* Deactivate previous row immediately */
    if (prev !== -1) {
      deactivateLines(prev);
      hideRow(prev);
    }

    activeRowRef.current = index;
    setActiveRow(index);

    /* Slide background */
    const rowEl = rowRefs.current[index];
    if (rowEl && bgRef.current) {
      const isFirst = index === 0;
      const isLast = index === ROWS.length - 1;
      gsap.to(bgRef.current, {
        top: rowEl.offsetTop,
        height: rowEl.offsetHeight,
        opacity: 1,
        borderRadius: isFirst
          ? "14px 14px 0 0"
          : isLast
            ? "0 0 14px 14px"
            : "0px",
        duration: 0.48,
        ease: "power3.inOut",
      });
    }

    activateLines(index);
    showRow(index);
  });

  /* Single container-level leave – eliminates all card-overlap mouseLeave bugs */
  const handleContainerLeave = contextSafe(() => {
    // Mark inside=false FIRST so any late-firing mouseenter events are ignored
    isInsideRef.current = false;

    // Always reset ALL lines unconditionally – prevents stuck state on fast swipes
    ROWS.forEach((_, i) => deactivateLines(i));

    const prev = activeRowRef.current;
    if (prev === -1) return;

    activeRowRef.current = -1;
    setActiveRow(-1);

    gsap.killTweensOf(bgRef.current);
    gsap.to(bgRef.current, {
      opacity: 0,
      duration: 0.38,
      ease: "power2.inOut",
    });

    hideRow(prev);
  });

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section className="px-6 md:px-14 py-20 bg-[#d4d4d4] min-h-screen select-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-14">
        <h2
          className="font-light text-neutral-800 leading-none"
          style={{ fontSize: "clamp(3rem, 6.5vw, 6rem)" }}
        >
          Key facts
        </h2>
        <p className="text-sm text-right max-w-[200px] leading-relaxed text-neutral-500">
          A snapshot of our
          <br />
          experience and impact.
        </p>
      </div>

      {/* Rows container */}
      <div
        ref={containerRef}
        className="relative border border-neutral-300 rounded-2xl width-full max-w-4xl mx-auto"
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
      >
        {/* Sliding dark bg – single element, moved by GSAP */}
        <div
          ref={bgRef}
          className="absolute left-0 right-0 bg-[#111] pointer-events-none z-0"
          style={{ top: 0, height: 0 }}
        />

        {ROWS.map((row, index) => (
          <div
            key={row.id}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className="relative border-b border-neutral-300/50 last:border-b-0"
            style={{
              height: `${ROW_H}px`,
              zIndex: activeRow === index ? 10 : 1,
            }}
            onMouseEnter={() => handleRowEnter(index)}
            /* ← NO onMouseLeave here – only the container fires leave */
          >
            {/* ── Left indicator line ──────────────────────
                Uses marginTop for vertical centering so GSAP's
                scaleY never destroys the position.
            ─────────────────────────────────────────────── */}
            {/* <div
              ref={(el) => { lineLeftRefs.current[index] = el; }}
              style={{
                position:        "absolute",
                left:            0,
                top:             "calc(50% - 17px)",  
                width:           "3px",
                height:          "34px",
                backgroundColor: "#9ca3af",
                borderRadius:    "9999px",
                zIndex:          20,
                transformOrigin: "center top",
              }}
            /> */}
            <div
              ref={(el) => {
                lineLeftRefs.current[index] = el;
              }}
              style={{
                position: "absolute",
                left: -150,
                top: "calc(50% - 1.5px)",
                width: "34px",
                height: "3px",
                backgroundColor: "#9ca3af",
                borderRadius: "9999px",
                zIndex: 20,
                transformOrigin: "left center",
              }}
            />

            {/* ── Right indicator line ─────────────────── */}
            {/* <div
              ref={(el) => { lineRightRefs.current[index] = el; }}
              style={{
                position:        "absolute",
                right:           0,
                top:             "calc(50% - 17px)",
                width:           "3px",
                height:          "34px",
                backgroundColor: "#9ca3af",
                borderRadius:    "9999px",
                zIndex:          20,
                transformOrigin: "center top",
              }}
            /> */}
            <div
              ref={(el) => {
                lineRightRefs.current[index] = el;
              }}
              style={{
                position: "absolute",
                right: -150,
                top: "calc(50% - 1.5px)",
                width: "34px",
                height: "3px",
                backgroundColor: "#9ca3af",
                borderRadius: "9999px",
                zIndex: 20,
                transformOrigin: "right center",
              }}
            />

            {/* ── Card mount ───────────────────────────────
                Wrapper: absolute, fills the row, flex-centers the card.
                GSAP animates the inner cardRef div with y + opacity only –
                never touches left/top/xPercent so no tilt / misalignment.
            ─────────────────────────────────────────────── */}
            {row.type !== "marquee" && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: -CARD_H,        /* extend upward so card top can overflow */
                  bottom: 0,           /* clip at row bottom */
                  display: "flex",
                  alignItems: "flex-end", /* anchor card to bottom edge */
                  justifyContent: "center",
                  pointerEvents: "none" /* wrapper transparent to mouse */,
                  zIndex: 30,
                  overflow: "hidden",
                }}
              >
                {/* Inner – this is what GSAP animates */}
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{
                    width: `${CARD_W}px`,
                    height: `${CARD_H}px`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.55)",
                    pointerEvents: "auto",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {/* Image cycling (row 1) */}
                  {row.type === "image-logos" &&
                    row.logos?.map((src, li) => (
                      <img
                        key={li}
                        src={src}
                        alt=""
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: activeLogo === li ? 1 : 0,
                          transition: "opacity 0.75s ease-in-out",
                        }}
                      />
                    ))}
                  {row.type === "image-logos" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.25), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Video (row 2 & 4) */}
                  {(row.type === "video-bottom" ||
                    row.type === "video-popup") &&
                    row.media && (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={row.media}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        muted
                        loop
                        playsInline
                      />
                    )}
                </div>
              </div>
            )}

            {/* ── Row text content ────────────────────── */}
            <div
              className="absolute inset-0 z-10 flex items-center pointer-events-none"
              style={{ padding: "0 40px" }}
            >
              {/* Left: label + desc */}
              <div
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                style={{
                  flex: 3,
                  paddingLeft: 10,
                  color: "#1a1a1a",
                  pointerEvents: "auto",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {row.label}
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    lineHeight: 1.55,
                    opacity: 0.65,
                    maxWidth: 210,
                  }}
                >
                  {row.description}
                </p>
              </div>

              {/* Center spacer – card sits absolutely above this area */}
              <div style={{ flex: 2 }} />

              {/* Right: counter */}
              <div
                ref={(el) => {
                  numRefs.current[index] = el;
                }}
                style={{
                  flex: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 10,
                  color: "#1a1a1a",
                  pointerEvents: "auto",
                }}
              >
                <Odometer
                  value={row.value}
                  digitCount={row.digitCount}
                  trigger={triggerStates[index]}
                  resetOnExit={false}
                  fontSize="text-7xl"
                  fontWeight="font-light"
                  height={72}
                  duration={1.5}
                />
                <span
                  style={{ fontSize: "4.5rem", fontWeight: 300, lineHeight: 1 }}
                >
                  {row.suffix}
                </span>
              </div>
            </div>

            {/* ── Marquee overlay (row 3 only) ─────────── */}
            {row.type === "marquee" && (
              <div
                ref={marqueeRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  zIndex: 15,
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <MarqueeV2 speed={0.75}>
                  <span
                    style={{
                      fontSize: "1.85rem",
                      fontWeight: 300,
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {MARQUEE_ITEMS.map((item, i) => (
                      <span key={i}>{item}&nbsp;&nbsp;—&nbsp;&nbsp;</span>
                    ))}
                  </span>
                </MarqueeV2>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
