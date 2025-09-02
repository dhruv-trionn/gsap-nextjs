"use client";

import React, { useEffect, useRef, PropsWithChildren } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type StickyHorizontalTwoUpProps = PropsWithChildren<{
  visibleSlides?: number;
  snap?: boolean | number;
  className?: string;
  trackClassName?: string;
}>;

export default function StickyHorizontalTwoUp({
  children,
  visibleSlides = 2,
  snap,
  className = "",
  trackClassName = "",
}: StickyHorizontalTwoUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const panels = Array.from(track.children) as HTMLElement[];

    const setPanelWidths = () => {
      const vw = window.innerWidth;
      const width = vw / Math.max(1, visibleSlides);
      panels.forEach((p) => {
        p.style.width = `${width}px`;
        p.style.flex = `0 0 ${width}px`;
      });
    };

    const getScrollAmount = () => {
      // Scroll the full width of all panels minus the viewport
      return track.scrollWidth - window.innerWidth;
    };

    const ctx = gsap.context(() => {
      setPanelWidths();

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setPanelWidths,
          ...(snap
            ? {
                snap: {
                  snapTo:
                    typeof snap === "number"
                      ? snap
                      : (value: number) => {
                          const steps = Math.max(
                            1,
                            panels.length - visibleSlides
                          );
                          return Math.round(value * steps) / steps;
                        },
                  duration: { min: 0.08, max: 0.25 },
                },
              }
            : {}),
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === container) st.kill();
        });
      };
    }, container);

    return () => ctx.revert();
  }, [visibleSlides, snap]);

  const hasChildren = React.Children.count(children) > 0;

  return (
    <section
      ref={containerRef}
      className={`relative h-screen overflow-hidden ${className}`}
    >
        <h1 className="text-center text-4xl absolute top-8 left-1/2 transform -translate-x-1/2 text-black text-4xl font-bold z-10">
            Horizontal Scroll Demo
          </h1>
      <div
        ref={trackRef}
        className={`flex h-full will-change-transform ${trackClassName}`}
      >
        {hasChildren ? (
          children
        ) : (
          <>
            <Panel>
              <img
                src="https://picsum.photos/400/300?random=1"
                alt="Slide 1"
                className="rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-black">Amazing Nature</h2>
              <p className="text-base max-w-xs text-center text-black">
                Discover breathtaking landscapes and serene views in this
                curated collection.
              </p>
            </Panel>
            <Panel>
              <img
                src="https://picsum.photos/400/300?random=2"
                alt="Slide 2"
                className="rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-black">Urban Life</h2>
              <p className="text-base max-w-xs text-center text-black">
                Explore the vibrant energy of cityscapes, full of motion and
                colors.
              </p>
            </Panel>
            <Panel>
              <img
                src="https://picsum.photos/400/300?random=3"
                alt="Slide 3"
                className="rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-black">Wildlife Wonders</h2>
              <p className="text-base max-w-xs text-center text-black">
                Experience the majesty of animals in their natural habitats.
              </p>
            </Panel>
            <Panel>
              <img
                src="https://picsum.photos/400/300?random=4"
                alt="Slide 4"
                className="rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-black">Adventure Awaits</h2>
              <p className="text-base max-w-xs text-center text-black">
                Embark on thrilling adventures across mountains, rivers, and
                deserts.
              </p>
            </Panel>
            <Panel>
              <img
                src="https://picsum.photos/400/300?random=5"
                alt="Slide 5"
                className="rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-black">Peaceful Retreats</h2>
              <p className="text-base max-w-xs text-center text-black">
                Find tranquility in quiet corners of the world, perfect for
                reflection.
              </p>
            </Panel>
          </>
        )}
      </div>
    </section>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`h-full w-full flex flex-col items-center justify-center text-white text-3xl font-bold p-6 ${className}`}>
            {children}
        </div>
    );
}
export { Panel };
