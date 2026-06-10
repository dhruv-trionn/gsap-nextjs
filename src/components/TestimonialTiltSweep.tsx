"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "The tilt and sweep transition is incredibly elegant. It feels like flipping through premium album covers in a spatial UI.",
    author: "Veronica B.",
    title: "SPATIAL ELEGANCE",
    image: "https://i.pravatar.cc/150?img=1",
    bgColor: "bg-gradient-to-br from-pink-200 to-rose-100",
  },
  {
    id: 2,
    content: "It's so dynamic yet it perfectly respects the strict boundaries of our static design layout. Truly best of both worlds.",
    author: "David M.",
    title: "RESPECTS BOUNDARIES",
    image: "https://i.pravatar.cc/150?img=11",
    bgColor: "bg-gradient-to-br from-violet-200 to-purple-100",
  },
  {
    id: 3,
    content: "The way the card leans into the turn before sweeping away adds such a profound layer of microscopic detail.",
    author: "Sarah T.",
    title: "MICROSCOPIC DETAIL",
    image: "https://i.pravatar.cc/150?img=5",
    bgColor: "bg-gradient-to-br from-blue-200 to-cyan-100",
  },
  {
    id: 4,
    content: "This is what separates basic websites from elite, award-winning digital experiences. It's fluid and absolutely flawless.",
    author: "Michael R.",
    title: "AWARD WINNING",
    image: "https://i.pravatar.cc/150?img=8",
    bgColor: "bg-gradient-to-br from-emerald-200 to-green-100",
  }
];

export default function TestimonialTiltSweep() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initial setup
    cardsRef.current.forEach((card, index) => {
      gsap.set(card, {
        x: 0,
        z: 0,
        rotationY: 0,
        opacity: index === currentIndex ? 1 : 0,
        zIndex: index === currentIndex ? 20 : 10,
        pointerEvents: index === currentIndex ? "auto" : "none"
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
        gsap.set(currentCard, { pointerEvents: "none" });
        gsap.set(nextCard, { pointerEvents: "auto" });
        setIsAnimating(false);
      }
    });

    // Ensure the new card sits on top during the transition
    gsap.set(currentCard, { zIndex: 10 });
    gsap.set(nextCard, { zIndex: 20 });

    if (direction === "next") {
      // CURRENT: Tilts left and sweeps out
      tl.to(currentCard, {
        x: -400,
        z: -200,
        rotationY: -25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut"
      }, 0);

      // NEXT: Tilts in from the right and snaps forward
      gsap.set(nextCard, { x: 400, z: -200, rotationY: 25, opacity: 0 });
      tl.to(nextCard, {
        x: 0,
        z: 0,
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut"
      }, 0.1); // slight overlap
    } else {
      // CURRENT: Tilts right and sweeps out
      tl.to(currentCard, {
        x: 400,
        z: -200,
        rotationY: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut"
      }, 0);

      // NEXT: Tilts in from the left and snaps forward
      gsap.set(nextCard, { x: -400, z: -200, rotationY: -25, opacity: 0 });
      tl.to(nextCard, {
        x: 0,
        z: 0,
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut"
      }, 0.1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center overflow-hidden">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          3D Tilt & Sweep
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Spatial elegance.
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center mt-12" style={{ perspective: "1200px" }}>
        
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

          {/* Cards Container with 3D Preserve */}
          <div className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
            {testimonials.map((testimonial, index) => {
              return (
                <div
                  key={testimonial.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 ${testimonial.bgColor}`}
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
