"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable, InertiaPlugin, ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);
}

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  draggable?: boolean;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  speed = 1,
  direction = "left",
  className = "",
  draggable = false,
  pauseOnHover = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isHovered = useRef(false);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".marquee-item");
      const dir = direction === "right" ? -1 : 1;

      const tl = horizontalLoop(items, {
        speed: speed * dir,
        repeat: -1,
        draggable,
        onDragRelease: () => {
          if (pauseOnHover && isHovered.current) {
            gsap.to(tl, { timeScale: 0, duration: 0.3 });
          } else {
            gsap.to(tl, { timeScale: speed * dir, duration: 0.3 });
          }
        },
      });

      tlRef.current = tl;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate(self) {
          const d = self.direction === 1 ? 1 : -1;
          gsap.to(tl, {
            timeScale: Math.abs(speed) * d,
            overwrite: true,
          });
        },
      });
    },
    { scope: containerRef, dependencies: [speed, direction, draggable] }
  );

  const onEnter = () => {
    isHovered.current = true;
    if (pauseOnHover && tlRef.current) {
      gsap.to(tlRef.current, { timeScale: 0, duration: 0.3 });
    }
  };

  const onLeave = () => {
    isHovered.current = false;
    if (pauseOnHover && tlRef.current) {
      const dir = direction === "right" ? -1 : 1;
      gsap.to(tlRef.current, {
        timeScale: speed * dir,
        duration: 0.3,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className} ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="flex w-fit">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="marquee-item flex-shrink-0 flex gap-[40px] pr-[40px]"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                LOOP HELPER                                 */
/* -------------------------------------------------------------------------- */

function horizontalLoop(
  items: HTMLElement[],
  config: {
    speed?: number;
    repeat?: number;
    draggable?: boolean;
    onDragRelease?: () => void;
  }
) {
  items = gsap.utils.toArray(items);
  const pixelsPerSecond = (config.speed || 1) * 100;

  const tl = gsap.timeline({
    repeat: config.repeat,
    defaults: { ease: "none", force3D: true },
    onReverseComplete() {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });

  const widths: number[] = [];
  const startX = items[0].offsetLeft;
  let totalWidth = 0;

  items.forEach((el, i) => {
    widths[i] = el.offsetWidth;
    totalWidth += el.offsetWidth;
  });

  gsap.set(items, { x: 0, force3D: true });

  items.forEach((item, i) => {
    const distanceToStart = item.offsetLeft - startX;
    const distanceToLoop = distanceToStart + widths[i];

    tl.to(
      item,
      {
        x: `-=${distanceToLoop}`,
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    ).fromTo(
      item,
      { x: totalWidth - distanceToLoop },
      {
        x: 0,
        duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond
    );
  });

  /* ------------------------------ DRAGGABLE ------------------------------ */

  if (config.draggable) {
  const proxy = document.createElement("div");

  let startProgress = 0;
  let startX = 0;

  let targetProgress = 0;
  let currentProgress = 0;

  let isDragging = false;
  let isGliding = false;

  const ratio = 1 / totalWidth;
  const dragMultiplier = 0.75;
  const smoothness = 0.08;

  const update = () => {
    if (!isDragging && !isGliding) return;

    currentProgress += (targetProgress - currentProgress) * smoothness;
    tl.progress(currentProgress);

    // stop glide when close enough
    if (!isDragging && Math.abs(targetProgress - currentProgress) < 0.0001) {
      isGliding = false;
      tl.play(); // ✅ autoplay resumes
    }
  };

  gsap.ticker.add(update);

  Draggable.create(proxy, {
    trigger: items[0].parentNode as HTMLElement,
    type: "x",
    inertia: true,
    dragResistance: 0.12,

    onPress() {
      isDragging = true;
      isGliding = false;

      startProgress = tl.progress();
      currentProgress = startProgress;
      targetProgress = startProgress;

      startX = this.x;

      tl.pause(); // pause autoplay
    },

    onDrag() {
      targetProgress =
        startProgress + (startX - this.x) * ratio * dragMultiplier;
    },

    onThrowUpdate() {
      targetProgress =
        startProgress + (startX - this.x) * ratio * dragMultiplier;
    },

    onRelease() {
      isDragging = false;
      isGliding = true; // 👈 allow smooth stop
      config.onDragRelease?.();
    },
  });
}

  return tl;
}
