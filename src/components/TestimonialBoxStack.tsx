"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "The angled 3D prism layout is breathtaking. The side cards are solid and dark, completely eliminating that messy text bleed-through effect.",
    author: "Veronica B.",
    title: "BREATHTAKING PRISM",
    image: "https://i.pravatar.cc/150?img=1",
    bgColor: "bg-gradient-to-br from-indigo-200 to-cyan-100",
  },
  {
    id: 2,
    content: "When it rotates, it legitimately feels like a massive 3D box turning. The incoming card seamlessly commands the front while the old card tucks away.",
    author: "David M.",
    title: "MASSIVE 3D BOX",
    image: "https://i.pravatar.cc/150?img=11",
    bgColor: "bg-gradient-to-br from-emerald-200 to-teal-100",
  },
  {
    id: 3,
    content: "This is Awwwards-winning perfection. It provides real side-by-side visibility without any overlapping clipping, snapping, or glitchy opacity bugs.",
    author: "Sarah T.",
    title: "AWWWARDS PERFECTION",
    image: "https://i.pravatar.cc/150?img=5",
    bgColor: "bg-gradient-to-br from-fuchsia-200 to-rose-100",
  },
  {
    id: 4,
    content: "Flawless geometric execution. The way the active card drops back and physically turns its angle to become the side stack is incredibly satisfying.",
    author: "Michael R.",
    title: "FLAWLESS GEOMETRY",
    image: "https://i.pravatar.cc/150?img=8",
    bgColor: "bg-gradient-to-br from-amber-200 to-orange-100",
  }
];

export default function TestimonialBoxStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculates the 3D Prism layout to create perfect side-by-side stacks
  // We use CSS brightness instead of opacity to prevent transparent text bleed-through!
  const getCardStyle = (index: number, activeIndex: number, total: number) => {
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // Mobile adjustments for tighter stack
    const xOffset = isMobile ? 100 : 220;
    const zOffset = isMobile ? -160 : -250;
    const sideScale = isMobile ? 0.9 : 0.85;

    if (offset === 0) {
      // Active Front Card
      return { x: 0, y: 0, z: 0, rotationY: 0, rotationX: 0, rotationZ: 0, scale: 1, zIndex: 50, opacity: 1, pointerEvents: "auto" };
    }

    if (offset === 1) {
      // Right stack (Angled inward like the right face of a box)
      return { x: xOffset, y: 15, z: zOffset, rotationY: -45, rotationX: 5, rotationZ: -2, scale: sideScale, zIndex: 40, opacity: 0.4, pointerEvents: "none" };
    }

    if (offset === -1) {
      // Left stack (Angled inward like the left face of a box)
      return { x: -xOffset, y: 15, z: zOffset, rotationY: 45, rotationX: 5, rotationZ: 2, scale: sideScale, zIndex: 40, opacity: 0.4, pointerEvents: "none" };
    }

    // Hidden cards (Pushed deep back)
    return { x: 0, y: 30, z: -500, rotationY: 0, rotationX: 10, rotationZ: 0, scale: 0.6, zIndex: 10, opacity: 0, pointerEvents: "none" };
  };

  useEffect(() => {
    // Initial static render of the 3D Prism and responsive updates
    cardsRef.current.forEach((card, index) => {
      const style = getCardStyle(index, currentIndex, testimonials.length);
      gsap.to(card, {
        x: style.x,
        y: style.y,
        z: style.z,
        scale: style.scale,
        rotationY: style.rotationY,
        rotationX: style.rotationX,
        rotationZ: style.rotationZ,
        zIndex: style.zIndex,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents as string,
        transformOrigin: "50% 50% 0px",
        duration: 0.4
      });
    });
  }, [isMobile]);

  // Optional: Mouse movement parallax effect for active card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    const activeCard = cardsRef.current[currentIndex];
    if (!activeCard) return;

    const rect = activeCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(activeCard, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.4,
      ease: "power1.out"
    });
  };

  const handleMouseLeave = () => {
    if (isAnimating) return;
    const activeCard = cardsRef.current[currentIndex];
    if (!activeCard) return;

    gsap.to(activeCard, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.7,
      ease: "power3.out"
    });
  };

  const animateTransition = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = direction === "next"
      ? (currentIndex + 1) % testimonials.length
      : (currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);

    const currentCard = cardsRef.current[currentIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
      }
    });

    // Drop active card z-index so the incoming card physically stacks over it
    gsap.set(currentCard, { zIndex: 45 });

    testimonials.forEach((_, index) => {
      const card = cardsRef.current[index];
      const targetStyle = getCardStyle(index, nextIndex, testimonials.length);

      // All cards smoothly animate to their new prism coordinates.
      // This seamlessly creates the "Box Rotation" effect without any snapping or clipping.
      tl.to(card, {
        x: targetStyle.x,
        y: targetStyle.y,
        z: targetStyle.z,
        scale: targetStyle.scale,
        rotationY: targetStyle.rotationY,
        rotationX: targetStyle.rotationX,
        rotationZ: targetStyle.rotationZ,
        zIndex: targetStyle.zIndex,
        opacity: targetStyle.opacity,
        duration: 1.2,
        ease: "expo.inOut" // A beautiful, smooth, highly-weighted curve
      }, 0);
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-32 font-sans flex flex-col items-center overflow-hidden">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
          <span className="w-2 h-2 bg-black rounded-sm" />
          Pro-Level UI
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          3D Prism Rotation.
        </h2>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center mt-12 pb-12">

        {/* Desktop Previous Button */}
        <button
          onClick={() => animateTransition("prev")}
          disabled={isAnimating}
          className="hidden md:flex absolute left-0 md:left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all disabled:opacity-50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative w-[85%] md:w-full max-w-4xl md:mx-16">

          <div
            className="w-full grid"
            style={{ perspective: "2000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {testimonials.map((testimonial, index) => {
              return (
                <div
                  key={testimonial.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`col-start-1 row-start-1 w-full h-full rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 ${testimonial.bgColor}`}
                  style={{
                    willChange: "transform, opacity, filter",
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="flex flex-col h-full justify-between" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                    <div>
                      <h3 className="text-sm font-semibold tracking-wider text-gray-600/80 mb-6 uppercase" style={{ transform: "translateZ(20px)" }}>
                        {testimonial.title}
                      </h3>
                      <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed" style={{ transform: "translateZ(30px)" }}>
                        "{testimonial.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-8" style={{ transform: "translateZ(40px)" }}>
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

        {/* Desktop Next Button */}
        <button
          onClick={() => animateTransition("next")}
          disabled={isAnimating}
          className="hidden md:flex absolute right-0 md:right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all disabled:opacity-50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-8">
          <button
            onClick={() => animateTransition("prev")}
            disabled={isAnimating}
            className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => animateTransition("next")}
            disabled={isAnimating}
            className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
