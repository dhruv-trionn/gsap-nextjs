"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollSmoother } from "gsap/ScrollSmoother";


export type ScrollSmootherProps = {
  smooth?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
  respectReducedMotion?: boolean;
  className?: string;
  children: React.ReactNode;
};

let _pluginsRegistered = false;

function registerPluginsOnce() {
  if (_pluginsRegistered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  _pluginsRegistered = true;
}

export default function ScrollSmootherProvider({
  smooth = 1,
  effects = true,
  normalizeScroll = true,
  respectReducedMotion = true,
  className,
  children,
}: ScrollSmootherProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, [respectReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerPluginsOnce();

    if (!(ScrollSmoother && (ScrollSmoother).create)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "ScrollSmoother plugin not found. Ensure you have access to Club GreenSock and the import path is correct."
        );
      }
      return;
    }

    if (!wrapperRef.current || !contentRef.current) return;

    if (reducedMotion) {
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth,
      effects,
      normalizeScroll,
    });

    // Refresh ScrollTrigger when Next.js route changes could reflow layout
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Kill smoother & ScrollTriggers on unmount
      try {
        smoother?.kill();
      } catch (_) {
        // ignore
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [smooth, effects, normalizeScroll, reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className={
        "gsap-smoother-wrapper overflow-hidden h-full w-full " + (className ?? "")
      }
      style={{
        minHeight: "100%",
      }}
    >
      <div ref={contentRef} className="gsap-smoother-content min-h-screen">
        {children}
      </div>
    </div>
  );
}
