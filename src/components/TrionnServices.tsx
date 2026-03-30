"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface Particle {
  el: HTMLSpanElement;
  ox: number;
  oy: number;
  fontSize: number;
  isHero: boolean;
  offX: number;
  offY: number;
  tx: number | null;
  ty: number | null;
  heroScale: number;
  dirX: number;
  dirY: number;
  speed: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  fadeOffset: number;
}

interface CharMeasure {
  ch: string;
  x: number;
  y: number;
  fontSize: number;
}

interface CardData {
  id: string;
  title: string;
  description: string;
}

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const LEFT_CARDS: CardData[] = [
  {
    id: "card-L0",
    title: "AI & Intelligent Automation",
    description:
      "AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.",
  },
  {
    id: "card-L1",
    title: "Web Development",
    description:
      "Custom web development delivered with a product-focused, design-conscious approach.",
  },
  {
    id: "card-L2",
    title: "Product Design",
    description:
      "AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.",
  },
];

const RIGHT_CARDS: CardData[] = [
  {
    id: "card-R0",
    title: "Website & Mobile Design",
    description:
      "High-quality website and app experiences designed to attract users and keep them coming back.",
  },
  {
    id: "card-R1",
    title: "WordPress Development",
    description:
      "WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.",
  },
  {
    id: "card-R2",
    title: "Branding",
    description:
      "WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.",
  },
];

const TEXT_LINES = ["A.I.", "DESIGN", "DEVELOPMENT", "BRANDING"];

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}
function randInt(a: number, b: number) {
  return Math.floor(rand(a, b + 1));
}

/* ─────────────────────────────────────────────
   Card Component
   ───────────────────────────────────────────── */
function ServiceCard({ data }: { data: CardData }) {
  return (
    <div className="card-inner">
      <div className="card-top">
        <h3>{data.title}</h3>
        <div className="card-bars">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
      <p>{data.description}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function TrionnServices() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const lfillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollDriverRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      cardRefs.current[id] = el;
    },
    []
  );

  /* ── mutable state kept in refs to avoid re-renders in RAF ── */
  const stateRef = useRef({
    imgs: new Array<HTMLImageElement>(371),
    loaded: 0,
    videoIdx: 0,
    scrollT: 0,
    particles: [] as Particle[],
    prevInZone: false,
    particleContainer: null as HTMLDivElement | null,
    gsapTL: null as gsap.core.Timeline | null,
    cardsTL: null as gsap.core.Timeline | null,
  });

  const TOTAL = 371;
  const EXPLODE_START = 0.25;
  const EXPLODE_END = 0.45;
  const CARDS_START = 0.45;
  const CARDS_END = 1.0;

  /* ── Measure each char viewport position ── */
  const measureChars = useCallback((): CharMeasure[] => {
    const results: CharMeasure[] = [];
    const overlay = textOverlayRef.current;
    if (!overlay) return results;

    overlay.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
      const text = line.textContent || "";
      const rect = line.getBoundingClientRect();
      const fSize = parseFloat(getComputedStyle(line).fontSize);
      const tmpCanvas = document.createElement("canvas");
      const tmp = tmpCanvas.getContext("2d")!;
      tmp.font = `700 ${fSize}px 'Helvetica Neue',sans-serif`;

      let tw = 0;
      for (const c of text) tw += tmp.measureText(c).width;

      let x = rect.left + rect.width / 2 - tw / 2;
      const y = rect.top + rect.height / 2;

      for (const c of text) {
        const cw = tmp.measureText(c).width;
        results.push({ ch: c, x: x + cw / 2, y, fontSize: fSize });
        x += cw;
      }
    });
    return results;
  }, []);

  /* ── Create explosion particles ── */
  const createParticles = useCallback(() => {
    const s = stateRef.current;
    if (s.gsapTL) {
      s.gsapTL.kill();
      s.gsapTL = null;
    }
    if (s.particleContainer) {
      s.particleContainer.remove();
      s.particleContainer = null;
    }
    s.particles = [];

    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:999;overflow:visible;mix-blend-mode:difference;";
    document.body.appendChild(container);
    s.particleContainer = container;

    const m = measureChars();
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hc = randInt(2, 3);
    const hi = new Set<number>();
    while (hi.size < Math.min(hc, m.length)) hi.add(randInt(0, m.length - 1));

    m.forEach((p, i) => {
      const isHero = hi.has(i);
      const el = document.createElement("span");
      el.textContent = p.ch;
      el.style.cssText = `position:absolute;top:0;left:0;font-family:'Helvetica Neue',sans-serif;font-weight:700;font-size:${p.fontSize}px;color:#fff;transform-origin:center center;will-change:transform,opacity;white-space:nowrap;line-height:1;`;
      container.appendChild(el);

      const er = el.getBoundingClientRect();
      const offX = -(er.width / 2);
      const offY = -(er.height / 2);
      gsap.set(el, { x: p.x + offX, y: p.y + offY, opacity: 1 });

      const angle = rand(-Math.PI, Math.PI);
      const speed = isHero
        ? rand(0.05, 0.15) * maxDim
        : rand(0.4, 0.9) * maxDim;

      s.particles.push({
        el,
        ox: p.x,
        oy: p.y,
        fontSize: p.fontSize,
        isHero,
        offX,
        offY,
        tx: isHero ? vw / 2 + rand(-vw * 0.15, vw * 0.15) : null,
        ty: isHero ? vh / 2 + rand(-vh * 0.15, vh * 0.15) : null,
        heroScale: isHero ? rand(6, 10) : 1,
        dirX: Math.cos(angle),
        dirY: Math.sin(angle) * rand(-1.0, 0.18),
        speed,
        rotX: rand(-360, 360),
        rotY: rand(-360, 360),
        rotZ: isHero ? rand(-15, 15) : rand(-180, 180),
        fadeOffset: rand(0, 0.3),
      });
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(
      { _p: 0 },
      {
        _p: 1,
        duration: 1,
        ease: "none",
        onUpdate() {
          const t = this.progress();
          s.particles.forEach((p) => {
            const px = p.isHero
              ? p.ox + (p.tx! - p.ox) * t
              : p.ox + p.dirX * p.speed * t;
            const py = p.isHero
              ? p.oy + (p.ty! - p.oy) * t
              : p.oy + p.dirY * p.speed * t;

            let op: number;
            if (p.isHero) {
              op = t < 0.15 ? t / 0.15 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
            } else {
              op =
                t < p.fadeOffset + 0.3
                  ? 1
                  : Math.max(0, 1 - (t - p.fadeOffset - 0.3) / 0.35);
            }

            const fs = p.isHero
              ? p.fontSize * (1 + (p.heroScale - 1) * Math.min(1, t / 0.5))
              : p.fontSize;

            const flipX = Math.cos((p.rotY * t * Math.PI) / 180);
            const flipY = p.isHero
              ? 1
              : Math.cos((p.rotX * t * Math.PI) / 180);
            const rotZ = p.rotZ * t;

            gsap.set(p.el, {
              x: px + p.offX,
              y: py + p.offY,
              fontSize: fs,
              rotation: rotZ,
              scaleX: flipX,
              scaleY: flipY,
              opacity: Math.max(0, op),
            });
          });
        },
      }
    );
    s.gsapTL = tl;
  }, [measureChars]);

  const clearParticles = useCallback(() => {
    const s = stateRef.current;
    if (s.gsapTL) {
      s.gsapTL.kill();
      s.gsapTL = null;
    }
    if (s.particleContainer) {
      s.particleContainer.remove();
      s.particleContainer = null;
    }
    s.particles = [];
  }, []);

  /* ── Build cards GSAP timeline ── */
  const buildCardsTL = useCallback(() => {
    const s = stateRef.current;
    if (s.cardsTL) s.cardsTL.kill();

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;
    const W = Math.round(vw * (isMobile ? 0.42 : 0.28));
    const H = Math.round(vh * (isMobile ? 0.28 : 0.32));

    const cEls = cardRefs.current;
    const allEls = Object.values(cEls).filter(Boolean) as HTMLDivElement[];

    allEls.forEach((el) => {
      el.style.width = W + "px";
      el.style.height = H + "px";
    });

    gsap.set(allEls, { opacity: 0, x: 0, y: 0 });
    document
      .querySelectorAll<HTMLElement>(".card-inner")
      .forEach((el) => (el.style.backgroundColor = "#1c1c1c"));

    allEls.forEach((el) => {
      (el as any)._colorStart = null;
      (el as any)._colorEnd = null;
    });

    const tl = gsap.timeline({ paused: true });
    const pairDur = 0.45;
    const pairStep = 0.2;
    const STEPS = 12;

    const pairs: [string, string][] = [
      ["card-L0", "card-R0"],
      ["card-L1", "card-R1"],
      ["card-L2", "card-R2"],
    ];

    pairs.forEach(([lk, rk], i) => {
      const startT = i * pairStep;
      const lEl = cEls[lk];
      const rEl = cEls[rk];
      if (!lEl || !rEl) return;

      const lFrames: any[] = [];
      const rFrames: any[] = [];

      for (let step = 0; step <= STEPS; step++) {
        const frac = step / STEPS;

        const lStartX = -W * 0.7;
        const lEndX = -W * 0.7;
        const lStartY = vh;
        const lEndY = -H;
        const lPeakX = vw * 0.1;

        const lY = lStartY + frac * (lEndY - lStartY);
        const arc = Math.sin(frac * Math.PI);
        const lX = lStartX + arc * (lPeakX - lStartX);

        const rStartX = vw - W * 0.3;
        const rStartY = -H;
        const rEndY = vh;
        const rPeakX = vw * 0.9 - W;

        const rY = rStartY + frac * (rEndY - rStartY);
        const rX = rStartX + arc * (rPeakX - rStartX);

        const op =
          frac < 0.15
            ? frac / 0.15
            : frac > 0.85
            ? 1 - (frac - 0.85) / 0.15
            : 1;

        const HZONE = 0.1;
        const distFromMid = Math.abs(frac - 0.5);
        const highlightAmt =
          distFromMid < HZONE ? 1 - distFromMid / HZONE : 0;
        const r = Math.round(28 + highlightAmt * (201 - 28));
        const g = Math.round(28 + highlightAmt * (74 - 28));
        const b = Math.round(28 + highlightAmt * (26 - 28));
        const bg = `rgb(${r},${g},${b})`;

        const tiltZ = (0.5 - frac) * 3;

        lFrames.push({
          x: Math.round(lX),
          y: Math.round(lY),
          opacity: op,
          backgroundColor: bg,
          rotation: tiltZ,
        });
        rFrames.push({
          x: Math.round(rX),
          y: Math.round(rY),
          opacity: op,
          backgroundColor: bg,
          rotation: -tiltZ,
        });
      }

      const lPosFrames = lFrames.map((f) => ({
        x: f.x,
        y: f.y,
        opacity: f.opacity,
        rotation: f.rotation,
      }));
      const rPosFrames = rFrames.map((f) => ({
        x: f.x,
        y: f.y,
        opacity: f.opacity,
        rotation: f.rotation,
      }));

      tl.to(
        lEl,
        { keyframes: lPosFrames, duration: pairDur, ease: "none" },
        startT
      );
      tl.to(
        rEl,
        { keyframes: rPosFrames, duration: pairDur, ease: "none" },
        startT
      );

      const lColorFrames = lFrames.map((f) => ({
        backgroundColor: f.backgroundColor,
      }));
      const rColorFrames = rFrames.map((f) => ({
        backgroundColor: f.backgroundColor,
      }));

      const lInner = lEl.querySelector<HTMLElement>(".card-inner");
      const rInner = rEl.querySelector<HTMLElement>(".card-inner");

      if (lInner)
        tl.to(
          lInner,
          {
            keyframes: lColorFrames,
            duration: pairDur,
            ease: "none",
            immediateRender: false,
          },
          startT
        );
      if (rInner)
        tl.to(
          rInner,
          {
            keyframes: rColorFrames,
            duration: pairDur,
            ease: "none",
            immediateRender: false,
          },
          startT
        );

      (lEl as any)._colorStart = startT + pairDur * 0.3;
      (lEl as any)._colorEnd = startT + pairDur * 0.7;
      (rEl as any)._colorStart = startT + pairDur * 0.3;
      (rEl as any)._colorEnd = startT + pairDur * 0.7;
    });

    s.cardsTL = tl;
  }, []);

  /* ── Update cards ── */
  const updateCards = useCallback(
    (t: number) => {
      const s = stateRef.current;
      if (!s.cardsTL) buildCardsTL();

      const cEls = cardRefs.current;
      const allEls = Object.values(cEls).filter(Boolean) as HTMLDivElement[];

      if (t < CARDS_START) {
        gsap.set(allEls, { opacity: 0, x: 0, y: 0 });
        document
          .querySelectorAll<HTMLElement>(".card-inner")
          .forEach((el) => (el.style.backgroundColor = "#1c1c1c"));
        return;
      }

      const prog = Math.min(1, (t - CARDS_START) / (CARDS_END - CARDS_START));
      s.cardsTL?.progress(prog);
    },
    [buildCardsTL, CARDS_START, CARDS_END]
  );

  /* ── Draw frame ── */
  const drawFrame = useCallback((i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const img = s.imgs[Math.round(i)];
    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = ch / ih;
    const dw = iw * scale;
    const dh = ih * scale;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    ctx.restore();
  }, []);

  /* ── Resize ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const vh = window.innerHeight;
    const cvH = vh;
    const cvW = Math.round(cvH * (16 / 9));
    canvas.width = cvW * dpr;
    canvas.height = cvH * dpr;
    canvas.style.width = cvW + "px";
    canvas.style.height = cvH + "px";
    stateRef.current.cardsTL = null;
    drawFrame(stateRef.current.videoIdx);
  }, [drawFrame]);

  /* ── Set text overlay visibility ── */
  const setOverlay = useCallback((v: boolean) => {
    const overlay = textOverlayRef.current;
    if (!overlay) return;
    overlay.style.transition = "none";
    overlay.style.opacity = v ? "1" : "0";
  }, []);

  /* ── Preload frames ── */
  const preload = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = () => {
        s.loaded++;
        if (lfillRef.current)
          lfillRef.current.style.width = (s.loaded / TOTAL) * 100 + "%";
        if (s.loaded === TOTAL) {
          drawFrame(0);
          setTimeout(() => {
            const loader = loaderRef.current;
            if (loader) {
              loader.style.transition = "opacity 0.4s";
              loader.style.opacity = "0";
              setTimeout(() => (loader.style.display = "none"), 400);
            }
          }, 200);
        }
      };
      img.src = `stone/frame_${String(i + 1).padStart(4, "0")}.webp`;
      s.imgs[i] = img;
    }
  }, [drawFrame, TOTAL]);

  /* ── Main effect — init everything ── */
  useEffect(() => {
    const s = stateRef.current;

    resize();
    preload();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    /* RAF loop */
    let rafId: number;
    const raf = (_time: number) => {
      rafId = requestAnimationFrame(raf);
      if (!s.loaded) return;

      const driver = scrollDriverRef.current;
      if (!driver) return;
      const scrollable = driver.offsetHeight - window.innerHeight;
      if (scrollable > 0)
        s.scrollT = Math.min(1, Math.max(0, window.scrollY / scrollable));

      const targetFrame = s.scrollT * (TOTAL - 1);
      s.videoIdx += (targetFrame - s.videoIdx) * 0.12;

      const inZone =
        s.scrollT >= EXPLODE_START && s.scrollT <= EXPLODE_END;
      const pastZone = s.scrollT > EXPLODE_END;
      const explodeT = inZone
        ? (s.scrollT - EXPLODE_START) / (EXPLODE_END - EXPLODE_START)
        : 0;

      if (inZone && !s.prevInZone) createParticles();
      if (!inZone && s.prevInZone) clearParticles();
      s.prevInZone = inZone;

      drawFrame(s.videoIdx);

      if (inZone && s.gsapTL) {
        s.gsapTL.progress(explodeT);
        setOverlay(false);
      } else if (pastZone) {
        setOverlay(false);
      } else {
        setOverlay(true);
      }

      /* ── Background video: always playing ── */
      const vid = bgVideoRef.current;
      if (vid && vid.paused) vid.play().catch(() => {});

      updateCards(s.scrollT);
      if (progressRef.current)
        progressRef.current.style.width = s.scrollT * 100 + "%";
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      clearParticles();
      if (s.cardsTL) s.cardsTL.kill();
    };
  }, [
    resize,
    preload,
    drawFrame,
    createParticles,
    clearParticles,
    setOverlay,
    updateCards,
    TOTAL,
    EXPLODE_START,
    EXPLODE_END,
  ]);

  return (
    <>
      {/* ── Global styles injected via style tag ── */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html,
        body {
          width: 100%;
          background: #000;
          overscroll-behavior: none;
        }

        .svc-card {
          position: absolute;
          top: 0;
          left: 0;
          will-change: transform, opacity;
          backface-visibility: hidden;
          box-sizing: border-box;
          padding: 6px;
        }

        .card-inner {
          background: #1c1c1c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: clamp(16px, 2vw, 28px);
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .card-top h3 {
          color: #fff;
          font-size: clamp(13px, 1.6vw, 24px);
          font-weight: 400;
          line-height: 1.2;
          margin: 0;
          letter-spacing: -0.02em;
          font-family: "Helvetica Neue", sans-serif;
          max-width: 65%;
        }

        .card-bars {
          display: flex;
          gap: 3px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .card-bars span {
          display: block;
          width: 2px;
          background: rgba(255, 255, 255, 0.28);
          border-radius: 0;
          height: clamp(20px, 3vh, 44px);
        }

        .card-inner p {
          color: rgba(255, 255, 255, 0.35);
          font-size: clamp(10px, 0.85vw, 12px);
          line-height: 1.65;
          margin: 0;
          font-weight: 300;
          font-family: "Helvetica Neue", sans-serif;
        }

        .text-block [data-line] {
          font-size: clamp(32px, 9vw, 130px);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          display: block;
          font-family: "Helvetica Neue", sans-serif;
        }
        .text-block [data-line]:nth-child(3) {
          font-size: clamp(28px, 8vw, 118px);
        }

        @media (max-width: 768px) {
          .card-inner {
            padding: 14px 16px;
            border-radius: 6px;
          }
          .card-top h3 {
            font-size: clamp(12px, 3.5vw, 18px);
          }
          .card-inner p {
            font-size: clamp(9px, 2.5vw, 11px);
          }
          .card-bars span {
            height: clamp(14px, 3vh, 28px);
          }
          .text-block [data-line] {
            font-size: clamp(28px, 12vw, 80px);
          }
          .text-block [data-line]:nth-child(3) {
            font-size: clamp(22px, 10vw, 68px);
          }
        }

        @media (max-width: 480px) {
          .card-top h3 {
            font-size: clamp(11px, 4vw, 16px);
          }
          .card-inner p {
            font-size: clamp(9px, 2.8vw, 11px);
          }
        }
      `}</style>

      {/* ── Loader ── */}
      <div
        ref={loaderRef}
        className="fixed inset-0 bg-black flex items-center justify-center flex-col gap-4 z-[999]"
      >
        <span className="text-white/40 font-['Helvetica_Neue',sans-serif] text-[11px] tracking-[0.3em] uppercase">
          Loading
        </span>
        <div className="w-[clamp(120px,30vw,200px)] h-px bg-white/[0.12]">
          <div
            ref={lfillRef}
            className="h-full bg-white w-0 transition-[width] duration-75 ease-out"
          />
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div
        ref={progressRef}
        className="fixed bottom-0 left-0 h-0.5 w-0 bg-white z-[100]"
      />

      {/* ── Scroll driver ── */}
      <div
        ref={scrollDriverRef}
        className="relative h-[1000vh] md:h-[1000vh]"
        style={{ height: "1000vh" }}
      >
        {/* Sticky wrap */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            id="c"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block h-screen w-auto"
          />

          {/* Background video — reveals after text blast, blends with canvas frames */}
          <video
            ref={bgVideoRef}
            src="/services_bg_video.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none object-cover rotate-180"
            style={{
              opacity: 0.5,
              zIndex: 1,
              mixBlendMode: "screen",
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "auto",
              minWidth: "100%",
            }}
          />

          {/* Cards overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
            {LEFT_CARDS.map((card) => (
              <div
                key={card.id}
                ref={setCardRef(card.id)}
                className="svc-card"
              >
                <ServiceCard data={card} />
              </div>
            ))}
            {RIGHT_CARDS.map((card) => (
              <div
                key={card.id}
                ref={setCardRef(card.id)}
                className="svc-card"
              >
                <ServiceCard data={card} />
              </div>
            ))}
          </div>

          {/* Top label */}
          <div className="absolute top-[clamp(20px,3vh,40px)] left-0 right-0 flex justify-center pointer-events-none font-['Helvetica_Neue',sans-serif] mix-blend-difference z-20">
            <p className="text-white text-[clamp(9px,1vw,11px)] tracking-[0.35em] uppercase m-0">
              OUR SERVICES
            </p>
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-[clamp(20px,3vh,40px)] left-0 right-0 flex justify-center pointer-events-none font-['Helvetica_Neue',sans-serif] mix-blend-difference z-20">
            <p className="text-white text-[clamp(9px,1vw,11px)] tracking-[0.25em] uppercase m-0">
              ✦ DESIGN WITH INTENT. BUILT TO WORK.
            </p>
          </div>

          {/* Text overlay */}
          <div
            ref={textOverlayRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference z-20 px-[4%]"
          >
            <div className="text-block text-center" style={{ lineHeight: 0.88 }}>
              {TEXT_LINES.map((line, i) => (
                <div key={i} data-line>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
