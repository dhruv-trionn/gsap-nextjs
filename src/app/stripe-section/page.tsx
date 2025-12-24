'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Link from 'next/link';
import React, { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger);

const Page = () => {

    const pinSection = useRef(null);
    const layers = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinSection.current,
                start: "top top",
                // endTrigger: ".next-section",
                endTrigger: layers.current[layers.current.length - 1],
                end: "bottom top",
                pin: true,
                scrub: true,
                markers: true,
            }
        })
        tl
            .to(layers.current, {
                scaleY: 0,
                stagger: 0.05,
            });

        // Hide Text 
        const hideTextTl = gsap.timeline({
            scrollTrigger: {
                trigger: layers.current[0],
                start: 'bottom 80%',
                endTrigger: layers.current[layers.current.length - 1],
                end: 'bottom 30%',
                scrub: true,
                markers: true,
            }

        });

        hideTextTl.to('.text-content', {
            yPercent:-100,
            autoAlpha: 0,
        })


    }, []);


    return (
        <>
            <section className='h-screen flex items-center justify-center' >Spacer</section>
            <section ref={pinSection} className='bg-amber-50 h-screen relative text-white overflow-hidden' >
                <div className='absolute inset-0 flex items-center justify-center z-[2]' >
                    {
                        Array.from({ length: 6 }).map((_, index) => {
                            return (
                                <div
                                    ref={(self) => {
                                        if (layers.current && self) {
                                            layers.current[index] = self
                                        }
                                    }}
                                    key={index}
                                    className="bg-neutral-900 min-w-1/6"
                                    style={{
                                        transform: 'scaleY(1)',
                                        height: '100%',
                                        transformOrigin: 'top'
                                    }}
                                />
                            )
                        })
                    }
                </div>
                <div className='text-content  relative z-[3] text-center h-full pt-20 flex flex-col'>
                    <div>
                        <h2 className='text-2xl mb-12' >Our Mission</h2>
                        <p>Our goal is to make technology feel human, We build intutive</p>
                        <p>and beautiful digital products with a focus on making them</p>
                        <p>simple and meaningful to people</p>
                    </div>
                    <div className='' >
                        <div className='text-6xl mt-20 mb-12' >
                            <p>Trionn is an international design and </p>
                            <p>development agency crafting innovative ways</p>
                            <p>to connect brands and people</p>
                        </div>
                        <Link href={'#'} >More About Us </Link>
                    </div>
                    <div className=' flex items-center justify-center mt-40' >
                        <h2 className='font-bold text-3xl text-center ' >Our Business Partners</h2>
                    </div>
                </div>
                <div className='absolute inset-0 bg-sky-300 z-[1] text-black' >
                    <h1 className='text-6xl absolute bottom-10 uppercase' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore quia, minus cumque quas porro officia voluptatum ab sapiente ipsam repudiandae id dolor incidunt, veniam natus esse pariatur expedita nostrum ullam.</h1>
                </div>
            </section>
            <section className=' next-section min-h-screen flex items-center justify-center bg-amber-100 min-w-full' >Spacer</section>
        </>
    )
}

export default Page