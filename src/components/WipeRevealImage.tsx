'use client';

import { useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface WipeRevealImageProps extends ImageProps {
    direction?: 'fromLeft' | 'fromRight';
    maskColor?: string;
    scrollStart?: string;
    scrollEnd?: string;
    className?: string;
}

const WipeRevealImage = ({
    direction = 'fromLeft',
    maskColor = 'bg-white',
    scrollStart = 'top center',
    scrollEnd = 'bottom top',
    className = '',
    alt,
    ...imageProps
}: WipeRevealImageProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!maskRef.current || !imageWrapperRef.current) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: scrollStart,
                    end: scrollEnd,
                    toggleActions: 'play none none none',
                    markers: true,
                },
                defaults: {
                    ease: 'power3.inOut',
                    duration: 1.4,
                },
            });

            // 1. Set initial state of image wrapper (slightly zoomed in)
            tl.set(imageWrapperRef.current, { scale: 1.3 });

            // 2. The Animation Timeline
            tl.to(maskRef.current, {
                // Move mask 100% to the right or -100% to the left based on direction prop
                xPercent: direction === 'fromLeft' ? 100 : -100,
            })
                // Animate the image scale back to 1 at the same time ('<') as the mask wipe
                .to(
                    imageWrapperRef.current,
                    {
                        scale: 1.1,
                    },
                    '<'
                );

                // --- PARALLAX ANIMATION ---
            gsap.fromTo(
                imageWrapperRef.current,
                { yPercent: -10 }, 
                {
                    yPercent: 10,   
                    ease: 'none',   
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom', 
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            );
        },
        { scope: containerRef, dependencies: [direction] }
    );

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* Mask Layer */}
            <div
                ref={maskRef}
                className={`absolute inset-0 z-10 h-full w-full ${maskColor}`}
            ></div>

            {/* Image Wrapper: Used for the scaling effect */}
            <div ref={imageWrapperRef} className="h-full w-full origin-center">
                {/* Standard Next Image */}
                <Image
                    alt={alt}
                    className="h-full w-full object-cover"
                    {...imageProps}
                />
            </div>
        </div>
    );
};

export default WipeRevealImage;