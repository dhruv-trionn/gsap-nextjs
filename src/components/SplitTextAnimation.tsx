'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

interface SplitTextAnimationProps {
  text: string;
  className?: string;
  duration?: number;
  stagger?: number;
  ease?: string;
  delay?: number;
  maskDirection?: 'up' | 'down' | 'left' | 'right';
}

export default function SplitTextAnimation({
  text,
  className = '',
  duration = 1.5,
  stagger = 0.08,
  ease = 'power3.out',
  delay = 0,
  maskDirection = 'up'
}: SplitTextAnimationProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const splitText = new SplitText(textRef.current, {
      type: 'chars, words',
      charsClass: 'char',
      wordsClass: 'word'
    });

    const chars = splitText.chars;

    // Set initial state based on mask direction
    const initialState = {
      up: { yPercent: 100, opacity: 0 },
      down: { yPercent: -100, opacity: 0 },
      left: { xPercent: -100, opacity: 0 },
      right: { xPercent: 100, opacity: 0 }
    };

    gsap.set(chars, {
      ...initialState[maskDirection],
      overflow: 'hidden',
      display: 'inline-block'
    });

    // Create the animation timeline
    const tl = gsap.timeline({
      delay: delay,
      ease: ease
    });

    // Animate characters one by one with masking effect
    const finalState = {
      up: { yPercent: 0, opacity: 1 },
      down: { yPercent: 0, opacity: 1 },
      left: { xPercent: 0, opacity: 1 },
      right: { xPercent: 0, opacity: 1 }
    };

    tl.to(chars, {
      ...finalState[maskDirection],
      duration: duration,
      stagger: stagger,
      ease: ease
    });

    // Cleanup function
    return () => {
      if (splitText) {
        splitText.revert();
      }
    };
  }, [text, duration, stagger, ease, delay, maskDirection]);

  return (
    <div 
      ref={textRef}
      className={`split-text-container ${className}`}
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {text}
    </div>
  );
}
