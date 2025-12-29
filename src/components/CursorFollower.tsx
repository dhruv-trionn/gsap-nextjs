'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorFollower() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Initial position
        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
        });

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power3.out',
            });
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed top-0 left-0 z-[9999]
                 h-4 w-4 rounded-full bg-white mix-blend-difference blur-sm"
        />
    );
}
