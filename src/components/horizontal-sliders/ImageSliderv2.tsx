'use client';

import { forwardRef } from 'react';
import Image from 'next/image';

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
    {
        title: 'Test 4',
        content: 'We create beautiful and functional digital experiences.',
        image: 'https://picsum.photos/id/1015/1920/1080',
    },
    {
        title: 'Test 5',
        content: 'Modern solutions for modern businesses.',
        image: 'https://picsum.photos/id/1016/1920/1080',
    },
    {
        title: 'Test 6',
        content: 'Clean, minimal and user-friendly interfaces.',
        image: 'https://picsum.photos/id/1018/1920/1080',
    },
    {
        title: 'Test 7',
        content: 'Clean, minimal and user-friendly interfaces.',
        image: 'https://picsum.photos/id/1018/1920/1080',
    },
    {
        title: 'Test 8',
        content: 'Clean, minimal and user-friendly interfaces.',
        image: 'https://picsum.photos/id/1018/1920/1080',
    },
];

const ImageSliderv2 = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div className="w-screen overflow-hidden">
            {/* Slider Track */}
            <div
                ref={ref}
                className="flex w-max h-full gap-12 px-12"
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-[500px] h-[500px] rounded-full overflow-hidden flex flex-col items-center justify-center"
                    >
                        {/* Background Image */}
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority
                            className="object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center px-16 max-w-3xl">
                            <h2 className="text-white text-7xl font-bold mb-6">
                                {slide.title}
                            </h2>
                            <p className="text-white text-xl leading-relaxed">
                                {slide.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

ImageSliderv2.displayName = 'ImageSliderv2';

export default ImageSliderv2;
