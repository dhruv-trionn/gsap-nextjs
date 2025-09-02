"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText"; // GSAP Club
import React, { ElementType, useRef } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface RevelTextOnScrollProps {
    text?: string; // plain text
    html?: string; // raw HTML
    as?: ElementType; // h1, h2, p, div, etc.
    className?: string; // styling
    animation?: {
        yPercent?: number;
        opacity?: number;
        stagger?: number | gsap.StaggerVars;
        duration?: number;
        ease?: string;
        scrub?: boolean;
        markers?: boolean;
        startPosition?:string,
        endPosition?:string,
    };
}

const RevelTextOnScroll: React.FC<RevelTextOnScrollProps> = ({
    text,
    html,
    as: Tag = "h1",
    className = "text-5xl font-bold leading-tight",
    animation = {},
}) => {
    const textRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!textRef.current) return;

        new SplitText(textRef.current, {
            type: "lines", // you can extend to chars, words
            linesClass: "line",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => {
                return gsap.from(self.lines, {
                    yPercent: animation.yPercent ?? 100,
                    opacity: animation.opacity ?? 0,
                    stagger: animation.stagger ?? 0.05,
                    duration: animation.duration ?? 1,
                    ease: animation.ease ?? "power4.out",
                    autoAlpha: 0,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: animation.startPosition ?? "top center",
                        end: animation.endPosition ?? "bottom top",
                        scrub: animation.scrub ?? true,
                        markers: animation.markers ?? false,
                    },
                });
            },
        });
    }, [animation]);

    return (
        <Tag
            ref={textRef}
            className={className}
            dangerouslySetInnerHTML={html ? { __html: html } : undefined}
        >
            {!html ? text : null}
        </Tag>
    );
};

export default RevelTextOnScroll;
