"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function page() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardImgRef = useRef<HTMLElement[] | []>([]);

  const sections = [
    {
      title: "Product Design",
      description: "We shape digital products through user-centric design.",
      image: "/image_part_001.jpg",
      services: [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "E-commerce Solutions",
        "Custom Software Development",
        "Maintenance & Support",
      ],
    },
    {
      title: "Website & Mobile Design",
      description: "Description for Service 2",
      image: "/image_part_002.jpg",
      services: [
        "Digital Marketing",
        "SEO Optimization",
        "Content Creation",
        "Social Media Management",
        "Email Marketing",
        "PPC Advertising",
      ],
    },
    {
      title: "Wordpress Development",
      description: "Description for Service 3",
      image: "/image_part_003.jpg",
      services: [
        "Cloud Services",
        "DevOps",
        "IT Consulting",
        "Cybersecurity",
        "Data Analytics",
        "AI & Machine Learning",
      ],
    },
    {
      title: "Web Development",
      description: "Description for Service 4",
      image: "/image_part_001.jpg",
      services: [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "E-commerce Solutions",
        "Custom Software Development",
        "Maintenance & Support",
      ],
    },
    {
      title: "AI & Intelligent Automation",
      description: "Description for Service 5",
      image: "/image_part_002.jpg",
      services: [
        "Digital Marketing",
        "SEO Optimization",
        "Content Creation",
        "Social Media Management",
        "Email Marketing",
        "PPC Advertising",
      ],
    },
    {
      title: "Digital Marketing",
      description: "Description for Service 6",
      image: "/image_part_003.jpg",
      services: [
        "Cloud Services",
        "DevOps",
        "IT Consulting",
        "Cybersecurity",
        "Data Analytics",
        "AI & Machine Learning",
      ],
    },
  ];

  useGSAP(
    () => {
      if (!cardImgRef.current) return;

      cardImgRef.current.forEach((card, index) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: () => {
              if (index === cardImgRef.current!.length - 1) {
                return "bottom bottom";
              } else {
                return `bottom top-=100`;
              }
            },
            pin: true,
            scrub: true,
            markers: true,
          },
        });
      });
    },
    {
      scope: sectionRef,
    },
  );

  ScrollTrigger.normalizeScroll(true);

  return (
    <div className="bg-white text-black">
      <section className="h-screen flex items-center justify-center">
        <h2 className="text-xl uppercase tracking-[0.5em] opacity-50">
          Scroll to Explore
        </h2>
      </section>
      <section
        ref={sectionRef}
        className="min-h-screen flex flex-col items-center justify-center p-8"
      >
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        {sections.map((section, index) => (
          <div
            key={index}
            className="max-w-20xl w-full mb-16 p-6 border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-end items-center md:items-start gap-12">
              <div
                ref={(self) => {
                  if (self && cardImgRef.current) {
                    cardImgRef.current[index] = self;
                  }
                }}
                className="w-full md:w-1/3 flex-none h-auto mb-4 md:mb-0"
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  width={1200}
                  height={800}
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                <p className="mb-4">{section.description}</p>
                <ul className="list-disc list-inside space-y-1">
                  {section.services.map((service, svcIndex) => (
                    <li className="text-sm" key={svcIndex}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="h-screen bg-white text-black flex items-center justify-center">
        <h2 className="text-4xl font-bold">Thank You for Visiting</h2>
      </section>
    </div>
  );
}
