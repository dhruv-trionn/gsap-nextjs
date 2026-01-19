'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface PixelatedImageProps extends Omit<ImageProps, 'onLoad' | 'className'> {
  containerClassName?: string;
}

const PixelatedImage: React.FC<PixelatedImageProps> = ({ 
  src, 
  alt, 
  containerClassName,
  ...props 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  
  // 1. EXACT CONFIG FROM CODROPS
  // These are the discrete steps the animation will jump to.
  // It effectively skips values 5-99, preventing the "jitter".
  const pxFactorValues = [1, 2, 4, 9, 12, 18, 100]; 
  
  // This ref tracks the current step in the animation
  const pxIndexRef = useRef(0);

  // 2. THE RENDER LOGIC
  // Replicates the logic from the class method `render()`
  const render = useCallback((factor: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx || !containerRef.current || !sourceImage) return;

    // Get Container Size
    const offsetWidth = containerRef.current.offsetWidth;
    const offsetHeight = containerRef.current.offsetHeight;

    // Setup High DPI (Retina)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = offsetWidth * dpr;
    canvas.height = offsetHeight * dpr;

    // Logic from Codrops: increase a bit to avoid gaps
    const w = canvas.width;
    const h = canvas.height;
    
    // Calculate aspect ratio handling (Cover logic)
    // We manually implement "object-fit: cover" for the canvas draw
    const imgRatio = sourceImage.width / sourceImage.height;
    const canvasRatio = w / h;

    let newWidth = w;
    let newHeight = h;
    let newX = 0;
    let newY = 0;

    if (canvasRatio > imgRatio) {
      newHeight = Math.round(w / imgRatio);
      // Center Y
      newY = (h - newHeight) / 2;
    } else {
      newWidth = Math.round(h * imgRatio);
      // Center X
      newX = (w - newWidth) / 2;
    }

    // Calculate the size factor (1 to 100 mapped to 0.01 to 1.0)
    const size = factor * 0.01;

    // Turn off smoothing for pixelation, turn ON for final frame (100)
    const isFullRes = size === 1;
    ctx.imageSmoothingEnabled = isFullRes; 

    // Clear
    ctx.clearRect(0, 0, w, h);

    // 1. Draw tiny image (pixelate)
    // We draw the source at the small size
    ctx.drawImage(sourceImage, 0, 0, w * size, h * size);

    // 2. Draw it back huge
    // This stretches the pixels
    ctx.drawImage(
      canvas, 
      0, 0, w * size, h * size, // Source (tiny)
      newX, newY, newWidth, newHeight // Dest (screen size with object-fit)
    );
  }, [sourceImage]);


  useGSAP(() => {
    if (!sourceImage || !containerRef.current) return;

    // Initial render at the first step (Index 0 => Value 1 => 1% size)
    render(pxFactorValues[0]);

    // 3. THE ANIMATION LOOP
    // Replicates the `animatePixels` recursive setTimeout logic
    const animatePixels = () => {
      const currentIndex = pxIndexRef.current;
      
      // Stop if we reached the end of the array
      if (currentIndex >= pxFactorValues.length) return;

      // 1. Render the current step
      render(pxFactorValues[currentIndex]);

      // 2. Determine delay (First step is long 300ms, others fast 80ms)
      const timeOutDuration = currentIndex === 0 ? 300 : 80;

      // 3. Queue next step
      setTimeout(() => {
        pxIndexRef.current++;
        animatePixels();
      }, timeOutDuration);
    };

    // 4. TRIGGER
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top+=20% center', // When top of element is 20% past the bottom of viewport
      once: true, // Only run once
      markers: true,
      scrub: true,
      onEnter: () => {
        // Start the recursive loop
        pxIndexRef.current = 0; 
        animatePixels();
      }
    });

    // Optional: Handle resize
    const handleResize = () => {
       // Re-render at current index to keep image sharp on resize
       render(pxFactorValues[pxIndexRef.current]);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, { 
    scope: containerRef, 
    dependencies: [sourceImage, render] 
  });

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${containerClassName}`}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Invisible Source Image */}
      <Image
        src={src}
        alt={alt}
        fill
        onLoad={(e) => setSourceImage(e.currentTarget)}
        className="object-cover invisible"
        {...props}
      />
    </div>
  );
};

export default PixelatedImage;