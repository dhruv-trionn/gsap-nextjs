"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "The 3D coin-flip interaction is beautifully tactile. It feels like flipping a physical card on a premium table.",
    author: "Veronica B.",
    title: "TACTILE 3D FLIP",
    image: "https://i.pravatar.cc/150?img=1",
    bgColor: "bg-gradient-to-br from-indigo-200 to-cyan-100",
  },
  {
    id: 2,
    content: "The physics feel completely grounded. The slight lift towards the camera before the flip creates a stunning illusion of depth.",
    author: "David M.",
    title: "GROUNDED PHYSICS",
    image: "https://i.pravatar.cc/150?img=11",
    bgColor: "bg-gradient-to-br from-emerald-200 to-teal-100",
  },
  {
    id: 3,
    content: "Visually arresting while maintaining the clean, static layout we required. It's the perfect balance of form and function.",
    author: "Sarah T.",
    title: "PERFECT BALANCE",
    image: "https://i.pravatar.cc/150?img=5",
    bgColor: "bg-gradient-to-br from-fuchsia-200 to-rose-100",
  },
  {
    id: 4,
    content: "Flawless execution. The depth of field and authentic 3D transforms make this stand out from typical web carousels.",
    author: "Michael R.",
    title: "FLAWLESS EXECUTION",
    image: "https://i.pravatar.cc/150?img=8",
    bgColor: "bg-gradient-to-br from-amber-200 to-orange-100",
  }
];

export default function TestimonialFlip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndexState, setNextIndexState] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const animateTransition = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = direction === "next" 
      ? (currentIndex + 1) % testimonials.length 
      : (currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);

    // Set the back card to the upcoming testimonial
    setNextIndexState(nextIndex);

    const targetRotation = direction === "next" ? -180 : 180;

    const tl = gsap.timeline({
      onComplete: () => {
        // Once flip is done, swap the front card to the new active index
        setCurrentIndex(nextIndex);
        // Reset the rotation instantly so the front card is facing us again
        gsap.set(cardContainerRef.current, { rotationY: 0, scale: 1, z: 0, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" });
        setIsAnimating(false);
      }
    });

    // Animate the container: Lift up (scale/z), flip, and drop back down
    tl.to(cardContainerRef.current, {
      z: 150,
      scale: 1.05,
      boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
      duration: 0.4,
      ease: "power2.out"
    }, 0);

    tl.to(cardContainerRef.current, {
      rotationY: targetRotation,
      duration: 0.8,
      ease: "power3.inOut"
    }, 0.2);

    tl.to(cardContainerRef.current, {
      z: 0,
      scale: 1,
      boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
      duration: 0.4,
      ease: "power2.in"
    }, 0.6);
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial = testimonials[nextIndexState];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          The 3D Flip
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          A tactile flip.
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center mt-12" style={{ perspective: "1500px" }}>
        
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

          {/* 3D Flipping Container */}
          <div 
            ref={cardContainerRef}
            className="absolute top-0 left-0 w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* FRONT FACE */}
            <div 
              className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 border border-white/40 ${currentTestimonial.bgColor}`}
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-gray-600/80 mb-6 uppercase">
                    {currentTestimonial.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                    "{currentTestimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.author}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="font-medium text-gray-800">
                    {currentTestimonial.author}
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div 
              className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 border border-white/40 ${nextTestimonial.bgColor}`}
              style={{ 
                backfaceVisibility: "hidden", 
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)" // Flipped by default so it shows when parent flips
              }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-gray-600/80 mb-6 uppercase">
                    {nextTestimonial.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                    "{nextTestimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                    <img
                      src={nextTestimonial.image}
                      alt={nextTestimonial.author}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="font-medium text-gray-800">
                    {nextTestimonial.author}
                  </span>
                </div>
              </div>
            </div>

          </div>
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
