"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image"; // 1. Import Next.js Image

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const clients = [
  {
    id: "luxury",
    name: "Luxury Presence",
    category: "Real Estate Marketing",
    logoUrl: "https://picsum.photos/id/287/300/300", 
    description: "Results matter most.",
  },
  {
    id: "credible",
    name: "Credible",
    category: "Loan Comparison",
    logoUrl: "https://picsum.photos/id/1001/300/300",
    description: "Partnerships built on trust.",
  },
  {
    id: "yellowtail",
    name: "Yellowtail",
    category: "Financial Tech",
    logoUrl: "https://picsum.photos/id/1025/300/300",
    description: "Crafting digital experiences.",
  },
  {
    id: "ockto",
    name: "Ockto",
    category: "Personal Data-Sharing",
    logoUrl: "https://picsum.photos/id/1026/300/300",
    description: "Secure data sharing platform.",
  },
  {
    id: "technis",
    name: "Technis",
    category: "Spatial Analytics",
    logoUrl: "https://picsum.photos/id/1027/300/300",
    description: "Smart flooring solutions.",
  },
  {
    id: "improvi",
    name: "Improvi",
    category: "Homeowner AI Assistant",
    logoUrl: "https://picsum.photos/id/1028/300/300",
    description: "AI for home improvement.",
  },
  {
    id: "reevents",
    name: "Re-events",
    category: "Sports Event Analytics",
    logoUrl: "https://picsum.photos/id/1029/300/300",
    description: "Analytics for major sports.",
  },
  {
    id: "myworker",
    name: "My Worker",
    category: "AI Sales Automation",
    logoUrl: "https://picsum.photos/id/1031/300/300",
    description: "Automating sales workflows.",
  },
];

export default function WorkScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".work-item");
      const logos = gsap.utils.toArray<HTMLElement>(".logo-item");

      // 1. PIN LEFT COLUMN
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: leftColRef.current,
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // 2. ANIMATE ITEMS
      items.forEach((item, index) => {
        const line = item.querySelector(".line-separator");
        const title = item.querySelector(".item-title");
        const category = item.querySelector(".item-category");

        ScrollTrigger.create({
          trigger: item,
          start: "top 50%", 
          end: "bottom 50%",
          
          onEnter: () => {
            updateActive(index);
            animateLine(line, title, category, true);
          },
          
          onEnterBack: () => {
             updateActive(index);
             animateLine(line, title, category, true);
          },

          onLeaveBack: () => {
            animateLine(line, title, category, false);
          },
        });
      });

      function updateActive(activeIndex: number) {
        gsap.to(logos, { opacity: 0, duration: 0.3, overwrite: true });
        gsap.to(logos[activeIndex], { opacity: 1, duration: 0.4, overwrite: true });
      }

      function animateLine(line: any, title: any, category: any, isActive: boolean) {
        if (isActive) {
          gsap.to(title, { color: "#000000", duration: 0.3 });
          gsap.to(category, { color: "#000000", duration: 0.3 });
          gsap.to(line, { width: "100%", duration: 0.8, ease: "power2.out" });
        } else {
          gsap.to(title, { color: "#9CA3AF", duration: 0.3 });
          gsap.to(category, { color: "#9CA3AF", duration: 0.3 });
          gsap.to(line, { width: "0%", duration: 0.4 });
        }
      }
    },
    { scope: containerRef }
  );

  return (
    <main className="w-full">
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-black">Scroll Down</h1>
      </div>

      <section ref={containerRef} className="relative w-full bg-white pt-20">
        <div className="mx-auto flex w-full max-w-[95%] flex-col lg:flex-row">
          
          {/* --- LEFT COLUMN --- */}
          <div 
            ref={leftColRef}
            className="hidden h-screen w-full lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-end lg:pr-24"
          >
            <div className="absolute top-32 left-0 w-64">
              <p className="text-xl font-medium leading-relaxed text-gray-500">
                Partnerships built on trust, craft, and results.
              </p>
            </div>

            {/* LOGO BOX */}
            <div className="relative flex aspect-square w-[22rem] items-center justify-center rounded-lg bg-[#F8F8F8]">
              {/* Padding controls max logo size relative to box */}
              <div className="relative h-full w-full p-12"> 
                {clients.map((client, index) => (
                  <div
                    key={client.id}
                    className={`logo-item absolute inset-0 flex items-center justify-center p-12 opacity-0 ${
                      index === 0 ? "opacity-100" : ""
                    }`}
                  >
                    {/* --- NEXT IMAGE IMPLEMENTATION ---
                      1. relative container (div)
                      2. Image with 'fill'
                      3. object-contain to preserve aspect ratio
                    */}
                    <div className="relative h-full w-full">
                      <Image
                        src={client.logoUrl}
                        alt={`${client.name} logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index === 0} // Load first image immediately
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div 
            ref={rightColRef}
            className="w-full lg:w-1/2 lg:pt-[25vh] lg:pl-12 pb-[50vh]"
          >
            <div className="flex flex-col">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="work-item relative flex w-full cursor-pointer flex-col py-16"
                >
                  <div className="flex w-full items-baseline justify-between">
                    <h2 className="item-title text-4xl font-normal text-gray-400 transition-colors md:text-5xl lg:text-5xl">
                      {client.name}
                    </h2>
                    <span className="item-category text-xs font-semibold uppercase tracking-widest text-gray-400 md:text-xs">
                      {client.category}
                    </span>
                  </div>

                  <div className="relative mt-12 h-[1px] w-full bg-gray-200">
                    <div className="line-separator absolute left-0 top-0 h-full w-0 bg-black" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      <div className="h-screen w-full bg-white text-black flex items-center justify-center">
        <h2 className="text-3xl">Next Section Content</h2>
      </div>
    </main>
  );
}