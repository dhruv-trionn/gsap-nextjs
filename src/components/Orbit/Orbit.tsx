'use client';

import { useRef } from 'react';
import type { OrbitProps, OrbitLabel } from './types';
import { useOrbitScene } from './useOrbitScene';

/* ── Default Data ── */
const DEFAULT_LABELS: OrbitLabel[] = [
  { name: 'VELORA',    desc: 'Architecture Studio · I' },
  { name: 'FORMLINE',  desc: 'Selected Work · II' },
  { name: 'THANK YOU', desc: 'For Watching · III' },
  { name: 'GRINEX',    desc: '10 Projects · IV' },
  { name: 'FOUCAULT',  desc: 'Portfolio Studio · V' },
  { name: 'ONE.DOT',   desc: 'Brand Identity · VI' },
  { name: 'AXORA',     desc: 'Ceramics Collection · VII' },
  { name: 'NORTHFORM', desc: 'Brand System · VIII' },
  { name: 'EXTRA',     desc: 'Project · IX' },
];

export default function Orbit({
  labels = DEFAULT_LABELS,
  images,
  topCenterText,
  bottomLeftText = 'Concepts, explorations, and interface experiments — shared openly as part of our creative process.',
  ctaText = 'View on Dribbble',
  ctaHref = '#',
  backgroundColor = '#C3C3C3',
  autoRotateSpeed = 0.00042,
  orbitRadius = 5.2,
  fontFamily = "'Barlow', sans-serif",
  heroTitle = 'DESIGN IN',
  heroSubtitle = 'MOTION',
  className = '',
}: OrbitProps) {
  const N = labels.length;
  const imgSrcs = images ?? Array.from(
    { length: N },
    (_, i) => `/images/orbit/orbit-${String(i + 1).padStart(2, '0')}.jpg`,
  );

  /* ── Refs ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* ── Three.js Scene Hook ── */
  useOrbitScene(canvasRef, trailCanvasRef, counterRef, progressRef, {
    labels, images: imgSrcs, backgroundColor, autoRotateSpeed,
    orbitRadius, fontFamily, heroTitle, heroSubtitle,
  });

  return (
    <div
      className={`relative w-full h-screen overflow-hidden cursor-default ${className}`}
      style={{ backgroundColor, fontFamily }}
    >
      {/* Trail Canvas — Motion Blur Layer */}
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Main Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[1] pointer-events-none"
      />

      {/* ── UI Overlays ── */}

      {/* Top Left — Slide Counter */}
      <div className="fixed top-5 left-5 md:top-[36px] md:left-[40px] pointer-events-none z-10">
        <span
          ref={counterRef}
          className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-[#777]"
        >
          01 / {String(N).padStart(2, '0')}
        </span>
      </div>

      {/* Top Center — Tagline */}
      <div className="fixed top-5 md:top-[36px] left-1/2 -translate-x-1/2 pointer-events-none z-10 text-center whitespace-nowrap">
        <p className="text-[8px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] uppercase text-[#666] leading-[1.7]">
          {topCenterText ?? (
            <>
              Exploring ideas through
              <br />
              daily design practice.
            </>
          )}
        </p>
      </div>

      {/* Bottom Left — Description */}
      <div className="fixed bottom-6 left-5 md:bottom-[36px] md:left-[40px] pointer-events-none z-10">
        <p className="hidden md:block text-[10px] md:text-[11.5px] text-[#555] leading-[1.7] max-w-[160px] md:max-w-[230px] font-light">
          {bottomLeftText}
        </p>
      </div>

      {/* Bottom Right — CTA Button */}
      <div className="fixed bottom-6 right-5 md:bottom-[36px] md:right-[40px] pointer-events-auto z-10 text-right">
        <a
          href={ctaHref}
          className="text-[9px] md:text-[10px] tracking-[0.16em] uppercase text-[#333] no-underline border-b border-[#333] pb-[2px] inline-flex items-center gap-2"
        >
          {ctaText}&nbsp;→
        </a>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="fixed bottom-0 left-0 h-px bg-[#444] z-[60]"
        style={{ width: 0 }}
      />
    </div>
  );
}
