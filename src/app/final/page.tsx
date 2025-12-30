'use client';
import BlurTextReveal from '@/components/BlurTextReveal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Page = () => {
    // --- CONFIGURATION ---
    const STRIPE_COUNT = 6;
    const STAGGER = 0.1;
    // ---------------------

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: 1.2,
            },
        });

        tl.add("pinStart");

        // ==============================
        // SPLIT OVERLAY TEXT (FADE OUT)
        // ==============================
        const overlaySplit = new SplitText(".overlay-text", {
            type: "words",
            smartWrap: true,
        });

        // ==============================
        // SPLIT HIDDEN TEXT (FADE IN + BLUR)
        // ==============================
        const hiddenSplit = new SplitText(".hidden-overlay-text", {
            type: "words",
            smartWrap: true,
        });

        gsap.set(hiddenSplit.words, {
            autoAlpha: 0,
            filter: "blur(12px)",
            y: 20,
            force3D: true,
        });

        // --------------------------------
        // 1️⃣ OVERLAY TEXT FADE OUT (COMPLETE FIRST)
        // --------------------------------
        tl.to(
            overlaySplit.words,
            {
                autoAlpha: 0,
                y: -20,
                filter: "blur(12px)",
                stagger: {
                    each: 0.05,
                    from: "random",
                },
                ease: "none",
            },
            "pinStart+=0.3"
        );

        // --------------------------------
        // 2️⃣ HIDDEN TEXT FADE IN (STARTS AFTER 1️⃣ ENDS)
        // --------------------------------
        tl.to(hiddenSplit.words, {
            autoAlpha: 1,
            filter: "blur(0px)",
            y: 0,
            stagger: {
                each: 0.06,
                from: "random",
            },
            ease: "power2.out",
        });

        // --------------------------------
        // LABEL AFTER TEXT REVEAL
        // --------------------------------
        tl.add("textRevealDone");

        // --------------------------------
        // STRIPE ANIMATION
        // --------------------------------
        for (let i = 0; i < STRIPE_COUNT; i++) {
            tl.to(
                contentRef.current,
                {
                    [`--h${i}`]: "0%",
                    ease: "power1.inOut",
                },
                `textRevealDone+=${i * STAGGER}`
            );
        }

        return () => {
            overlaySplit.revert();
            hiddenSplit.revert();
        };
    }, { scope: containerRef, dependencies: [STRIPE_COUNT] });


    const maskConfig = getMaskSettings(STRIPE_COUNT);

    return (
        <main>
            <section className='h-screen flex items-center justify-center bg-white text-black'>
                <h1 className="text-2xl">Scroll Down to Reveal</h1>
            </section>

            <section ref={containerRef} className='h-screen relative overflow-hidden bg-sky-300'>

                {/* 1. BACKGROUND LAYER (Blue Reveal) */}
                <div className='absolute inset-0 z-0 flex items-center justify-center p-10'>
                    <h1 className='text-8xl font-black uppercase text-sky-500 opacity-40 text-center leading-none'>
                        Innovation <br /> & Design
                    </h1>
                </div>

                {/* 2. FOREGROUND LAYER (Black Mask + Text) */}
                <div
                    ref={contentRef}
                    className='absolute inset-0 z-10 bg-neutral-900 flex flex-col text-center text-white pt-20'
                    style={maskConfig.style}
                >
                    {/* SEO CONTENT */}
                    <div>
                        <BlurTextReveal
                            as="h2"
                            text={`Our Mission`}
                            animationType="words"
                            stagger={0.08}
                            className="text-2xl mb-12 uppercase tracking-widest"
                        />
                        <BlurTextReveal
                            as="p"
                            text={`Our goal is to make technology feel human. We build intuitive and beautiful digital products.`}
                            animationType="lines"
                            stagger={0.09}
                            className="text-lg max-w-[500px] mx-auto"
                        />

                    </div>
                    <div className='mt-20  w-full'>
                        <div className='relative text-6xl mb-12 font-medium leading-tight max-w-[1150px] mx-auto w-full'>
                            <div className='w-full relative text-center' >
                                <BlurTextReveal
                                    as="p"
                                    text={`Trionn® is an international digital studio from India that helps brands grow using strategy-led design and technology.`}
                                    animationType="lines"
                                    stagger={0.05}
                                    className='overlay-text absolute w-full'
                                />
                                <p className='hidden-overlay-text' >
                                    Our mission is to make technology feel human-by designing digital products that are intuitive, purposeful, and meaningful to people.
                                </p>
                            </div>
                        </div>
                        {/* <Link href={'#'} className="underline underline-offset-8">More About Us</Link> */}
                    </div>
                    <div className='mt-auto pb-20'>
                        <h2 className='font-bold text-3xl'>Our Business Partners</h2>
                    </div>
                </div>
            </section>

            <section className='h-screen flex items-center justify-center bg-amber-100'>
                <h1 className="text-2xl">Footer / Next Content</h1>
            </section>
        </main>
    );
};

export default Page;