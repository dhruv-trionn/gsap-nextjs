
import Marquee from '@/components/MarqueeV2'
import Image from 'next/image';
import React from 'react'

const Page = () => {

    const slides = [
        {
            title: 'Test 1',
            content: 'We create beautiful and functional digital experiences.',
            image: 'https://picsum.photos/id/1015/1920/1080',
        },
        {
            title: 'Test 2',
            content: 'Modern solutions for modern businesses.',
            image: 'https://picsum.photos/id/1016/1920/1080',
        },
        {
            title: 'Test 3',
            content: 'Clean, minimal and user-friendly interfaces.',
            image: 'https://picsum.photos/id/1018/1920/1080',
        },
    ];


    return (
        <>
            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
            <div className='min-h-screen bg-neutral-600 flex flex-col items-center justify-center'>
                <Marquee speed={5} className='mb-20' gap={40} defaultPaused stopSpeed={0.01}  >
                    <h2 className="text-7xl font-bold">Creative Studio</h2>
                </Marquee>

                <Marquee direction="right" speed={2} gap={40} draggable pauseOnHover>
                    <div className="flex gap-10">
                        {
                            slides.map((slide, i) => {
                                return (
                                    <Image src={slide.image} className='w-60' width={300} height={200} alt={slide.title} key={i} />
                                )
                            })
                        }
                    </div>
                </Marquee>

                <Marquee direction="left" speed={4} gap={40} className='mt-20' >
                    <div className="flex gap-10">
                        {
                            slides.map((slide, i) => {
                                return (
                                    <div key={i} className='bg-sky-50 h-[400px] w-[800px]' >
                                        <div className='max-h-[200px] overflow-hidden flex items-center justify-center' >
                                            <Image src={slide.image} className='w-full h-full object-cover' width={1024} height={1024} alt={slide.title} />
                                        </div>
                                        <div className='p-4' >
                                            <h3 className='my-6 text-3xl uppercase' >{slide.title}</h3>
                                            <p>{slide.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Marquee>
            </div>
            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
        </>
    )
}

export default Page