'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const CylinderScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);

    const awards = [
        { title: "GSAP", label: "Website of the day" },
        { title: "CSSDA", label: "Website of the day" },
        { title: "Orpetron", label: "Website of the day" },
        { title: "Awwwards", label: "Website of the day" },
        { title: "The FWA", label: "Website of the day" },
        { title: "Design Awards", label: "Website of the day" },
        { title: "Landing.Love", label: "Website of the day" },
        { title: "CSS Winner", label: "Website of the day" },
        { title: "CSSnecter", label: "Website of the day" },
        { title: "Codrops", label: "Website of the day" },
    ];

    useEffect(() => {
        if (!containerRef.current || !textWrapperRef.current) return;

        const items = gsap.utils.toArray<HTMLElement>('.cylinder-item');
        const radius = 400; // The 'depth' of the cylinder
        const spacing = 90 / items.length; // Spread items across half a circle

        // 1. Position items in 3D space (The GitHub Logic)
        items.forEach((item, index) => {
            const angle = (index * spacing * Math.PI) / 180;
            const rotationAngle = index * -spacing;

            // Calculate Y (height) and Z (depth)
            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            gsap.set(item, {
                transform: `translate3d(-50%, -50%, 0) translate3d(0px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`,
                position: 'absolute',
                top: '50%',
                left: '50%',
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top", // Starts when container enters screen
                end: "+=200%",   // Ends when container leaves screen
                scrub: 1.2,            // Smoothly follows scroll
                pin: true,
            }
        })

        tl.add('pinned');
        // 2. Create the scrolling rotation (The "No-Pin" Logic)
        tl.fromTo(textWrapperRef.current,
            {
                rotateX: -100
            }, // Start angle (tilted up)
            {
                rotateX: 160,    // End angle (tilted down)
                ease: 'none',

            }, "pinned+=0.3"
        );

        // tl.to('.main-video',{
        //     yPercent:-10,
        // })

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="bg-black text-white">
            {/* Top Spacer */}
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-xl text-gray-500">Scroll down for the cylinder</h1>
            </div>

            {/* The Cylinder Section */}
            <div className='min-h-screen overflow-hidden' ref={containerRef} >
                <video
                    src="/lion-v3.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full auto object-cover absolute inset-0 main-video"
                />
                <div

                    className="relative h-screen w-full flex items-center justify-center overflow-hidden"
                    style={{ perspective: '1200px' }}
                >
                    <div
                        ref={textWrapperRef}
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {awards.map((award, i) => (
                            <div
                                key={i}
                                className="cylinder-item w-full max-w-4xl flex justify-between items-center  border-b border-white/10"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <span className="text-2xl font-bold uppercase">{award.title}</span>
                                <span className="text-sm text-gray-400 uppercase tracking-tighter">{award.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Bottom Spacer */}
            <div className="h-screen flex items-center justify-center bg-zinc-900" />
        </div>
    );
};

export default CylinderScroll;