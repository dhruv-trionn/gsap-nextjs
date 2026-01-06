"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/all";
import { ReactElement, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

interface MarqueeProps {
  children: ReactElement;
  speed?: number;
  direction?: "left" | "right";
  gap?: number;
  className?: string;
  draggable?: boolean;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  speed = 0.5,
  direction = "left",
  gap = 40,
  className = "",
  draggable = false,
  pauseOnHover = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const x = useRef(0);
  const dir = useRef(direction === "left" ? -1 : 1);
  const itemWidth = useRef(0);

  const raf = useRef<number | null>(null);
  const paused = useRef(false);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    const container = containerRef.current!;
    const track = trackRef.current!;
    const original = track.children[0] as HTMLElement;

    original.style.marginRight = `${gap}px`;
    itemWidth.current = original.offsetWidth + gap;

    const clones =
      Math.ceil(container.offsetWidth / itemWidth.current) + 2;

    for (let i = 0; i < clones; i++) {
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.marginRight = `${gap}px`;
      track.appendChild(clone);
    }

    // Scroll direction control
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        dir.current = self.direction === 1 ? 1 : -1;
        if (direction === "left") dir.current *= -1;
      },
    });

    const wrap = () => {
      if (x.current <= -itemWidth.current) {
        x.current += itemWidth.current;
      } else if (x.current >= 0) {
        x.current -= itemWidth.current;
      }
    };

    const animate = () => {
      if (!paused.current) {
        x.current += speed * dir.current;
        wrap();
        gsap.set(track, { x: x.current });
      }
      raf.current = requestAnimationFrame(animate);
    };

    animate();

    if (draggable) {
      // ---------------------------
      // DRAGGABLE
      // ---------------------------
      Draggable.create(track, {
        type: "x",
        inertia: true,
        dragResistance: 0.8,  //  higher = slower drag
        throwResistance: 2500,  // higher = slower throw

        onPress() {
          paused.current = true;
          gsap.killTweensOf(track);
        },
        onDrag() {
          x.current = this.x;
          wrap();
        },
        onThrowUpdate() {
          x.current = this.x;
          wrap();
        },
        onRelease() {
          paused.current = false;
        },
      });
    }

    if (pauseOnHover) {
      // ---------------------------
      // HOVER PAUSE
      // ---------------------------
      container.addEventListener("mouseenter", () => {
        paused.current = true;
      });

      container.addEventListener("mouseleave", () => {
        paused.current = false;
      });
    }

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };

  }, {
    scope: containerRef,
    dependencies: [direction, speed, gap, draggable, pauseOnHover]
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${draggable ? "cursor-grab active:cursor-grabbing" : ""}   ${className}`}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
