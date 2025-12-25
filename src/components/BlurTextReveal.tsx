'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import React, { ElementType, useRef } from 'react';

gsap.registerPlugin(SplitText);

interface BlurTextRevealProps {
    text?: string;
    html?: string;
    as?: ElementType;
    className?: string;

    animationType?: 'words' | 'lines' | 'chars';
    stagger?: number;
    duration?: number;
    ease?: string;
    delay?: number;
    from?: 'start' | 'center' | 'end' | 'random';
}

const BlurTextReveal = ({
    text,
    html,
    as: Tag = 'h2',
    className = '',
    animationType = 'words',
    stagger = 0.05,
    duration = 0.8,
    ease = 'power2.out',
    delay = 0,
    from = 'random',

}: BlurTextRevealProps) => {
    const textRef = useRef<HTMLHeadingElement | null>(null);

    useGSAP(() => {
        if (!textRef.current) return;

        const split = new SplitText(textRef.current, {
            type: 'chars,words, lines',
        });

        const targets =
            animationType === 'lines'
                ? split.lines
                : animationType === 'chars'
                    ? split.chars
                    : split.words;

        const tl = gsap.timeline({ delay });


        tl
            .set(targets, {
                autoAlpha: 0,
                filter: 'blur(10px)',
                force3D: true,
            })
            .set(textRef.current, {
                autoAlpha: 0,
                filter: 'blur(10px)',
                force3D: true,
            })

            .to(textRef.current, {
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: ease,
            })

            .to(targets, {
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: duration,
                stagger: {
                    each: stagger,
                    from
                },
                ease: 'power2.out',
            }, "<");

        return () => {
            tl.kill();
            split.revert();
        };
    }, { scope: textRef });



    return (
        <Tag
            ref={textRef}
            className={`${className} opacity-0`}
            style={{ opacity: 0 }}
            dangerouslySetInnerHTML={html ? { __html: html } : undefined}
        >
            {!html ? text : null}
        </Tag>
    );
};

export default BlurTextReveal;