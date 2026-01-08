"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "@/components/MarqueeV2"; // Importing your existing component

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dummy Data for Awards
const awards = [
  { id: 1, title: "Awwwards", sub: "Site of the Day" },
  { id: 2, title: "CSS Design Awards", sub: "Website of the Day" },
  { id: 3, title: "CSS Winner", sub: "Star of the Week" },
  { id: 4, title: "FWA", sub: "FWA of the Day" },
  { id: 5, title: "Clutch", sub: "Top Developer 2024" },
  { id: 6, title: "Behance", sub: "Featured in Interaction" },
  { id: 7, title: "Dribbble", sub: "Trending Team" },
  { id: 8, title: "Awwwards", sub: "Honorable Mention" },
  { id: 9, title: "Webby Awards", sub: "Nominee" },
  { id: 10, title: "Lapa Ninja", sub: "Landing Page Feature" },
  { id: 11, title: "Godly Website", sub: "Top Tier Animation" },
  { id: 12, title: "Land Book", sub: "Site of the Day" },
  { id: 13, title: "Minimal Gallery", sub: "Featured" },
];

export default function AwardSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const awardsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Calculate dynamic heights
    const list = awardsListRef.current;
    if (!list) return;

    // We calculate how much we need to move the list up so the bottom touches the screen bottom.
    // Total Height of List - Height of Screen + some padding (e.g. 100px)
    const listHeight = list.scrollHeight;
    const windowHeight = window.innerHeight;
    
    // This is the specific pixel amount we need to translate the list upwards
    const scrollDistance = listHeight - windowHeight + 150;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => "+=" + (scrollDistance + 1500 ),
          scrub: 1, // Smooth scrubbing
          pin: true, // Pins the section
          markers: true,
        },
      });

      // --- PHASE 1: Expand the Circle Mask ---
      // We animate the clip-path from a small circle to a full circle (covering screen)
      tl.fromTo(
        videoContainerRef.current,
        {
          clipPath: "circle(20% at 50% 50%)", // Initial small circle
        },
        {
          clipPath: "circle(100% at 50% 50%)", // Full screen reveal
          duration: 3,
          ease: "sine.inOut",
        }
      );

      // --- PHASE 2: Move Marquee Up & Fade Out ---
      // As the circle finishes expanding, the marquee starts moving up
      tl.to(
        marqueeContainerRef.current,
        {
          y: -200, // Move up
          opacity: 0, // Fade out
          duration: 1,
          ease: "power1.in",
        },
        "-=0.5" // Start slightly before the mask animation ends for smoothness
      );

      // --- PHASE 3: Animate Awards List In ---
      // The awards container is initially pushed down via CSS (translate-y).
      // We animate it upwards to scroll through the list.
      tl.fromTo(
        awardsListRef.current,
        { y: "100vh", opacity: 0 },
        {
          y: "-20%", // Move it up enough to show the bottom of the list. Adjust based on content height.
          opacity: 1,
          duration: 4, // Longer duration allows for reading while scrolling
          ease: "none",
        }
      );
      
      // Optional: Stagger internal items if you want them to "fade in" individually
      // This grabs all list items and adds a slight internal float effect
      const items = gsap.utils.toArray(".award-item");
      tl.from(
        items,
        {
          y: 50,
          opacity: 0,
          stagger: 0.5, // Staggers the appearance of each item
          duration: 1,
        },
        "<+0.5" // Starts shortly after the container begins moving up
      );
      
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, []);

  return (
    <main className="w-full">
      {/* Spacer for normal scrolling before the section */}
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-black">Scroll Down</h1>
      </div>

      {/* --- PINNED SECTION --- */}
      <section
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-black text-white"
      >
        {/* 1. Background Video (Masked) */}
        {/* We apply the clip-path via GSAP, but set initial state here to avoid FOUC */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 z-0 h-full w-full"
          style={{ clipPath: "circle(20% at 50% 50%)" }} 
        >
          <video
            className="h-full w-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            // Replace with your actual video URL
            src="/banner-t.mp4"
          />
          {/* Overlay to darken video slightly for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* 2. Marquee Component (Centered) */}
        <div
          ref={marqueeContainerRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          {/* Using your component */}
          <Marquee gap={10}>
            <span className="flex flex-col items-center justify-center text-9xl mix-blend-difference">Awards + Recognition + Awards + Recognition + Awards + Recognition + Awards + Recognition</span>
          </Marquee>
        </div>

        {/* 3. Awards List (Initially Hidden below view) */}
        <div
          ref={awardsListRef}
          className="absolute left-0 top-0 z-20 flex w-full flex-col items-center justify-start pt-20"
        >
          <div className="flex w-full max-w-4xl flex-col gap-8 px-4 text-center">
            {awards.map((award, index) => (
              <div
                key={award.id}
                className="award-item flex w-full flex-col items-center justify-between border-b border-white/20 py-8 md:flex-row"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-gray-400">
                    {index + 1}.
                  </span>
                  <span className="text-4xl font-light tracking-wide md:text-6xl">
                    {award.title}
                  </span>
                </div>
                <span className="mt-2 text-sm uppercase tracking-widest text-gray-400 md:mt-0">
                  {award.sub}
                </span>
              </div>
            ))}
            
            {/* Footer Text at the end of list */}
            <div className="award-item mt-10 text-xl text-gray-500">
                Keep Scrolling for Next Section ↓
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for normal scrolling after the section */}
      <div className="h-screen w-full bg-white text-black flex items-center justify-center">
        <h2 className="text-3xl">Next Section Content</h2>
      </div>
    </main>
  );
}