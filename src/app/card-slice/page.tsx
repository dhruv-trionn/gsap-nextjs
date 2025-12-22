"use client"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import React, { useRef } from 'react'

const Page = () => {

    const cardsRef = useRef<HTMLElement[]>([]);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const cardsContainerRef = useRef<HTMLDivElement | null>(null);

    const cards = [
        {
            title: 'Card 1',
            image:
                '/image_part_001.jpg',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'lightblue',
        },
        {
            title: 'Card 2',
            image:
                '/image_part_002.jpg',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'skyblue',
        },
        {
            title: 'Card 3',
            image:
                '/image_part_003.jpg',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            bg: 'grey',
        },
    ];

    useGSAP(() => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${cards.length * 100}%`, // Length based on card count
                pin: true,
                markers: true,
                scrub: true,
            }
        });

        const cardsFront = gsap.utils.toArray('.card-front')
        const cardsBack = gsap.utils.toArray('.card-back')

        tl
            .to(cardsContainerRef.current, {
                scale: 0.95,
            })
            .to(cardsContainerRef.current, {
                gap: '2rem',
                ease: 'back.in'
            })
            .to(cardsFront, {
                rotateY: 0,
                backfaceVisibility: 'visible',
                ease: 'none',
            })
            .to(cardsBack, {
                rotateY: 180,
                backfaceVisibility: 'hidden',
                ease: 'none',
            }, "<")

            .to(cardsRef.current, {
                rotateZ: 10,
                borderRadius: 32,
            }, "<")


    }, {
        scope: sectionRef
    })

    return (
        <>
            <section className='min-h-screen' ></section>
            <div className='h-screen flex flex-col items-center justify-center bg-gray-200 relative ' ref={sectionRef} >
                <div className='flex items-center justify-center perspective-[1200px]' ref={cardsContainerRef} >
                    {
                        cards.map((card, index) => {
                            return (
                                <div
                                    ref={(self) => {
                                        if (self && cardsRef.current) {
                                            cardsRef.current[index] = self
                                        }
                                    }}
                                    key={index} className={`h-[600px] w-[350px] relative overflow-hidden`} >
                                    <div className={`card-front absolute inset-0 backface-hidden rotate-y-180 flex text-center justify-center items-center font-bold text-4xl`} style={{ backgroundColor: card.bg }} >{card.title}</div>
                                    <div
                                        className='card-back absolute inset-0 bg-blue-500 '>
                                        <Image fill src={card.image} alt={card.title} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <section className='min-h-screen' ></section>
        </>
    )
}

export default Page