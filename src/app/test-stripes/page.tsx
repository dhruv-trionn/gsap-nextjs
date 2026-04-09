"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StripeOverlay, {
  type StripeOverlayHandle,
} from "@/components/StripeOverlay";

gsap.registerPlugin(ScrollTrigger);

/* ── Demo 1: Standalone (simple pin + stripe reveal) ── */
function StandaloneDemo() {
  return (
    <>
      {/* Pinned section with stripes that reveal as next section scrolls up */}
      <StripeOverlay
        pinnedContent={
          <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-[#0C0C0C] text-white">
            <h2 className="text-6xl font-bold mb-6">Standalone Mode</h2>
            <p className="text-xl text-gray-400 max-w-xl text-center">
              This section is pinned. As you scroll, stripes cover it and the
              next section scrolls over.
            </p>
          </div>
        }
        stripeCount={5}
        stripeColor="#D2D2D2"
        scrollEndTrigger="#after-standalone"
        scrollEnd="top center"
        staggerAmount={0.7}
      />

      {/* This section scrolls over the pinned one */}
      <section
        id="after-standalone"
        className="relative z-10 min-h-screen flex items-center justify-center bg-[#aa2c2c]"
      >
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mt-4">
            Section After Standalone
          </h2>
          <p className="text-lg text-gray-700">
            This scrolled up and covered the pinned section via stripes.
          </p>
        </div>
      </section>
    </>
  );
}

/* ── Demo 2: Controlled (parent-managed pin + animation + stripe exit) ── */
function ControlledDemo() {
  const driverRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<StripeOverlayHandle>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const driver = driverRef.current;
    const sticky = stickyRef.current;
    if (!driver || !sticky) return;

    /*
     * Pin for 400vh total:
     *   0–200vh  → main animation (counter 0→100)
     *   200–400vh → hold phase (stripes cover)
     */
    const TOTAL_VH = 400;
    const ANIM_FRAC = 0.5; // first 50% = animation, last 50% = stripe hold

    ScrollTrigger.create({
      trigger: driver,
      start: "top top",
      end: `+=${TOTAL_VH}%`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Animation phase: counter 0→100
        const animT = Math.min(1, p / ANIM_FRAC);
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(animT * 100));
        }

        // Hold phase: stripes 0→1
        const holdT = Math.max(
          0,
          Math.min(1, (p - ANIM_FRAC) / (1 - ANIM_FRAC)),
        );
        stripeRef.current?.setProgress(holdT);
      },
    });
  }, []);

  return (
    <>
      <div ref={driverRef} className="relative min-h-screen">
        <div
          ref={stickyRef}
          className="relative h-screen w-full overflow-hidden bg-[#1a1a2e] flex items-center justify-center"
        >
          <div className="text-center text-white z-10 relative">
            <h2 className="text-6xl font-bold mb-6">Controlled Mode</h2>
            <p className="text-xl text-gray-400 mb-8">
              Parent manages ScrollTrigger. Stripes animate after counter hits
              100.
            </p>
            <div className="text-9xl font-bold tabular-nums">
              <span ref={counterRef}>0</span>
              <span className="text-4xl text-gray-500 ml-2">%</span>
            </div>
          </div>

          {/* Controlled stripes — parent drives progress via ref */}
          <StripeOverlay
            ref={stripeRef}
            stripeCount={5}
            stripeColor="#e8e8e8"
            staggerFrom="end"
            staggerAmount={0.5}
          />
        </div>
      </div>

      {/* Section after controlled demo */}
      <section
        className="relative z-10 min-h-screen flex items-center justify-center bg-[#e8e8e8]"
        style={{ marginTop: "-100vh" }}
      >
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mb-4">
            Section After Controlled
          </h2>
          <p className="text-lg text-gray-700">
            This scrolled up after the stripes covered the animated section.
          </p>
        </div>
      </section>
    </>
  );
}

/* ── Page ── */
export default function TestStripesPage() {
  return (
    <div>
      {/* Intro */}
      <section className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-black mb-6">
            StripeOverlay Test
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scroll down to see two demos: <strong>Standalone</strong> (simple
            pin) and <strong>Controlled</strong> (parent-managed animation +
            stripes).
          </p>
        </div>
      </section>

      {/* Demo 1 */}
      <StandaloneDemo />

      {/* Spacer */}
      <section className="min-h-[50vh] flex items-center justify-center bg-[#f0f0f0]">
        <p className="text-2xl text-gray-500">
          Next up: Controlled mode demo
        </p>
      </section>

      {/* Demo 2 */}
      <ControlledDemo />

      {/* End */}
      <section className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <h2 className="text-5xl font-bold text-black">End of demos</h2>
      </section>
    </div>
  );
}
