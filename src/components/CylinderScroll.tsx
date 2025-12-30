'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface CylinderItem {
    title: string;
    label: string;
}

interface CylinderScrollProps {
    items: CylinderItem[];
    videoSrc?: string;
    radius?: number;
    perspective?: string;
    backgroundColor?: string;
}

const CylinderScroll: React.FC<CylinderScrollProps> = ({
    items,
    videoSrc,
    radius = 400,
    perspective = '1200px',
    backgroundColor = 'bg-black'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textWrapperRef.current) return;

        const elements = gsap.utils.toArray<HTMLElement>(
            containerRef.current.querySelectorAll('.cylinder-item')
        );
        
        const spacing = 90 / elements.length; 

        // 1. Position items in 3D space
        elements.forEach((item, index) => {
            const angle = (index * spacing * Math.PI) / 180;
            const rotationAngle = index * -spacing;

            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            gsap.set(item, {
                transform: `translate3d(-50%, -50%, 0) translate3d(0px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`,
                position: 'absolute',
                top: '50%',
                left: '50%',
            });
        });

        // 2. Create the scrolling rotation
        const ctx = gsap.context(() => {
            gsap.fromTo(textWrapperRef.current,
                { rotateX: -100 },
                {
                    rotateX: 160,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=200%",
                        scrub: 1.2,
                        pin: true,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert(); // Clean up GSAP context
    }, [items, radius]);

    return (
        <div 
            className={`relative min-h-screen overflow-hidden ${backgroundColor}`} 
            ref={containerRef}
        >
            {videoSrc && (
                <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover absolute inset-0 opacity-60"
                />
            )}

            <div
                className="relative h-screen w-full flex items-center justify-center overflow-hidden"
                style={{ perspective }}
            >
                <div
                    ref={textWrapperRef}
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="cylinder-item w-full max-w-4xl flex justify-between items-center border-b border-white/10 px-8"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <span className="text-2xl md:text-4xl font-bold uppercase text-white">
                                {item.title}
                            </span>
                            <span className="text-sm text-gray-400 uppercase tracking-widest">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CylinderScroll;