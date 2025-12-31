'use client';

import React, { useRef, ReactNode, } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface StripeProps {
  customClass?: string;
  backgroundClass?: string;
  contentClass?: string;
  backgroundContent: ReactNode;
  stripeContent: ReactNode;
}
export default function Stripe({
  customClass,
  backgroundClass,
  contentClass,
  backgroundContent,
  stripeContent
}: StripeProps) {
  // --- CONFIGURATION ---
  const STRIPE_COUNT = 6;
  const STAGGER = 0.2;
  // ---------------------

  const stripeSection = useRef<HTMLDivElement>(null);
  const stripeContentBlock = useRef<HTMLDivElement>(null);

  // Helper to generate the exact grid using VW units
  const getMaskSettings = (count: number) => {
    const gradients: string[] = [];
    const positions: string[] = [];
    const cssVars: Record<string, string> = {};
    // Exact width of one stripe in Viewport Width units
    const widthVw = 100 / count;
    for (let i = 0; i < count; i++) {
      // 1. Define the gradient for this stripe using a variable
      gradients.push(`linear-gradient(to bottom, black var(--h${i}), transparent var(--h${i}))`);

      // 2. POSITION FIX: Use 'vw' instead of '%'
      // This forces strict grid alignment
      positions.push(`${i * widthVw}vw 0`);

      // 3. Initialize variable
      cssVars[`--h${i}`] = '100%';
    }
    return {
      style: {
        ...cssVars,
        maskImage: gradients.join(','),
        WebkitMaskImage: gradients.join(','),

        maskPosition: positions.join(','),
        WebkitMaskPosition: positions.join(','),

        // SIZE FIX: Use 'vw' and add slight overlap (+0.2vw) to prevent hairline gaps
        maskSize: `${widthVw + 0.2}vw 100%`,
        WebkitMaskSize: `${widthVw + 0.2}vw 100%`,

        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      } as React.CSSProperties
    };
  };

  useGSAP(() => {

    gsap.config({ force3D: true });

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: stripeSection.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        snap: {
          snapTo: "labels",
          duration: 0.4,
          ease: "power1.inOut",
        }
      },
    });

    // ==============================
    // SPLIT TEXT
    // ==============================
    const overlaySplit = new SplitText(".overlay-text", {
      type: "words",
      smartWrap: true,
    });

    const hiddenSplit = new SplitText(".hidden-overlay-text", {
      type: "words",
      smartWrap: true,
    });

    gsap.set(overlaySplit.words, {
      autoAlpha: 0,
      y: 20,
      filter: "blur(12px)",
    });

    gsap.set(hiddenSplit.words, {
      autoAlpha: 0,
      y: 20,
      filter: "blur(12px)",
    });

    // ==============================
    // 1️⃣ OVERLAY TEXT IN
    // ==============================
    const overlayIn = gsap.timeline();
    overlayIn.to(overlaySplit.words, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: {
        each: 0.05,
        from: "random",
      },
      duration: 1.2,
      ease: "power2.out",
    });

    // ==============================
    // 2️⃣ OVERLAY TEXT OUT
    // ==============================
    const overlayOut = gsap.timeline();
    overlayOut.to(overlaySplit.words, {
      autoAlpha: 0,
      y: -20,
      filter: "blur(12px)",
      stagger: {
        each: 0.05,
        from: "random",
      },
      duration: 1.2,
      ease: "none",
    });

    // ==============================
    // 3️⃣ HIDDEN TEXT IN
    // ==============================
    const hiddenIn = gsap.timeline();
    hiddenIn.to(hiddenSplit.words, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: {
        each: 0.06,
        from: "random",
      },
      duration: 1.4,
      ease: "power2.out",
    });

    // ==============================
    // 4️⃣ STRIPES
    // ==============================
    const stripes = gsap.timeline();
    for (let i = 0; i < STRIPE_COUNT; i++) {
      stripes.to(
        stripeContentBlock.current,
        {
          [`--h${i}`]: "0%",
          duration: 0.6,
          ease: "power1.inOut",
        },
        i * STAGGER
      );
    }

    // ==============================
    // MASTER SEQUENCE
    // ==============================
    master
      .add(overlayIn)
      .add(overlayOut)
      .add(hiddenIn)
      .add("textRevealDone")
      .add(stripes);

    return () => {
      overlaySplit.revert();
      hiddenSplit.revert();
    };
  }, { scope: stripeSection, dependencies: [STRIPE_COUNT] });

  const maskConfig = getMaskSettings(STRIPE_COUNT);

  return (
    <section className={`h-screen relative overflow-hidden ${customClass ? customClass : ''}`} ref={stripeSection}>
      {/* 1. BACKGROUND LAYER (Blue Reveal) */}
      <div className={`absolute inset-0 z-0 ${backgroundClass ? backgroundClass : ''}`}>
        {backgroundContent && (
          <>
            {backgroundContent}
          </>
        )}
      </div>
      {/* 2. FOREGROUND LAYER (Black Mask + Text) */}
      <div
        ref={stripeContentBlock}
        className={`absolute inset-0 z-10 ${contentClass ? contentClass : ''}`}
        style={maskConfig.style}
      >
        {stripeContent && (
          <>
            {stripeContent}
          </>
        )}
      </div>
    </section>
  );
};