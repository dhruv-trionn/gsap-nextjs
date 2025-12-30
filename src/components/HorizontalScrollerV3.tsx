"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    cloneElement,
    ReactElement,
    ReactNode,
    useRef
} from "react";


gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollerProps {
    header?: ReactNode;
    slider: ReactElement
    className?: string;
}

const HorizontalScroller = ({
    header,
    slider,
    className = "",
}: HorizontalScrollerProps) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const sliderEl = sliderRef.current;
        if (!section || !sliderEl) return;

        const mm = gsap.matchMedia();

        mm.add(
            {
                mobile: "(max-width: 639px)",
                tablet: "(min-width: 640px) and (max-width: 1023px)",
                desktop: "(min-width: 1024px)",
            },
            (ctx) => {
                const { mobile, tablet } = ctx.conditions!;

                const scrollDistance =
                    sliderEl.scrollWidth - window.innerWidth;

                /* ---------- MOBILE ---------- */
                if (mobile) {
                    gsap.set(sliderEl, { x: 0 });
                    ScrollTrigger.getAll().forEach((st) => st.kill());
                    return;
                }

                /* ---------- TABLET + DESKTOP ---------- */
                gsap.to(sliderEl, {
                    x: () => -scrollDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${scrollDistance}`,
                        scrub: tablet ? 0.8 : 1,
                        pin: true,
                        // anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }
        );

        return () => mm.revert();
    }, {
        scope:sectionRef
    });

    return (
        <section ref={sectionRef} className={`${className}`} >
            {/* HEADER */}
            {header && (
                <>
                    {header}
                </>
            )}

            {/* SLIDER (ref injected) */}
            {cloneElement(slider as ReactElement<{ ref: typeof sliderRef }>, {
                ref: sliderRef,
            })}

        </section>
    );
};

export default HorizontalScroller;
