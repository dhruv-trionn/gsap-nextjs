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
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initial setup
    cardsRef.current.forEach((card, index) => {
      if (index === currentIndex) {
        gsap.set(card, {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          zIndex: 20,
          rotationX: 0,
          rotationZ: 0,
        });
      } else {
        gsap.set(card, {
          yPercent: 0,
          opacity: 0,
          scale: 0.6,
          zIndex: 10,
          rotationX: 0,
          rotationZ: 0,
        });
      }
    });
  }, []);

  const animateTransition = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    const prevIndex = currentIndex;
    let nextIndex;

    if (direction === "next") {
      nextIndex = (currentIndex + 1) % testimonials.length;
    } else {
      nextIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    }

    const currentCard = cardsRef.current[prevIndex];
    const nextCard = cardsRef.current[nextIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
        // Reset the old card completely behind
        gsap.set(currentCard, {
          yPercent: 0,
          opacity: 0,
          scale: 0.6,
          rotationX: 0,
          rotationZ: 0,
          zIndex: 10,
        });
      },
    });

    if (direction === "next") {
      // NEXT: New card comes from behind, loops up, and settles in middle.
      // Old card drops down and settles behind.
      gsap.set(nextCard, { zIndex: 30 }); // new card will end up on top
      gsap.set(currentCard, { zIndex: 20 });

      tl.to(nextCard, {
        keyframes: {
          "0%": { yPercent: 0, scale: 0.6, opacity: 0, rotationZ: -5 },
          "50%": { yPercent: -60, scale: 1.1, opacity: 1, rotationZ: 3, ease: "power2.out" },
          "100%": { yPercent: 0, scale: 1, opacity: 1, rotationZ: 0, ease: "power3.inOut" }
        },
        duration: 1.4,
      });

      tl.to(currentCard, {
        keyframes: {
          "0%": { yPercent: 0, scale: 1, opacity: 1, rotationZ: 0 },
          "50%": { yPercent: 40, scale: 0.8, opacity: 0.5, rotationZ: -3, ease: "power2.out" },
          "100%": { yPercent: 0, scale: 0.6, opacity: 0, rotationZ: 0, ease: "power3.inOut" }
        },
        duration: 1.4,
      }, "<");

    } else {
      // PREV: Old card loops up and settles behind.
      // New card comes from below and settles in middle.
      gsap.set(currentCard, { zIndex: 30 }); // old card starts on top, arcs over
      gsap.set(nextCard, { zIndex: 20 });

      tl.to(currentCard, {
        keyframes: {
          "0%": { yPercent: 0, scale: 1, opacity: 1, rotationZ: 0 },
          "50%": { yPercent: -60, scale: 1.1, opacity: 1, rotationZ: -3, ease: "power2.out" },
          "100%": { yPercent: 0, scale: 0.6, opacity: 0, rotationZ: 0, ease: "power3.inOut" }
        },
        duration: 1.4,
      });

      tl.to(nextCard, {
        keyframes: {
          "0%": { yPercent: 0, scale: 0.6, opacity: 0, rotationZ: 5 },
          "50%": { yPercent: 40, scale: 0.8, opacity: 0.5, rotationZ: 3, ease: "power2.out" },
          "100%": { yPercent: 0, scale: 1, opacity: 1, rotationZ: 0, ease: "power3.inOut" }
        },
        duration: 1.4,
      }, "<");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          Testimonials
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Every captain needs a strong first mate.
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center mt-12">
        <button
          onClick={() => animateTransition("prev")}
          disabled={isAnimating}
          className="absolute left-0 md:left-4 z-50 p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* 1000px perspective gives that nice 3D pop when rotationX is applied */}
        <div className="relative w-full max-w-4xl h-[400px] sm:h-[350px] md:h-[300px] mx-16" style={{ perspective: "1200px" }}>

          {/* Static Background Shadow Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[90%] bg-gray-100/80 rounded-[2.5rem] shadow-inner z-0 border border-gray-200"></div>

          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.15)] ${testimonial.bgColor} ${index === currentIndex ? "pointer-events-auto" : "pointer-events-none"
                }`}
              style={{
                willChange: "transform, opacity",
                transformStyle: "preserve-3d", // helps with nested 3D elements if any
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
          ))}
        </div>

        <button
          onClick={() => animateTransition("next")}
          disabled={isAnimating}
          className="absolute right-0 md:right-4 z-50 p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
