'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const Page = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const videoMaskRef = useRef<HTMLDivElement>(null);


    useGSAP(() => {

        if (!sectionRef.current || !sliderRef.current || !videoMaskRef.current) {
            return
        };

        const panels = gsap.utils.toArray('.slider-item');

        const scrollDistance =
            sliderRef.current.scrollWidth - window.innerWidth;


        gsap.timeline({
            scrollTrigger: {
                trigger: '.sticky-section',
                start: 'top top',
                end: () => `+=${scrollDistance}`,
                pin: true,
                scrub: true,
                markers: true,
            },
        })
            .fromTo(
                videoMaskRef.current,
                {
                    clipPath: 'circle(0% at 50% 50%)',
                },
                {
                    clipPath: 'circle(75% at 50% 50%)',
                    ease: 'none',
                }
            )
            .to(panels, {
                ease: 'none',
                x: () => -scrollDistance,
            })
            .to('.main-video', {
                yPercent: -42,
                ease: 'none'
            }, "<")


    }, [])

    return (
        <>
            <section className="min-h-screen flex items-center justify-center">
                Spacer
            </section>

            <section ref={sectionRef} className="sticky-section relative min-h-screen overflow-hidden">
                {/* 🔥 VIDEO MASK */}
                <div
                    ref={videoMaskRef}
                    className="absolute inset-0 z-[2] text-white"
                >
                    <video
                        src="/lion-v3.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full auto object-cover absolute inset-0 main-video"
                    />

                    <div className='absolute inset-0 z-[2] px-5 py-12' >
                        <div className='flex items-end justify-between' >
                            <div className='flex items-center  gap-12' >
                                <div className='flex flex-col items-start justify-center' >
                                    <h3 className='text-2xl mb-4' >Focus areas</h3>
                                    <Link href={'#'}>Brand visualisaton</Link>
                                    <Link href={'#'}>Rebarnding</Link>
                                    <Link href={'#'}>Corporate webistes</Link>
                                    <Link href={'#'}>Digital product</Link>

                                </div>
                                <div className='flex flex-col items-start justify-center'>
                                    <h3 className='text-2xl mb-4' >Industires</h3>
                                    <Link href={'#'}>Real esates</Link>
                                    <Link href={'#'}>Hospitility</Link>
                                    <Link href={'#'}>Protech</Link>
                                    <Link href={'#'}>Fintech</Link>

                                </div>
                                <div className='flex flex-col items-start justify-center mt-6' >
                                    <Link href={'#'}>SaaS</Link>
                                    <Link href={'#'}>Editech</Link>
                                    <Link href={'#'}>Lodging</Link>
                                </div>
                            </div>
                            <div>
                                <Link href={'#'}>View Services</Link>
                            </div>
                        </div>
                        {/* Slider */}
                        <div ref={sliderRef} className='absolute bottom-12 overflow-x-hidden px-12' >
                            <div className='flex items-center justify-center gap-6 flex-nowrap' >
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40">
                                    <div>
                                        <h2 className='text-7xl mb-4' >1.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40 ">
                                    <div>
                                        <h2 className='text-7xl mb-4' >2.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40 ">
                                    <div>
                                        <h2 className='text-7xl mb-4' >3.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40 ">
                                    <div>
                                        <h2 className='text-7xl mb-4' >4.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40 ">
                                    <div>
                                        <h2 className='text-7xl mb-4' >5.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                                <div className="slider-item border-r-2 border-white min-w-[600px] flex flex-col gap-40 ">
                                    <div>
                                        <h2 className='text-7xl mb-4' >6.</h2>
                                        <h2>Product design</h2>
                                    </div>
                                    <div>
                                        <p>inspiring product design drives attention, increases interaction, and fosters loyalty, postioning you ahead of the compitition</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* 🔥 CONTENT */}
                <div className="relative z-[1] min-h-screen p-10 text-white bg-neutral-900">
                    <div>
                        <h2 className="mb-6 text-2xl">Our Services</h2>
                        <p>We build great digital products by</p>
                        <p>combining smart strategy, creative</p>
                        <p>teamwork, and solid code.</p>
                    </div>

                    <div className="text-[8rem] uppercase leading-tight mt-20">
                        <h2>Inspire / Impact / Innovate</h2>
                        <h2>Inspire / Impact / Innovate</h2>
                        <h2>Inspire / Impact / Innovate</h2>
                    </div>
                </div>
            </section>

            <section className="min-h-screen flex items-center justify-center">
                Spacer
            </section>
        </>
    )
}

export default Page
