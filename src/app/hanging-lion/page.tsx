"use client";

import Marquee from "@/components/MarqueeV2";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function CapsuleScrollPage() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !maskRef.current || !videoRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
                markers: false,
            },
        });

        tl.fromTo(maskRef.current, {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
        }, {
            width: '812px',
            height: '600px',
            borderRadius: '18.7rem',
            ease: "power2",
        })
            .fromTo(
                videoRef.current,
                { yPercent: -40 },
                { yPercent: -10, ease: "none" },
                "<"
            )

    }, []);


    return (
        <>
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                <p>Scroll Down</p>
            </div>

            <section
                ref={sectionRef}
                className="min-h-screen relative flex items-center justify-center bg-neutral-900 overflow-hidden py-24"
            >
                <div
                    ref={maskRef}
                    className="absolute inset-0 w-full h-full bg-[#E6E4E2] will-change-[clip-path] mx-auto overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover mix-blend-darken opacity-[0.9]"
                        src="/hanging-lion.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                </div>

                <div className="relative z-10 w-full flex-col flex justify-center items-start text-white mix-blend-difference pointer-events-none">
                    <Marquee>
                        <h1 className="text-[12vw] font-black tracking-tighter leading-none">
                            INNOVATE
                        </h1>
                    </Marquee>
                </div>
            </section>

            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                <p>Next Section</p>
            </div>
        </>
    );
}