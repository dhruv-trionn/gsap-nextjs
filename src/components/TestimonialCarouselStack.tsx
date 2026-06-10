"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "I will only use Loot in the future for any financial needs my business might have and saying goodbye to everyone else!",
    author: "Veronica B.",
    title: "I WILL ONLY USE LOOT",
    image: "https://i.pravatar.cc/150?img=1",
    bgColor: "bg-gradient-to-br from-green-200 to-yellow-100",
  },
  {
    id: 2,
    content: "This product completely transformed how we manage our day-to-day operations. The speed and efficiency are simply unmatched.",
    author: "David M.",
    title: "ABSOLUTELY INCREDIBLE",
    image: "https://i.pravatar.cc/150?img=11",
    bgColor: "bg-gradient-to-br from-blue-200 to-indigo-100",
  },
  {
    id: 3,
    content: "I was skeptical at first, but after just one week, I realized this was the missing piece to our puzzle. Highly recommended!",
    author: "Sarah T.",
    title: "GAME CHANGER FOR US",
    image: "https://i.pravatar.cc/150?img=5",
    bgColor: "bg-gradient-to-br from-purple-200 to-pink-100",
  },
  {
    id: 4,
    content: "The easiest and most intuitive platform I have ever used. It has saved us countless hours of manual work.",
    author: "Michael R.",
    title: "TIME SAVER",
    image: "https://i.pravatar.cc/150?img=8",
    bgColor: "bg-gradient-to-br from-orange-200 to-red-100",
  }
];

export default function TestimonialCarouselStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const getCardStyle = (offset: number) => {
    // offset 0 = active, 1 = behind 1, 2 = behind 2, 3 = behind 3
    const y = -35 * offset;
    const z = -50 * offset; // Actual 3D depth
    const scale = 1 - 0.04 * offset;
    const zIndex = 50 - offset;
    const opacity = offset === 0 ? 1 : Math.max(0, 1 - 0.2 * offset);
    const blur = offset === 0 ? 0 : offset * 2.5; // Depth of field blur
    return { y, z, scale, zIndex, opacity, blur };
  };

  useEffect(() => {
    // Initial setup
    cardsRef.current.forEach((card, index) => {
      const offset = (index - currentIndex + testimonials.length) % testimonials.length;
      const { y, z, scale, zIndex, opacity, blur } = getCardStyle(offset);
      
      gsap.set(card, {
        x: 0,
        y,
        z,
        scale,
        zIndex,
        opacity,
        filter: `blur(${blur}px)`,
        boxShadow: offset === 0 ? "0 20px 50px rgba(0,0,0,0.15)" : "0 10px 30px rgba(0,0,0,0.05)",
      });
    });
  }, [currentIndex]);

  const animateTransition = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    let nextIndex;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % testimonials.length;
    } else {
      nextIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
      },
    });

    testimonials.forEach((_, index) => {
      const card = cardsRef.current[index];
      const currentOffset = (index - currentIndex + testimonials.length) % testimonials.length;
      const nextOffset = (index - nextIndex + testimonials.length) % testimonials.length;
      
      const { y: targetY, z: targetZ, scale: targetScale, zIndex: targetZIndex, opacity: targetOpacity, blur: targetBlur } = getCardStyle(nextOffset);
      const isTargetActive = nextOffset === 0;

      if (direction === "next" && currentOffset === 0) {
        // Active card moves to the back (dives down deeply, then slots behind)
        // Step 1: Dive down
        tl.to(card, {
          y: 250, z: 100, scale: 1.05, filter: "blur(0px)", opacity: 0.4, zIndex: 60, boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
          duration: 0.7,
          ease: "power2.in"
        }, 0);
        // Step 2: Swoop back up into the rear of stack
        tl.to(card, {
          y: targetY, z: targetZ, scale: targetScale, filter: `blur(${targetBlur}px)`, opacity: targetOpacity, zIndex: targetZIndex, boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          duration: 0.7,
          ease: "power2.out"
        }, 0.7);
      } else if (direction === "prev" && currentOffset === testimonials.length - 1) {
        // Back card moves to the front (Springs up high, flies forward, then locks down into front)
        // Step 1: Swoop up
        tl.to(card, {
          y: -250, z: 100, scale: 1.05, filter: "blur(0px)", opacity: 1, zIndex: 60, boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
          duration: 0.7,
          ease: "power2.in"
        }, 0);
        // Step 2: Lock down into front
        tl.to(card, {
          y: targetY, z: targetZ, scale: targetScale, filter: `blur(${targetBlur}px)`, opacity: targetOpacity, zIndex: targetZIndex, boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          duration: 0.7,
          ease: "power2.out"
        }, 0.7);
      } else {
        // Other cards shuffle vertically with a smooth, continuous flow
        tl.to(card, {
          y: targetY,
          z: targetZ,
          scale: targetScale,
          zIndex: targetZIndex,
          opacity: targetOpacity,
          filter: `blur(${targetBlur}px)`,
          boxShadow: isTargetActive ? "0 20px 50px rgba(0,0,0,0.15)" : "0 10px 30px rgba(0,0,0,0.05)",
          duration: 1.4,
          ease: "power3.inOut"
        }, 0);
      }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          Carousel Stack
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          A seamless cycle of excellence.
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center mt-12">
        <button
          onClick={() => animateTransition("prev")}
          disabled={isAnimating}
          className="absolute left-0 md:left-4 z-[100] p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="relative w-full max-w-4xl h-[400px] sm:h-[350px] md:h-[300px] mx-16">
          {testimonials.map((testimonial, index) => {
            const isFront = index === currentIndex;
            return (
              <div
                key={testimonial.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 ${testimonial.bgColor} ${
                  isFront ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider text-gray-600/80 mb-6 uppercase">
                      {testimonial.title}
                    </h3>
                    <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-medium text-gray-800">
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => animateTransition("next")}
          disabled={isAnimating}
          className="absolute right-0 md:right-4 z-[100] p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
