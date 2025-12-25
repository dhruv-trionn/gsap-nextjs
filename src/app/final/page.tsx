'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

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
                scrub: 1,
            }
        });

        // Loop to add animations to the timeline
        for (let i = 0; i < STRIPE_COUNT; i++) {
            tl.to(contentRef.current, {
                [`--h${i}`]: "0%", 
                duration: 1,
                ease: "power1.inOut" // Smooth easing
            }, i * STAGGER); 
        }

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
                        Innovation <br/> & Design
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
                        <h2 className='text-2xl mb-12 uppercase tracking-widest'>Our Mission</h2>
                        <p className="text-lg">Our goal is to make technology feel human. We build intuitive</p>
                        <p className="text-lg">and beautiful digital products.</p>
                    </div>
                    <div className='mt-20'>
                        <div className='text-6xl mb-12 font-medium leading-tight'>
                            <p>Trionn is an international design</p>
                            <p>agency crafting innovative ways</p>
                        </div>
                        <Link href={'#'} className="underline underline-offset-8">More About Us</Link>
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