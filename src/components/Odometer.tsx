"use client";
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface OdometerProps {
    value: number;
    digitCount?: number;
    inView?: boolean;        // Triggered by your IntersectionObserver
    trigger?: boolean;       // Triggered by Hover
    resetOnExit?: boolean;   // The key prop you requested
    fontSize?: string;
    height?: number;
    duration?: number;
}

export function Odometer({ 
    value, 
    digitCount = 3, 
    inView = false,
    trigger = false,
    resetOnExit = true, 
    fontSize = "text-5xl", 
    height = 48,
    duration = 2
}: OdometerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const digitRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    // Split the target number into an array of digits
    const digits = value.toString().padStart(digitCount, '0').split("");
    const numberStack = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const { contextSafe } = useGSAP({ scope: containerRef });

    // Function to spin the numbers UP
    const animateOdometer = contextSafe(() => {
        digitRefs.current.forEach((col, index) => {
            if (!col) return;
            const targetDigit = parseInt(digits[index]);

            gsap.to(col, {
                y: -targetDigit * height,
                duration: duration,
                delay: index * 0.1, 
                ease: "power3.inOut",
            });
        });
    });

    // Function to reset the numbers to 0
    const resetOdometer = contextSafe(() => {
        digitRefs.current.forEach((col) => {
            if (col) {
                gsap.to(col, { 
                    y: 0, 
                    duration: 0.5, 
                    ease: "power2.in" 
                });
            }
        });
    });

    // Monitor both inView (Scroll) and trigger (Hover)
    useEffect(() => {
        const shouldAnimate = inView || trigger;

        if (shouldAnimate) {
            animateOdometer();
        } else if (!shouldAnimate && resetOnExit) {
            resetOdometer();
        }
    }, [inView, trigger, resetOnExit, value]);

    return (
        <div ref={containerRef} className="flex overflow-hidden" style={{ height: `${height}px` }}>
            {digits.map((_, i) => (
                <div 
                    key={i} 
                    className="flex flex-col"
                    ref={(el) => { digitRefs.current[i] = el; }}
                    style={{ lineHeight: `${height}px` }}
                >
                    {numberStack.map((num) => (
                        <span key={num} className={`${fontSize} font-semibold tabular-nums`} style={{ height: `${height}px` }}>
                            {num}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}