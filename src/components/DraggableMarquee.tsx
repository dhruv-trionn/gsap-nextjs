"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable, InertiaPlugin, ScrollTrigger } from "gsap/all";
import React, { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger, InertiaPlugin);
}

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  draggable?: boolean;
  pauseOnHover?: boolean;
  dragResistance?: number;
  throwResistance?: number;
}

export default function Marquee({
  children,
  speed = 1,
  direction = "left",
  className = "",
  draggable = false,
  pauseOnHover = false,
  dragResistance = 0.5, // Reduced for smoother feel
  throwResistance = 1000,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isHovered = useRef(false); // Track hover state manually

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".marquee-item") as HTMLElement[];
      const effectiveSpeed = speed * (direction === "right" ? -1 : 1);

      const tl = horizontalLoop(items, {
        speed: effectiveSpeed,
        repeat: -1,
        draggable: draggable,
        dragResistance,
        throwResistance,
        // Pass the hover state to the loop helper
        onDragRelease: () => {
          if (pauseOnHover && isHovered.current) {
            gsap.to(tl, { timeScale: 0, duration: 0.5 });
          } else {
            gsap.to(tl, { timeScale: effectiveSpeed, duration: 0.5 });
          }
        }
      });

      tlRef.current = tl;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          // Only change direction via scroll if not dragging
          const isDragging = Draggable.get(items[0].parentNode as any)?.isDragging;
          if (!isDragging) {
            const dir = self.direction === 1 ? 1 : -1;
            gsap.to(tl, { timeScale: dir * Math.abs(effectiveSpeed), overwrite: true });
          }
        },
      });
    },
    { scope: containerRef, dependencies: [speed, direction, draggable] }
  );

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (pauseOnHover && tlRef.current) {
      gsap.to(tlRef.current, { timeScale: 0, duration: 0.5, overwrite: true });
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    if (pauseOnHover && tlRef.current) {
      const s = speed * (direction === "right" ? -1 : 1);
      gsap.to(tlRef.current, { timeScale: s, duration: 0.5, overwrite: true });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className} ${draggable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-nowrap w-fit">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="marquee-item flex-shrink-0 flex gap-[40px] pr-[40px]">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

// Modified Loop Helper to accept the release callback
function horizontalLoop(items: HTMLElement[], config: any) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    },
  }),
    length = items.length,
    startX = items[0].offsetLeft,
    times: any[] = [],
    widths: any[] = [],
    xPercents: any[] = [],
    pixelsPerSecond = (config.speed || 1) * 100,
    totalWidth: number,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = ((parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 + Number(gsap.getProperty(el, "xPercent")));
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });

  totalWidth = items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], "scaleX") as number) + (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
    tl.to(item, { xPercent: ((curX - distanceToLoop) / widths[i]) * 100, duration: distanceToLoop / pixelsPerSecond }, 0)
      .fromTo(item, { xPercent: ((curX - distanceToLoop + totalWidth) / widths[i]) * 100 }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  if (config.draggable && typeof Draggable === "function") {
    let proxy = document.createElement("div"),
      wrap = gsap.utils.wrap(0, 1),
      ratio: number,
      startProgress: number,
      draggable: Draggable,
      align = () => {
        tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio))
      };

    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode as HTMLElement,
      type: "x",
      inertia: true,
      dragResistance: 0.08,
      throwResistance: 2500,
      minDuration: 0.5,
      maxDuration: 0.8,
      onPress() {
        startProgress = tl.progress();
        tl.progress(0);
        tl.progress(startProgress);
        gsap.killTweensOf(tl);
        tl.timeScale(0);
        ratio = 1 / totalWidth;
      },
      onDrag: () => {
        align()
      },
      onThrowUpdate: () => {
        align()
      },
      onRelease: () => {
        // This is the fix: call a callback to check hover state
        if (config.onDragRelease) config.onDragRelease();
      }
    })[0];
  }

  return tl;
}