'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import BlurTextReveal from './BlurTextReveal'

gsap.registerPlugin(SplitText, ScrollTrigger)

interface CardItem {
    id: number | string,
    title: string;
    subtitle: string;
    image: string;
    list: string[];
    year: string;
    link: {
        text: string;
        href: string;
    };
    isEven: boolean,
}

const WipeImageCard = (item: CardItem) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const idRef = useRef<HTMLHeadingElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const listRef = useRef<HTMLLIElement[]>([]);
    const yearRef = useRef<HTMLSpanElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    const isEven = item.isEven;

    useGSAP(() => {
        if (!containerRef.current || !imageWrapperRef.current || !imageRef.current) return;

        const clipStart = isEven ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
        const clipEnd = "inset(0% 0% 0% 0%)";

        //  PARALLAX ANIMATION
        gsap.fromTo(imageRef.current,
            { yPercent: -15 },
            {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "top 20%",
                markers: true, // Removed markers for production cleaner look
                // toggleActions: "play none none reverse"
            },
            defaults: { duration: 0.8, ease: 'power3.out' }
        });

        gsap.set([listRef.current, yearRef.current, linkRef.current, subTitleRef.current], {
            autoAlpha: 0
        });

        gsap.set(listRef.current, { xPercent: 2 });

        tl.fromTo(imageWrapperRef.current,
            { clipPath: clipStart, yPercent: -10 },
            { clipPath: clipEnd, yPercent: 0, ease: 'expo.out', duration: 2, }
        )
            .fromTo(imageRef.current,
                { scale: 1.3, filter: 'blur(10px)' },
                { scale: 1.2, filter: 'blur(0px)' },
                "<"
            )

            // Line
            .to(lineRef.current, {
                scaleX: 1,
                ease: 'expo.out',
                duration: 2,
            }, "<")

            // Text Content Reveal
            .to(subTitleRef.current, {
                autoAlpha: 1,
            }, "<50%")

            // List Items
            .to(listRef.current, {
                autoAlpha: 1,
                xPercent: 0,
                stagger: 0.07,
                duration: 1.3,
            }, "<20%")

            .to([yearRef.current, linkRef.current], {
                autoAlpha: 1,
                stagger: 0.03,
            }, "<25%")

    }, [isEven]);

    return (
        <div
            ref={containerRef}
            className="relative mb-12 overflow-hidden"
        >
            <div className="mx-auto grid min-h-[650px] grid-cols-1 lg:grid-cols-2">
                {/* IMAGE WRAPPER */}
                <div
                    ref={imageWrapperRef}
                    className={`relative h-full w-full overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                    style={{ clipPath: isEven ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }}
                >
                    <Image
                        ref={imageRef}
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* CONTENT */}
                <div className={`relative flex flex-col justify-between px-10 py-20 lg:px-16 ${isEven ? 'lg:order-1' : 'lg:order-2'}`} >

                    {/* LINE */}
                    <div
                        ref={lineRef}
                        className={`absolute left-0 top-0 h-[3px] w-full scale-x-0 bg-black ${isEven ? "origin-top-left" : "origin-top-right"}`}
                    ></div>

                    <div className="content-top">
                        <div className='flex items-center justify-between' >
                            <h2 ref={idRef} className="mt-6 text-4xl font-light tracking-tight lg:text-5xl">
                                {item.id}.
                            </h2>
                            <span ref={yearRef} className="block text-3xl text-neutral-500">
                                {item.year}
                            </span>
                        </div>

                        <BlurTextReveal
                            as="h1"
                            text={item.title}
                            animationType="chars"
                            stagger={0.03}
                            start='top 80%'
                            className="mt-6 text-4xl font-light tracking-tight lg:text-5xl"
                        />

                        <p ref={subTitleRef} className="mt-4 max-w-md text-neutral-600">
                            {item.subtitle}
                        </p>

                        <ul className="mt-10 space-y-1 text-sm text-neutral-700">
                            {item.list.map((li, i) => (
                                <li
                                    ref={(el) => { if (el) listRef.current[i] = el }}
                                    key={i}
                                >
                                    {li}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="content-bottom">
                        <Link
                            ref={linkRef}
                            href={item.link.href}
                            className="group inline-flex items-center gap-4 border-b border-neutral-900 pb-2 text-sm uppercase tracking-wide"
                        >
                            {item.link.text}
                            <span className="transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WipeImageCard