'use client';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import { useLayoutEffect, useRef } from 'react';

// Register the plugin
gsap.registerPlugin(Draggable);

const CircularSlider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 1. Context for easy cleanup
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>('.card');
      const total = cards.length;
      const radius = 290; // Distance from center
      const sliceAngle = (2 * Math.PI) / total; // Angle between cards in radians

      // 2. Initial Position: Place cards in a circle ONCE
      cards.forEach((card, i) => {
        const angle = i * sliceAngle;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        gsap.set(card, {
          left: 0,
          top: 0,
          x,
          y,
          xPercent: -50,
          yPercent: -50,
        });
      });

      // 3. Create the Draggable on the CONTAINER
      Draggable.create(containerRef.current, {
        type: 'rotation', // Spin the wheel
        inertia: true, 

        onDrag: updateCardOrientation,
        onThrowUpdate: updateCardOrientation, 
      });

      // Helper: Rotates cards opposite to the container so they stay upright
      function updateCardOrientation() {
        // 'this' refers to the Draggable instance
        const currentRotation = this.rotation;
        gsap.set('.card', { rotation: -currentRotation });
      }
    }, wrapperRef); // Scope to wrapper

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="h-screen w-full relative overflow-hidden bg-slate-900 flex items-center justify-center"
    >
      {/* ROTATING CONTAINER */}
      <div
        ref={containerRef}
        className="absolute  w-5 aspect-square rounded-full bg-red-100 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* CARDS */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="card absolute w-24 h-32 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-xl shadow-lg border border-white/20 flex flex-col items-center justify-center select-none"
          >
            <span className="text-white font-bold text-xl">{i + 1}</span>
            <div className="text-blue-200 text-xs mt-2">Item</div>
          </div>
        ))}
      </div>

      {/* Indicator Arrow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-white font-bold">▼</div>
    </div>
  );
};

export default CircularSlider;
