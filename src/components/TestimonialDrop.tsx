"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "The gravity drop is incredibly satisfying. The bouncy physics make the interaction feel lively, energetic, and highly polished.",
    author: "Veronica B.",
    title: "SATISFYING PHYSICS",
    image: "https://i.pravatar.cc/150?img=1",
    bgColor: "bg-gradient-to-br from-purple-200 to-indigo-100",
  },
  {
    id: 2,
    content: "We needed something punchy that didn't break our strict visual layout. This vertical drop hits the exact sweet spot.",
    author: "David M.",
    title: "PUNCHY & POLISHED",
    image: "https://i.pravatar.cc/150?img=11",
    bgColor: "bg-gradient-to-br from-red-200 to-orange-100",
  },
  {
    id: 3,
    content: "The anticipation and overshoot create a fantastic sense of weight. It feels like real objects falling into place.",
    author: "Sarah T.",
    title: "REAL WEIGHT",
    image: "https://i.pravatar.cc/150?img=5",
    bgColor: "bg-gradient-to-br from-green-200 to-lime-100",
  },
  {
    id: 4,
    content: "Our users love the snappy response. It perfectly maintains the clean aesthetic while delivering a top-tier interaction.",
    author: "Michael R.",
    title: "SNAPPY RESPONSE",
    image: "https://i.pravatar.cc/150?img=8",
    bgColor: "bg-gradient-to-br from-sky-200 to-blue-100",
  }
];

export default function TestimonialDrop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initial setup
    cardsRef.current.forEach((card, index) => {
      gsap.set(card, {
        y: index === currentIndex ? 0 : -1000,
        opacity: index === currentIndex ? 1 : 0,
        zIndex: index === currentIndex ? 20 : 10,
        scale: index === currentIndex ? 1 : 0.8,
      });
    });
  }, []);

  const animateTransition = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = direction === "next" 
      ? (currentIndex + 1) % testimonials.length 
      : (currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);

    const currentCard = cardsRef.current[currentIndex];
    const nextCard = cardsRef.current[nextIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
      }
    });

    if (direction === "next") {
      // CURRENT CARD: Unhinges and drops down out of view
      tl.to(currentCard, {
        y: 800,
        opacity: 0,
        rotationZ: -5, // Adds a slight unhinged tilt
        scale: 0.9,
        duration: 0.6,
        ease: "power3.in",
        zIndex: 10
      }, 0);

      // NEXT CARD: Set it high up, then drop and bounce in
      gsap.set(nextCard, { y: -800, opacity: 1, rotationZ: 5, scale: 0.9, zIndex: 20 });
      tl.to(nextCard, {
        y: 0,
        rotationZ: 0,
        scale: 1,
        duration: 1.0,
        ease: "bounce.out" // The signature bouncy gravity ease
      }, 0.2); // slight delay so old card falls first
    } else {
      // CURRENT CARD: Shoots up out of view
      tl.to(currentCard, {
        y: -800,
        opacity: 0,
        rotationZ: 5,
        scale: 0.9,
        duration: 0.6,
        ease: "power3.in",
        zIndex: 10
      }, 0);

      // NEXT CARD: Set it below, then shoot up and bounce
      gsap.set(nextCard, { y: 800, opacity: 1, rotationZ: -5, scale: 0.9, zIndex: 20 });
      tl.to(nextCard, {
        y: 0,
        rotationZ: 0,
        scale: 1,
        duration: 1.0,
        ease: "bounce.out"
      }, 0.2);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          The Gravity Drop
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Weighty physics.
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center mt-12 overflow-hidden py-16 -my-16">
        
        <button
          onClick={() => animateTransition("prev")}
          disabled={isAnimating}
          className="absolute left-0 md:left-4 z-50 p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="relative w-full max-w-4xl h-[400px] sm:h-[350px] md:h-[300px] mx-16">
          
          {/* Static Background Shadow Card (Exactly as in original design) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[90%] bg-gray-100/80 rounded-[2.5rem] shadow-inner z-0 border border-gray-200"></div>

          {testimonials.map((testimonial, index) => {
            return (
              <div
                key={testimonial.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 ${testimonial.bgColor} ${
                  index === currentIndex ? "pointer-events-auto" : "pointer-events-none"
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
          className="absolute right-0 md:right-4 z-50 p-4 bg-gray-50/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all disabled:opacity-50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
