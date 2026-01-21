'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

export default function Template({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
      });

      // INITIAL STATE
      gsap.set(overlayRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
      });

      gsap.set(textRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
      });

      // INTRO — CIRCLE REVEAL
      tl.to(overlayRef.current, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 1.1,
      });

      // SCRAMBLE TEXT
      tl.to(
        textRef.current,
        {
          scrambleText: {
            text: 'LOADING',
            chars: '▒▓█<>—/',
            speed: 0.35,
          },
          duration: 1,
        },
        '-=0.6'
      );

      // HOLD
      tl.to({}, { duration: 0.2 });

      // OUTRO — SCALE + BLUR + EXIT
      tl.to(textRef.current, {
        scale: 1.2,
        filter: 'blur(8px)',
        opacity: 0,
        duration: 0.6,
      });

      tl.to(
        overlayRef.current,
        {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 0.9,
          onComplete: () => setReady(true),
        },
        '-=0.4'
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* TRANSITION OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      >
        <div
          ref={textRef}
          className="text-white text-[clamp(2rem,6vw,6rem)] font-semibold tracking-[0.2em]"
        >
          &nbsp;
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {ready && children}
      </div>
    </>
  );
}
