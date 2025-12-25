'use client';
import BlurTextReveal from '@/components/BlurTextReveal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const Page = () => {

    const [revelAnimation, setRevlAnimation] = useState(false);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: '.main-section',
            start: 'top top',
            onEnter: (() => setRevlAnimation(true)),
            onLeave: (() => setRevlAnimation(false)),
            markers: true,
            scrub: 1,
        })

    }, [])

    return (
        <>
            <section className='min-h-screen w-full flex items-center justify-center flex-col' >
                <BlurTextReveal
                    animationType='words'
                    text='Scroll Down'
                    className=' mt-12 tracking-wide text-component max-w-5xl text-6xl'
                    as={'h1'}
                />
            </section>
            <div className='min-h-screen w-full flex items-center justify-center flex-col main-section' >
                {
                    revelAnimation && (
                        <>
                            <BlurTextReveal
                                as="h1"
                                text={`next gen design and development agency.`}
                                animationType="chars"
                                stagger={0.008}
                                duration={1}
                                className="text-5xl font-bold uppercase max-w-[550px]"
                            />

                            <BlurTextReveal
                                as="p"
                                text="We build fast, interactive and visually stunning digital products."
                                animationType="words"
                                stagger={0.09}
                                className="text-lg text-black my-32 max-w-xl"
                            />

                            <BlurTextReveal
                                as="p"
                                text="Simon Dolsten is currently the most awarded Creative Director in the world according to both the One Show and Art Director’s Club. The Drum put him at #2. He’s working on that. He’s served as Creative Director and hands-on creative for clients like Anheuser-Busch, Spotify, Volkswagen and BMW, with an eye for business growth and creative excellence."
                                animationType="lines"
                                stagger={0.3}
                                className="text-2xl max-w-[600px]"
                                from='start'
                            />


                        </>
                    )
                }

            </div>
            <section className='min-h-screen w-full flex items-center justify-center flex-col' >Scroll Down</section>

        </>
    )
}

export default Page