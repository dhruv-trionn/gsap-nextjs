'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import Marquee from '@/components/DraggableMarquee';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { Odometer } from '@/components/Odometer';

type CardProps = {
    onEnter: (text: string) => void;
    onLeave: () => void;
};


export default function Page() {

    const cursorRef = useRef<HTMLDivElement>(null);
    const [marqueeText, setMarqueeText] = useState('');

    const moveCursor = (e: React.MouseEvent) => {
        if (!cursorRef.current) return;

        gsap.to(cursorRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2,
            ease: 'power3.out',
        });
    };

    const showCursor = (text: string) => {
        if (!cursorRef.current) return;

        setMarqueeText(text)

        gsap.to(cursorRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.2,
            ease: 'power3.out',
        });
    };

    const hideCursor = () => {
        if (!cursorRef.current) return;

        gsap.to(cursorRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power3.out',
        });
    };

    return (
        <>
            <div className='min-h-screen' ></div>
            <section
                onMouseMove={moveCursor}
                className="min-h-screen bg-[#f4f1ec] flex items-center justify-center flex-col gap-20"
            >
                {/* Cursor */}
                <div
                    ref={cursorRef}
                    className="fixed top-0 left-0 z-[9999] pointer-events-none
                  w-[150px] bg-black text-white
                   flex items-center justify-center scale-0 opacity-0"
                >
                    <div
                        className="text-xs uppercase tracking-wide overflow-hidden flex items-center justify-center"
                    >
                        <Marquee key={marqueeText} speed={1} >
                            <p className="text-sm font-bold">{marqueeText}</p>
                        </Marquee>
                    </div>
                </div>

                {/* Cards */}
                <Marquee draggable pauseOnHover speed={0.5}>
                    <div className="flex gap-6">
                        <ProjectCard onEnter={showCursor} onLeave={hideCursor} />
                        <FeaturedCard onEnter={showCursor} onLeave={hideCursor} />
                        <BrandsCard onEnter={showCursor} onLeave={hideCursor} />
                        <TeamCard onEnter={showCursor} onLeave={hideCursor} />
                        <WeAreForCard onEnter={showCursor} onLeave={hideCursor} />
                    </div>
                </Marquee>
            </section>
        </>
    );
}

function ProjectCard({ onEnter, onLeave }: CardProps) {
    const [isInView, setIsInView] = useState(false); // Start false
    const [isHovered, setIsHovered] = useState(false);
    const circleRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleEnter = () => {
        setIsHovered(true);
        onEnter('Project');
        gsap.to(circleRef.current, { scale: 1.1, duration: 0.4, ease: 'circ.out' });
    };

    const handleLeave = () => {
        setIsHovered(false);
        gsap.to(circleRef.current, { scale: 1, duration: 0.4, ease: 'circ.out' });
        onLeave();
    };

    useGSAP(() => {
        if (!cardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    } else {
                        setIsInView(false);
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        observer.observe(cardRef.current);

        return () => observer.disconnect();
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="relative w-[320px] h-[420px] rounded-2xl bg-[#e9e6e2] p-6 flex flex-col justify-between overflow-hidden cursor-pointer"
        >
            <h3 className="text-sm uppercase tracking-wide text-gray-500">
                Projects Completed
            </h3>

            <div className="flex flex-col items-center justify-center flex-1 relative">
                {/* Circle Background */}
                <div
                    ref={circleRef}
                    className="w-44 h-44 rounded-full bg-white shadow-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />

                {/* Counter Content */}
                <div className="relative z-10 flex items-center">
                    <span className="text-3xl font-bold flex items-center tabular-nums">
                        <Odometer
                            key={Number(isInView)}
                            value={999}
                            digitCount={3}
                            inView={isInView}
                            resetOnExit={true}
                            fontSize="text-3xl"
                            height={32}
                        />
                        <span className="ml-1">+</span>
                    </span>
                </div>
            </div>

            <p className="text-sm text-gray-600">
                90% of our clients seek our services for a second project.
            </p>
        </div>
    );
}

function FeaturedCard({ onEnter, onLeave }: CardProps) {

    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);


    const handleEnter = () => {
        onEnter('Team');
    };

    const handleLeave = () => {
        onLeave();
    };


    useGSAP(() => {
        if (!cardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    } else {
                        setIsInView(false);
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        observer.observe(cardRef.current);

        return () => observer.disconnect();
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}

            className="w-[320px] h-[420px] rounded-2xl bg-[#2c2c2c] text-white overflow-hidden relative">
            <video
                autoPlay
                src="/banner-t.mp4"
                muted
                playsInline
                loop
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 h-full p-6 flex flex-col justify-between bg-black/20">
                <h3 className="text-sm uppercase tracking-wide">
                    Featured & Awards
                </h3>

                <div>
                    <span className="text-3xl font-medium flex items-center">
                        <Odometer
                            key={Number(isInView)}
                            value={50}
                            digitCount={2}
                            inView={isInView}
                            resetOnExit={true}
                            fontSize="text-3xl"
                            height={32}
                        /> +
                    </span>
                    <p className="text-sm opacity-80 mt-2">
                        Recognition across leading design platforms worldwide.
                    </p>
                </div>
            </div>
        </div>
    );
}


function BrandsCard({ onEnter, onLeave }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const images = [
        "https://picsum.photos/id/1011/400/300",
        "https://picsum.photos/id/1015/400/300",
        "https://picsum.photos/id/1016/400/300",
        "https://picsum.photos/id/1018/400/300",
        "https://picsum.photos/id/1020/400/300",
    ];

    useGSAP(() => {
        const imgs = gsap.utils.toArray<HTMLImageElement>("[data-img]");
        if (!imgs.length) return;

        gsap.set(imgs, { opacity: 0 });
        gsap.set(imgs[0], { opacity: 1 });

        const tl = gsap.timeline({ repeat: -1 });
        const duration = 1.2; // How long the fade takes
        const pause = 2;    // How long the logo stays visible

        imgs.forEach((img, i) => {
            const nextIndex = (i + 1) % imgs.length;
            const nextImg = imgs[nextIndex];

            // 1. Wait for 'pause' seconds
            // 2. Fade OUT current and Fade IN next simultaneously
            tl.to(img, {
                opacity: 0,
                duration: duration,
                ease: "power1.inOut"
            }, `+=${pause}`)
                .to(nextImg, {
                    opacity: 1,
                    duration: duration,
                    ease: "power1.inOut"
                }, `<`); // "<" means start at the same time as the previous animation
        });

    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => onEnter("Brand")}
            onMouseLeave={onLeave}
            className="w-[320px] h-[420px] rounded-2xl border border-gray-300 bg-white p-6 flex flex-col justify-between overflow-hidden"
        >
            <div>
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                    Brands We Work With
                </h3>
                <p className="text-sm text-gray-600 mt-3">
                    90% of our clients seek our services for a second project.
                </p>
            </div>

            {/* Container for the logos */}
            <div className="relative w-full h-[140px] flex items-center justify-center">
                {images.map((src, i) => (
                    <Image
                        key={i}
                        src={src}
                        className="absolute w-auto h-full max-w-full object-contain"
                        data-img
                        fill
                        alt={`Brand logo ${i}`}
                    />
                ))}
            </div>
        </div>
    );
}


function TeamCard({ onEnter, onLeave }: CardProps) {
    const [isInView, setIsInView] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleEnter = () => {
        onEnter('Team');

        if (videoRef.current) {
            videoRef.current.currentTime = 0; // optional
            videoRef.current.play();
        }
    };

    const handleLeave = () => {
        onLeave();

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };


    useGSAP(() => {
        if (!cardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    } else {
                        setIsInView(false);
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        observer.observe(cardRef.current);

        return () => observer.disconnect();
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="w-[320px] h-[420px] rounded-2xl bg-[#2f3336]
                 text-white overflow-hidden relative"
        >
            <video
                ref={videoRef}
                src="/banner-t.mp4"
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 h-full p-6 flex flex-col justify-between bg-black/30">
                <h3 className="text-sm uppercase tracking-wide">
                    Our Team Members
                </h3>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm">Different skills.</p>
                        <p className="text-sm">One standard.</p>
                    </div>

                    <span className="text-3xl font-medium flex items-center">
                        <Odometer
                            key={Number(isInView)}
                            value={20}
                            digitCount={2}
                            inView={isInView}
                            resetOnExit={true}
                            fontSize="text-3xl"
                            height={32}
                        /> +
                    </span>

                </div>
            </div>
        </div>
    );
}

function WeAreForCard({ onEnter, onLeave }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    const titles = [
        "Technology", "Finance", "E-commerce", "BioTech", "Automotive",
        "Healthcare", "Fashion", "Energy", "Retail", "Manufacturing",
        "Software", "Consumer Goods", "Transportation", "Hospitality", "Logistics",
    ];

    const infiniteTitles = [...titles, ...titles];

    useGSAP(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const itemHeight = scroller.querySelector('h3')?.clientHeight || 0;
        const totalOriginalItems = titles.length;

        const tl = gsap.timeline({ repeat: -1 });

        for (let i = 0; i < totalOriginalItems; i++) {
            tl.to(scroller, {
                y: -1 * (i + 1) * itemHeight,
                duration: 0.5,
                ease: "none",
            })
                .to({}, { duration: 1 });
        }

    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => onEnter("We are for")}
            onMouseLeave={onLeave}
            className="relative w-[320px] h-[420px] rounded-2xl border border-gray-300 bg-white p-6 flex flex-col justify-between overflow-hidden"
        >
            <Image alt="" src={'https://picsum.photos/id/1020/400/300'} fill className='absolute inset-0 z-[1] object-cover' />
            <div className='absolute inset-0 opacity-50 bg-black z-[2]'></div>

            <div className='relative z-[3] text-white'>
                <div
                    className="h-[96px] overflow-hidden relative"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                    }}
                >
                    <div ref={scrollerRef} className="flex flex-col">
                        {infiniteTitles.map((title, index) => (
                            <h3 key={index} className="h-8 flex items-center text-xl font-medium tracking-wide opacity-90" >
                                {title}
                            </h3>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}