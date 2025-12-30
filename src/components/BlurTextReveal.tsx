'use client';

import React, { ElementType, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface BlurTextRevealProps {
  text?: string;
  html?: string;
  as?: ElementType;
  className?: string;

  animationType?: 'words' | 'lines' | 'chars';
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  from?: 'start' | 'center' | 'end' | 'random';

  /** ScrollTrigger */
  start?: string;
  end?: string;
  once?: boolean;
  scrub?: boolean | number;
}

const BlurTextReveal = ({
  text,
  html,
  as: Tag = 'h2',
  className = '',

  animationType = 'words',
  stagger = 0.05,
  duration = 0.8,
  ease = 'power2.out',
  delay = 0,
  from = 'random',

  start = 'top 80%',
  end = 'bottom 20%',
  once = false,
  scrub = false,
}: BlurTextRevealProps) => {
  const textRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, {
      type: 'chars,words,lines',
      smartWrap:true,
      wordsClass:'words',
      charsClass:'chars',
      linesClass:'lines'
    });

    const targets =
      animationType === 'lines'
        ? split.lines
        : animationType === 'chars'
        ? split.chars
        : split.words;

    gsap.set([textRef.current, targets], {
      autoAlpha: 0,
      filter: 'blur(12px)',
      force3D: true,
    });

    const tl = gsap.timeline({
      delay,
      scrollTrigger: {
        trigger: textRef.current,
        start,
        end,
        scrub,
        once,
      },
    });

    tl.to(textRef.current, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease,
    }).to(
      targets,
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration,
        stagger: {
          each: stagger,
          from,
        },
        ease,
      },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
    };
  }, []);

  return (
    <Tag
      ref={textRef}
      className={className}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html && text}
    </Tag>
  );
};

export default BlurTextReveal;
