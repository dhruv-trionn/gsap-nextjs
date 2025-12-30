'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Cylinder3DProps {
  children: React.ReactNode;
  radius?: number; 
  scrollDuration?: string; 
  itemAngle?: number; 
  viewOffset?: number; 
}

const Cylinder3D: React.FC<Cylinder3DProps> = ({ 
  children, 
  radius = 450, 
  scrollDuration = "+=3000", 
  itemAngle = 18, 
  viewOffset = 60 // Increased offset so it starts completely out of view at bottom
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const items = React.Children.toArray(children);
  const count = items.length;

  useGSAP(() => {
    if (!cylinderRef.current || !containerRef.current) return;

    // --- LOGIC: Bottom to Top ---
    // 1. START: We want Item 0 to be at the bottom (invisible).
    //    A Positive rotation pushes the face DOWN.
    const startRotation = -viewOffset; 

    // 2. END: We want the Last Item to go up and exit the top.
    //    We need to rotate negatively enough to pull the whole list up.
    //    Formula: -(Total List Height) - (Buffer to clear top)
    const totalListAngle = (count - 1) * itemAngle;
    const endRotation = (totalListAngle + viewOffset);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: scrollDuration,    
        pin: true,
        scrub: 1,  
        markers: true,             
      },
    });

    // Animate from Positive (Bottom) to Negative (Top)
    tl.fromTo(cylinderRef.current, 
      { rotateX: startRotation },
      { 
        rotateX: endRotation,
        ease: 'none',
      }
    );

  }, { scope: containerRef, dependencies: [count, itemAngle, radius] });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: '2000px' }} 
    >
      <div
        ref={cylinderRef}
        className="relative w-full preserve-3d flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((child, index) => {
          // Standard ordering: Item 0 is top, Item 1 is below...
          const rotateX = index * -itemAngle;
          
          return (
            <div
              key={index}
              className="absolute w-full flex justify-center backface-hidden"
              style={{
                transform: `rotateX(${rotateX}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden' 
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cylinder3D;