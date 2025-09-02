"use client";
import { useRef, useEffect, ReactElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
interface MarqueeProps {
  content: ReactElement;
}

export default function Marquee({ content }: MarqueeProps) {
  const firstText = useRef<HTMLDivElement>(null);
  const secondText = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.25,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: "-=500px",
    });
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (firstText.current || secondText.current) {
      if (xPercent < -100) {
        xPercent = 0;
      } else if (xPercent > 0) {
        xPercent = -100;
      }
      gsap.set(firstText.current, { xPercent: xPercent });
      gsap.set(secondText.current, { xPercent: xPercent });
      xPercent += 0.1 * direction;
      requestAnimationFrame(animate);
    }
  };

  return (
    <div className="tc__marquee">
      <div className="tc__marquee__container">
        <div ref={slider} className="tc__marquee__slider">
          <div ref={firstText}>{content}</div>
          <div ref={secondText}>{content}</div>
        </div>
      </div>
      <div className="tc__marquee__spacer">{content}</div>
    </div>
  );
}
