"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollV2 = () => {
  const horizontalRef = useRef<HTMLDivElement | null>(null);

  // The golden rule for horizontal scroll with ScrollTrigger:
  // Scroll distance = scrollWidth − viewportWidth
  useGSAP(() => {
    const container = horizontalRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        mobile: "(max-width: 639px)",
        tablet: "(min-width: 640px) and (max-width: 1023px)",
        desktop: "(min-width: 1024px) and (max-width: 1439px)",
        large: "(min-width: 1440px)",
      },
      (context) => {
        const { mobile, tablet, desktop, large } =
          context.conditions!;

        const baseDistance =
          container.scrollWidth - window.innerWidth;

        /* ------------------ MOBILE ------------------ */
        if (mobile) {
          gsap.set(container, { x: 0 });
          ScrollTrigger.getAll().forEach((st) => st.kill());
        }

        /* ------------------ TABLET ------------------ */
        if (tablet) {
          const distance = baseDistance + 50;

          gsap.to(container, {
            x: () => -distance,
            ease: "none",
            scrollTrigger: {
              trigger: ".panel-container",
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }

        /* ------------------ DESKTOP ------------------ */
        if (desktop) {
          gsap.to(container, {
            x: () => -baseDistance,
            ease: "none",
            scrollTrigger: {
              trigger: ".panel-container",
              start: "top top",
              end: () => `+=${baseDistance}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }

        /* ------------------ LARGE SCREENS ------------------ */
        if (large) {
          const distance = baseDistance * 1.15;

          gsap.to(container, {
            x: () => -distance,
            ease: "none",
            scrollTrigger: {
              trigger: ".panel-container",
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 1.2,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* SPACER */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        Spacer
      </section>

      {/* PANEL */}
      <div className="panel-container min-h-screen relative overflow-hidden">
        <div className="max-w-[300px] mx-auto py-20 text-center">
          <h2 className="uppercase">Great Team, Awesome work</h2>
          <p>
            A skilled team of professionals driving the project forward.
          </p>
        </div>

        {/* TRACK */}
        <div
          ref={horizontalRef}
          className="flex gap-6 px-8 w-max"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="slider-item min-w-[600px] border-r-2 border-red-400 flex flex-col gap-40"
            >
              <div>
                <h2 className="text-7xl mb-4">{i}.</h2>
                <h2>Product design</h2>
              </div>
              <p>
                Inspiring product design drives attention and loyalty.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SPACER */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        Spacer
      </section>
    </>
  );
};

export default HorizontalScrollV2;
