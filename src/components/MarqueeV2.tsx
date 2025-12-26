"use client";

import { ReactElement, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  children: ReactElement;
  speed?: number;
  direction?: "left" | "right";
  gap?: number; // px gap BETWEEN marquee items
  className?: string;
}

// if the children is flex box then apply same px gap to both marquee gap and children flex box

export default function Marquee({
  children,
  speed = 0.5,
  direction = "left",
  gap = 40,
  className = "",
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const x = useRef(0);
  const dir = useRef(direction === "left" ? -1 : 1);
  const itemWidth = useRef(0);
  const raf = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const container = containerRef.current!;

      const original = track.children[0] as HTMLElement;

      // 👇 apply gap as margin (outside the child)
      original.style.marginRight = `${gap}px`;

      itemWidth.current = original.offsetWidth + gap;

      // clone until filled
      const clones =
        Math.ceil(container.offsetWidth / itemWidth.current) + 2;

      for (let i = 0; i < clones; i++) {
        const clone = original.cloneNode(true) as HTMLElement;
        clone.style.marginRight = `${gap}px`;
        track.appendChild(clone);
      }

      // scroll direction control
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir.current = self.direction === 1 ? 1 : -1;
          if (direction === "left") dir.current *= -1;
        },
      });

      const animate = () => {
        x.current += speed * dir.current;

        if (x.current <= -itemWidth.current) {
          x.current += itemWidth.current;
        } else if (x.current >= 0) {
          x.current -= itemWidth.current;
        }

        gsap.set(track, { x: x.current });
        raf.current = requestAnimationFrame(animate);
      };

      animate();
    }, containerRef);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      ctx.revert();
    };
  }, [direction, speed, gap]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className}`}
    >
      <div ref={trackRef} className="flex whitespace-nowrap">
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
