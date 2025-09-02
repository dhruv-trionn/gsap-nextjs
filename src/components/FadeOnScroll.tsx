"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText"; // GSAP Club plugin
import { ElementType, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FadeOnScrollProps {
  text?: string; // plain text
  html?: string; // raw HTML
  as?: ElementType; // h1, h2, p, div, etc.
  className?: string; // styling
}

const FadeOnScroll = ({
  text,
  html,
  as: Tag = "h1",
  className = "",
}: FadeOnScrollProps) => {
  const textRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, {
      type: "chars",
      aria: 'none',
      charsClass: 'chars',
      autoSplit: true,
      smartWrap: true,
      onSplit: (self) => {
        return gsap.to(self.chars, {
          color: 'black',
          stagger: 0.03,
          scrollTrigger: {
            trigger: self.chars,
            endTrigger: self.chars[self.chars.length - 1],
            markers: true,
            scrub: true,
            // once: true, 
            start: "top 80%",
            end: "bottom center",
          }
        });
      }
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <Tag
      ref={textRef}
      className={`${className}  text-[rgba(0,0,0,0.27)]`}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html ? text : null}
    </Tag>
  );
};

export default FadeOnScroll;
