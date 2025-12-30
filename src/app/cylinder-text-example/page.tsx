'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CylinderPinPage = () => {
  const wheelRef = useRef(null);
  const containerRef = useRef(null);

  // Updated data based on your second image
  const awards = [
    { title: "GSAP", label: "Website of the day — (2X)" },
    { title: "CSSDA", label: "Website of the day — (2X)" },
    { title: "Orpetron", label: "Website of the day — (2X)" },
    { title: "Awwwards", label: "Website of the day — (2X)" },
    { title: "The FWA", label: "Website of the day — (2X)" },
    { title: "A Design Awards", label: "Website of the day — (2X)" },
    { title: "Landing.Love", label: "Website of the day — (2X)" },
    { title: "CSS Winner", label: "Website of the day — (2X)" },
    { title: "CSS Nectar", label: "Website of the day — (2X)" },
    { title: "Codrops", label: "Website of the day — (2X)" },
  ];

  useEffect(() => {
    const wheel = wheelRef.current;
    const container = containerRef.current;
    
    const totalItems = awards.length;
    const angleStep = 360 / totalItems; 
    const radius = 350; // Adjusted for better viewing of list items

    const items = gsap.utils.toArray('.wheel-item');
    
    items.forEach((item, index) => {
      const angle = index * angleStep;
      gsap.set(item, {
        rotateX: angle,
        z: radius,
        transformOrigin: `50% 50% -${radius}px`
      });
    });

    gsap.to(wheel, {
      rotateX: 360,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "center center",
        end: "+=2500", // Length of the scroll
        pin: true,
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#1a1a1a] text-white">
      <div className='h-screen flex items-center justify-center bg-zinc-900'>
        <p className='text-gray-500'>Scroll to see Awards</p>
      </div>

      <div ref={containerRef} className='h-screen flex items-center justify-center overflow-hidden perspective-container perspective-[2000px]'>
        <div ref={wheelRef} className='relative preserve-3d w-full max-w-6xl h-[80px]' style={{transformStyle:'preserve-3d'}}>
          {awards.map((award, i) => (
            <div 
              key={i} 
              className='wheel-item absolute top-0 left-0 w-full h-full flex items-center backface-hidden border-b border-white/10 px-10'
            >
              {/* Left Side: Title */}
              <div className="flex-1">
                <h2 className='text-5xl font-medium tracking-tight opacity-50 hover:opacity-100 transition-opacity'>
                  {award.title}
                </h2>
              </div>

              {/* Right Side: Metadata */}
              <div className="text-right">
                <p className='text-sm uppercase tracking-widest text-gray-400'>
                  {award.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='h-screen bg-zinc-900' />
    </div>
  );
}

export default CylinderPinPage;