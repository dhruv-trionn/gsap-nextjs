'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const AdvancedStack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLElement[] | []>([]);
    const [title, setTitle] = useState('Sticky Cards');

    const cards = [
        {
            title: 'Card 1',
            image:
                'https://plus.unsplash.com/premium_photo-1663840075276-090163d790aa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'lightblue',
        },
        {
            title: 'Card 2',
            image:
                'https://images.unsplash.com/photo-1765871319901-0aaafe3f1a2a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'skyblue',
        },
        {
            title: 'Card 3',
            image:
                'https://images.unsplash.com/photo-1764513168260-391d5a3ea21a?q=80&w=1470&auto=format&fit=crop',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'grey',
        },
    ];


    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${cards.length * 100}%`, // Length based on card count
                pin: true,
                scrub: true,
                markers: true,
            }
        });

        cardsRef.current.forEach((card, index) => {

            if (index !== 0) {
                gsap.set(card, {
                    yPercent: 200,
                    // autoAlpha: 0,
                })
            }

            tl.to(card, {
                yPercent: index * 10, // stack 
                // autoAlpha: 1,
                onComplete: () => {
                    setTitle(cards[index].title)
                },
                onReverseComplete: () => {
                    const title = cards[index - 1]?.title
                    setTitle(title || 'Sticky Cards')
                }
            });

            // previous card
            // const previousCard = cardsRef?.current[index - 1];

            // if (previousCard) {
            //     tl.to(previousCard, {
            //         scale: 0.5,
            //     }, "start")
            // }



        })
    }, {
        scope: containerRef
    });


    return (
        <div className="bg-white text-black">
            <section className="h-screen flex items-center justify-center">
                <h2 className="text-xl uppercase tracking-[0.5em] opacity-50">Scroll to Explore</h2>
            </section>

            <section ref={containerRef} className="h-screen bg-black flex items-center flex-col justify-center overflow-hidden text-black">
                <h2 className='text-white' >{title}</h2>
                <div className="relative w-[90%] max-w-[1000px] h-[400px]">
                    {cards.map((card, i) => {
                        return (
                            <div
                                ref={(self) => {
                                    if (self && cardsRef.current) {
                                        cardsRef.current[i] = self;
                                    }
                                }}
                                key={i}
                                className="card-item absolute inset-0 rounded-2xl p-8 flex flex-col justify-between shadow-2xl border border-white/10"
                                style={{
                                    background: `url(${card.image}) center / cover`,
                                    zIndex: i
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-3xl font-bold tracking-tight">{card.title}</h3>
                                    <span className="text-5xl font-black opacity-20">0{i + 1}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-1 w-12 bg-white/30 rounded" />
                                    <p className="text-lg leading-relaxed opacity-90">
                                        Advanced GSAP implementation using coordinated timelines and dynamic scaling for a true depth effect.
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="h-screen bg-white text-black flex items-center justify-center">
                <h2 className="text-4xl font-bold">End of Experience</h2>
            </section>
        </div>
    );
};

export default AdvancedStack;