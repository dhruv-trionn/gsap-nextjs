'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import Marquee from '@/components/DraggableMarquee';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';

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
                        <Marquee key={marqueeText} speed={2} >
                            <p className="text-sm font-bold">{marqueeText}</p>
                        </Marquee>
                    </div>
                </div>

                {/* Cards */}
                <Marquee draggable pauseOnHover speed={0.6} dragResistance={0.05} >
                    <div className="flex gap-6">
                        <ProjectCard onEnter={showCursor} onLeave={hideCursor} />
                        <FeaturedCard onEnter={showCursor} onLeave={hideCursor} />
                        <BrandsCard onEnter={showCursor} onLeave={hideCursor} />
                        <TeamCard onEnter={showCursor} onLeave={hideCursor} />
                    </div>
                </Marquee>
            </section>
        </>
    );
}

function ProjectCard({ onEnter, onLeave }: CardProps) {

    const cardRef = useRef<HTMLDivElement>(null);
    const cardTitleRef = useRef<HTMLHeadingElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);


    const handleEnter = () => {
        onEnter('Project');
        // gsap.from(counterRef.current, {
        //     innerText: 0,
        //     duration: 2.5,
        //     snap: {
        //         innerText: 1
        //     }
        // })

    };

    const handleLeave = () => {
        onLeave();


    };



    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}

            className="w-[320px] h-[420px] rounded-2xl bg-[#e9e6e2] p-6 flex flex-col justify-between overflow-hidden">
            <div>
                <h3 ref={cardTitleRef} className="text-sm uppercase tracking-wide text-gray-500">
                    Projects Completed
                </h3>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center">
                    <span ref={counterRef} className="text-4xl font-medium">999</span>+
                </div>
            </div>

            <p className="text-sm text-gray-600">
                90% of our clients seek our services for a second project.
            </p>
        </div>
    );
}


function FeaturedCard({ onEnter, onLeave }: CardProps) {


    const handleEnter = () => {
        onEnter('Team');


    };

    const handleLeave = () => {
        onLeave();


    };

    return (
        <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}

            className="w-[320px] h-[420px] rounded-2xl bg-[#2c2c2c] text-white overflow-hidden relative">
            <video
                autoPlay
                src="/lion-v3.mp4"
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
                    <span className="text-3xl font-medium">50+</span>
                    <p className="text-sm opacity-80 mt-2">
                        Recognition across leading design platforms worldwide.
                    </p>
                </div>
            </div>
        </div>
    );
}


function BrandsCard({ onEnter, onLeave }: CardProps) {
    return (
        <div onMouseEnter={() => onEnter('Brand')}
            onMouseLeave={onLeave} className="w-[320px] h-[420px] rounded-2xl border border-gray-300 bg-white p-6 flex flex-col justify-between overflow-hidden">
            <div>
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                    Brands We Work With
                </h3>
                <p className="text-sm text-gray-600 mt-3">
                    90% of our clients seek our services for a second project.
                </p>
            </div>

            <div className="text-right">
                <span className="text-lg font-semibold text-gray-700">
                    credible
                </span>
            </div>
        </div>
    );
}


function TeamCard({ onEnter, onLeave }: CardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

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

    return (
        <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="w-[320px] h-[420px] rounded-2xl bg-[#2f3336]
                 text-white overflow-hidden relative"
        >
            <video
                ref={videoRef}
                src="/lion-v3.mp4"
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

                    <span className="text-3xl font-medium">20+</span>
                </div>
            </div>
        </div>
    );
}