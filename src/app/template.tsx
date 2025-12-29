'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

export default function Template({ children }: { children: React.ReactNode }) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({
            defaults: { ease: 'power4.inOut' },
        });

        // RESET
        gsap.set(overlayRef.current, {
            clipPath: 'inset(100% 0% 0% 0%)',
        });

        gsap.set(textRef.current, {
            opacity: 1,
        });

        // INTRO (clip-path in)
        tl.to(overlayRef.current, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.8,
        });

        // SCRAMBLE TEXT
        tl.to(textRef.current, {
            scrambleText: {
                text: 'LOADING',
                chars: '█▓▒░<>/',
                speed: 0.3,
            },
            duration: 1,
        });

        // HOLD
        tl.to({}, { duration: 0.2 });

        // OUTRO (clip-path out)
        tl.to(overlayRef.current, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.8,
            onComplete: () => {
                setShowPage(true);
            },
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <>
            {/* TRANSITION OVERLAY */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            >
                <h1
                    ref={textRef}
                    className="text-white text-4xl font-bold tracking-widest"
                >
                    &nbsp;
                </h1>
            </div>

            {/* PAGE CONTENT */}
            <div
                style={{
                    opacity: showPage ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                {showPage && children}
            </div>
        </>
    );
}
