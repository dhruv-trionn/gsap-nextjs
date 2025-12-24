'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Physics2DPlugin, ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React from 'react'
import { SplitText } from 'gsap/SplitText';


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Physics2DPlugin);



const Page = () => {

    useGSAP(() => {

        const panels = gsap.utils.toArray('.panel');

        if (!panels.length) return;

        const horizontalTween = gsap.to(panels, {
            ease: 'none',
            xPercent: -100 * (panels.length - 1),
            scrollTrigger: {
                trigger: '.panel-container',
                start: 'top top',
                end: `+=${panels.length * 100}%`,
                markers: true,
                scrub: 1,
                pin: true,
                // snap: 1 / (panels.length - 1),
                // anticipatePin: 1,
                // invalidateOnRefresh: true,
                // pinReparent: true,
                // refreshPriority: 1
            }
        });

        const firstPanel = panels[0] as HTMLElement;

        const firstSectionTl = gsap.timeline({
            defaults: {
                duration: 0.3,
            },
            scrollTrigger: {
                trigger: firstPanel,
                start: 'top 10%',
                once: true,
                markers: true,
            },
            // scrollTrigger: {
            //     trigger: firstPanel,
            //     containerAnimation: horizontalTween,
            //     start: 'left center',
            //     end: 'right center',
            //     // toggleActions: 'play reverse play reverse',
            //     once: true,
            //     markers: true,
            // },
        });

        // Text Animation
        firstSectionTl
            .from(
                firstPanel.querySelectorAll('.header h3'),
                {
                    y: 80,
                    opacity: 0,
                    rotateX: 15,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.15,
                }
            )
            .from(
                firstPanel.querySelector('.content p'),
                {
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                },
                '-=0.4'
            );

        // Svg Animation
        firstSectionTl.from(
            firstPanel.querySelectorAll('.flower, .diamond, .timer, .circle'),
            {
                scale: 0,
                opacity: 0,
                rotate: -45,
                duration: 0.8,
                ease: 'back.out(1.7)',
                stagger: 0.15,
            },
            '-=0.3'
        );

        firstSectionTl.from(
            firstPanel.querySelector('.half-circle'),
            {
                y: 200,
                opacity: 0,
                scaleY: 0.3,
                transformOrigin: 'center bottom',
                duration: 1,
                ease: 'power4.out',
            },
            '-=0.6'
        )

            // Floating Animation
            .to(firstPanel.querySelectorAll('.flower, .diamond, .timer'), {
                y: 12,
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: 'sine.inOut',
                stagger: 0.5,
            });


        const secondPanel = panels[1] as HTMLElement;
        const title = secondPanel.querySelector('#second-panel-title') as HTMLElement;

        // const splitText = new SplitText(title, {
        //     type: 'chars',
        //     charsClass: 'char',
        // });

        // if (!splitText.chars.length) return;

        const secondSectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: secondPanel,
                containerAnimation: horizontalTween,
                start: 'left center',
                end: 'right center',
                once: true,
                markers: true,
            },
        });

        const splitText = new SplitText('.starter-text', {
            type: 'chars',
            charsClass: 'char',
        });


        secondSectionTl.from(title, {
            yPercent: 100,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.03,
        }).to(
            splitText.chars,
            {
                physics2D: {
                    velocity: () => gsap.utils.random(600, 1400),
                    angle: () => gsap.utils.random(0, 360),
                    gravity: 500,
                },
                rotation: () => gsap.utils.random(-720, 720),
                scale: () => gsap.utils.random(0.5, 1.2),
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: {
                    each: 0.02,
                    from: 'center',
                },
            },
            '-=0.2' // overlaps with previous animation
        );






    }, [])

    return (
        <>
            <section className='min-h-screen min-w-full'  >Scroll Down</section>
            <div className='panel-container flex items-center  '>
                <section className='panel min-h-screen min-w-full flex items-center justify-center bg-lime-50' >
                    <div className='relative h-full w-full bg-black text-white px-20 flex flex-col justify-end' >
                        <div className="header relative mt-50 text-3xl">
                            <h3 className='relative z-[1] bg-pink-200 text-black py-2 px-4 shadow-xl shadow-neutral-600 inline-block font-bold rounded-[8px]' >Animate Anything</h3>
                            <h3 className='absolute left-20 top-12 bg-orange-200 text-black py-2 px-4   inline-block font-bold rounded-[8px]' >That&apos;s right, Anything</h3>
                        </div>

                        <div className='flex items-center justify-center gap-20' >
                            <div className='content ' >
                                <p className='text-2xl ' >Whether you&apos;re animating UI, SVG or creating immersive WebGL experiences, GSAP has your back.</p>
                            </div>
                            <div className='images relative flex-2/3' >
                                <Image className='circle absolute top-1/4' src={'/circle.png'} alt='circle' width={100} height={100} />

                                {/* Flower */}
                                <svg
                                    width={248}
                                    height={248}
                                    viewBox="0 0 248 248"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    className="flower relative left-1/2 top-40 z-[2]"
                                    aria-hidden="true"
                                    style={{
                                        translate: "none",
                                        rotate: "none",
                                        scale: "none",
                                        transform: "translate(0px, 0px)",
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M62 124C27.7583 124 0 151.758 0 186C0 220.242 27.7583 248 62 248C96.2417 248 124 220.242 124 186C124 220.242 151.758 248 186 248C220.242 248 248 220.242 248 186C248 151.758 220.242 124 186 124C220.242 124 248 96.2417 248 62C248 27.7583 220.242 0 186 0C151.758 0 124 27.7583 124 62C124 27.7583 96.2417 0 62 0C27.7583 0 0 27.7583 0 62C0 96.2417 27.7583 124 62 124Z"
                                        fill="url(#paint0_radial_2080_56318)"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M62 124C27.7583 124 0 151.758 0 186C0 220.242 27.7583 248 62 248C96.2417 248 124 220.242 124 186C124 220.242 151.758 248 186 248C220.242 248 248 220.242 248 186C248 151.758 220.242 124 186 124C220.242 124 248 96.2417 248 62C248 27.7583 220.242 0 186 0C151.758 0 124 27.7583 124 62C124 27.7583 96.2417 0 62 0C27.7583 0 0 27.7583 0 62C0 96.2417 27.7583 124 62 124Z"
                                        fill="url(#paint1_radial_2080_56318)"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M62 124C27.7583 124 0 151.758 0 186C0 220.242 27.7583 248 62 248C96.2417 248 124 220.242 124 186C124 220.242 151.758 248 186 248C220.242 248 248 220.242 248 186C248 151.758 220.242 124 186 124C220.242 124 248 96.2417 248 62C248 27.7583 220.242 0 186 0C151.758 0 124 27.7583 124 62C124 27.7583 96.2417 0 62 0C27.7583 0 0 27.7583 0 62C0 96.2417 27.7583 124 62 124Z"
                                        fill="url(#pattern-home-animate-flower-0)"
                                        fillOpacity={0.6}
                                        style={{
                                            mixBlendMode: "multiply",
                                        }}
                                    />
                                    <defs>
                                        <pattern
                                            id="pattern-home-animate-flower-0"
                                            patternContentUnits="objectBoundingBox"
                                            width={0.403226}
                                            height={0.403226}
                                        >
                                            <use xlinkHref="#svg-noise" transform="scale(0.000806452)" />
                                        </pattern>
                                        <radialGradient
                                            id="paint0_radial_2080_56318"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(76.3114 176.859) rotate(-90) scale(194.26 195.353)"
                                        >
                                            <stop stopColor="#E193FF" />
                                            <stop offset={0.6721} stopColor="#8E78DA" />
                                            <stop offset={0.7378} stopColor="#937DDB" />
                                            <stop offset={0.8164} stopColor="#A28BDD" />
                                            <stop offset={0.9014} stopColor="#BAA3E2" />
                                            <stop offset={0.9905} stopColor="#DBC3E7" />
                                            <stop offset={1} stopColor="#DFC7E8" />
                                        </radialGradient>
                                        <radialGradient
                                            id="paint1_radial_2080_56318"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(-27 234) rotate(-68.2758) scale(275.572 434.122)"
                                        >
                                            <stop stopColor="#FFE2F2" />
                                            <stop offset={0.609375} stopColor="#FFADDA" />
                                            <stop offset={0.776042} stopColor="#FF7CC5" />
                                            <stop offset={0.911458} stopColor="#FF71BF" />
                                            <stop offset={1} stopColor="#F84FAC" />
                                        </radialGradient>
                                    </defs>
                                </svg>

                                {/* dimond */}
                                <svg
                                    width={60}
                                    height={60}
                                    viewBox="0 0 60 60"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    className="diamond absolute right-0 top-40"
                                    aria-hidden="true"
                                    style={{
                                        translate: "none",
                                        rotate: "none",
                                        scale: "none",
                                        transform: "translate(0px, 0px)",
                                    }}
                                >
                                    <path
                                        d="M27.1716 1.82843C28.7337 0.266333 31.2663 0.26633 32.8284 1.82843L58.1716 27.1716C59.7337 28.7337 59.7337 31.2663 58.1716 32.8284L32.8284 58.1716C31.2663 59.7337 28.7337 59.7337 27.1716 58.1716L1.82843 32.8284C0.266333 31.2663 0.26633 28.7337 1.82843 27.1716L27.1716 1.82843Z"
                                        fill="url(#paint0_linear_2080_57095)"
                                    />
                                    <path
                                        d="M27.1716 1.82843C28.7337 0.266333 31.2663 0.26633 32.8284 1.82843L58.1716 27.1716C59.7337 28.7337 59.7337 31.2663 58.1716 32.8284L32.8284 58.1716C31.2663 59.7337 28.7337 59.7337 27.1716 58.1716L1.82843 32.8284C0.266333 31.2663 0.26633 28.7337 1.82843 27.1716L27.1716 1.82843Z"
                                        fill="url(#pattern-home-animate-diamond-0)"
                                        fillOpacity={0.6}
                                        style={{
                                            mixBlendMode: "multiply",
                                        }}
                                    />
                                    <defs>
                                        <pattern
                                            id="pattern-home-animate-diamond-0"
                                            patternContentUnits="objectBoundingBox"
                                            width={3.22581}
                                            height={3.22581}
                                        >
                                            <use xlinkHref="#svg-noise" transform="scale(0.00645161)" />
                                        </pattern>
                                        <linearGradient
                                            id="paint0_linear_2080_57095"
                                            x1={-35.7015}
                                            y1={-8.17164}
                                            x2={74.4179}
                                            y2={35.0896}
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset={0.427083} stopColor="#FF8709" />
                                            <stop offset={0.791667} stopColor="#F7BDF8" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Timer */}
                                <svg
                                    width={52}
                                    height={62}
                                    viewBox="0 0 52 62"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    className="timer"
                                    aria-hidden="true"
                                    style={{
                                        translate: "none",
                                        rotate: "none",
                                        scale: "none",
                                        transform: "translate(0px, 0px)",
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M29.2532 28.1943C27.7212 29.751 27.7212 32.249 29.2532 33.8057L50.3023 55.1943C52.7911 57.7232 50.9996 62 47.4513 62H26H4.54865C1.00044 62 -0.79113 57.7232 1.69768 55.1943L22.7468 33.8057C24.2788 32.249 24.2788 29.7511 22.7468 28.1943L1.69769 6.80572C-0.791119 4.27676 1.00044 5.24575e-07 4.54865 8.34769e-07L26 2.71011e-06L47.4514 4.58544e-06C50.9996 4.89564e-06 52.7911 4.27676 50.3023 6.80572L29.2532 28.1943Z"
                                        fill="url(#paint0_linear_2080_57096)"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M29.2532 28.1943C27.7212 29.751 27.7212 32.249 29.2532 33.8057L50.3023 55.1943C52.7911 57.7232 50.9996 62 47.4513 62H26H4.54865C1.00044 62 -0.79113 57.7232 1.69768 55.1943L22.7468 33.8057C24.2788 32.249 24.2788 29.7511 22.7468 28.1943L1.69769 6.80572C-0.791119 4.27676 1.00044 5.24575e-07 4.54865 8.34769e-07L26 2.71011e-06L47.4514 4.58544e-06C50.9996 4.89564e-06 52.7911 4.27676 50.3023 6.80572L29.2532 28.1943Z"
                                        fill="url(#pattern-home-animate-timer-0)"
                                    />
                                    <defs>
                                        <pattern
                                            id="pattern-home-animate-timer-0"
                                            patternContentUnits="objectBoundingBox"
                                            width={8.06452}
                                            height={8.06452}
                                        >
                                            <use xlinkHref="#svg-noise" transform="scale(0.016129)" />
                                        </pattern>
                                        <linearGradient
                                            id="paint0_linear_2080_57096"
                                            x1={-7.77612}
                                            y1={17.8134}
                                            x2={63.2463}
                                            y2={31}
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset={0.0242443} stopColor="#EDBEFF" />
                                            <stop offset={0.84375} stopColor="#8E78DA" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Half Circle */}
                                <svg
                                    width={496}
                                    height={248}
                                    viewBox="0 0 496 248"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    className="half-circle"
                                    aria-hidden="true"
                                    style={{
                                        translate: "none",
                                        rotate: "none",
                                        scale: "none",
                                        transform: "translate(0px, 0px)",
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M496 248C496 111.033 384.967 5.987e-06 248 0C111.033 -5.987e-06 5.987e-06 111.033 0 248L496 248Z"
                                        fill="url(#paint0_radial_2080_56314)"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M496 248C496 111.033 384.967 5.987e-06 248 0C111.033 -5.987e-06 5.987e-06 111.033 0 248L496 248Z"
                                        fill="url(#pattern-home-animate-half-circle-0)"
                                        fillOpacity={0.6}
                                        style={{
                                            mixBlendMode: "multiply",
                                        }}
                                    />
                                    <defs>
                                        <pattern
                                            id="pattern-home-animate-half-circle-0"
                                            patternContentUnits="objectBoundingBox"
                                            width={0.201613}
                                            height={0.403226}
                                        >
                                            <use
                                                xlinkHref="#svg-noise"
                                                transform="scale(0.000403226 0.000806452)"
                                            />
                                        </pattern>
                                        <radialGradient
                                            id="paint0_radial_2080_56314"
                                            cx={0}
                                            cy={0}
                                            r={1}
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(137.354 461.661) rotate(-54.9042) scale(517.614 425.925)"
                                        >
                                            <stop offset={0.380208} stopColor="#D1FFBC" />
                                            <stop offset={0.734375} stopColor="#0AE448" />
                                            <stop offset={1} stopColor="#0AA3E4" />
                                        </radialGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>

                </section>
                <section className='panel min-h-screen min-w-full flex flex-col gap-5 items-center justify-center bg-amber-50' >
                    <div className='relative bg-amber-200 w-full  flex items-center justify-start px-12' >
                        <h2 id="second-panel-title"
                            className="panel-title text-white text-6xl overflow-hidden"><span className='text-green-300 starter-text ' >Lorem ipsum dolor sit amet,</span> consectetur adipisicing elit. Numquam soluta minus aliquid unde animi velit nobis maiores modi, quaerat odit sed omnis dolores praesentium? Hic fugit harum repellat est saepe?</h2>
                    </div>
                </section>
                <section className='panel min-h-screen min-w-full flex items-center justify-center bg-red-50' >
                    <h2 className='font-bold text-2xl' >Section 3</h2>
                </section>
                {/* <section className='panel min-h-screen min-w-full flex items-center justify-center bg-blue-50' >
                    <h2 className='font-bold text-2xl' >Section 4</h2>
                </section>
                <section className='panel min-h-screen min-w-full flex items-center justify-center bg-green-50' >
                    <h2 className='font-bold text-2xl' >Section 5</h2>
                </section>
                <section className='panel min-h-screen min-w-full flex items-center justify-center bg-sky-50' >
                    <h2 className='font-bold text-2xl' >Section 6</h2>
                </section> */}
            </div>
            <section className='min-h-screen min-w-full'  >END OF THE SITE</section>
        </>
    )
}

export default Page