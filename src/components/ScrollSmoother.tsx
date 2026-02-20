'use client';

import gsap from 'gsap';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';

type SmoothScrollingProps = {
  children: React.ReactNode;
};

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisRef = useRef<LenisRef | null>(null);
  const isSpacePressed = useRef(false);

  useEffect(() => {
    // 1. Handle Spacebar Press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isSpacePressed.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 2. The Animation Loop
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);

      // Manual Spacebar Scrolling
      if (isSpacePressed.current && lenisRef.current?.lenis) {
        const scrollSpeed = 15;
        const currentScroll = lenisRef.current.lenis.scroll;

        lenisRef.current.lenis.scrollTo(currentScroll + scrollSpeed, {
          immediate: true,
        });
      }
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 3. Lenis Settings for Mouse Wheel
  const lenisOptions = {
    autoRaf: false, // We manage the loop manually via GSAP
    duration: 1.5, // The "smoothness" duration (higher = smoother)
    wheelMultiplier: 0.8, // Mouse wheel speed (higher = faster)
    touchMultiplier: 2, // Touch/Trackpad speed
    infinite: false, // Infinite scrolling
  };

  return (
    <ReactLenis root options={lenisOptions} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
