"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import CursorTrails from "@/components/CursorTrails";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastSection = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const frameCount = 480;
            const images: HTMLImageElement[] = [];
            const canvas = canvasRef.current!;
            const context = canvas.getContext("2d")!;

            const getFrame = (index: number) =>
                `/frames/frame_${String(index).padStart(4, "0")}.jpg`;

            // ✅ Set canvas resolution to device pixel ratio
            const setCanvasSize = () => {
                const ratio = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * ratio;
                canvas.height = window.innerHeight * ratio;
                canvas.style.width = "100%";
                canvas.style.height = "100vh";
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
            };

            setCanvasSize();
            window.addEventListener("resize", setCanvasSize);

            // ✅ Preload images
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = getFrame(i + 1);
                images.push(img);
            }

            const playhead = { frame: 0 };

            const render = () => {
                const img = images[Math.round(playhead.frame)];
                if (!img || !img.complete) return;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
            };

            images[0].onload = () => {
                render();
                ScrollTrigger.refresh();
            };

            gsap.to(playhead, {
                frame: frameCount - 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    endTrigger: lastSection.current,
                    end: "top bottom",
                    scrub: true,
                    pin: true,
                    pinSpacing: false,
                    onUpdate: () => {
                        render();
                    },
                },
            });

            return () => {
                window.removeEventListener("resize", setCanvasSize);
            };
        },
        { scope: containerRef }
    );

    return (
        <>
          <CursorTrails />
            <section ref={containerRef} className="relative z-1">
                <canvas ref={canvasRef} className="block" />
            </section>

            <div className="relative z-2 min-h-screen text-white flex items-center justify-center">
                Page
            </div>

            <div className="relative z-2 min-h-screen text-white flex items-center justify-center">
                Page
            </div>
            <div ref={lastSection} className="min-h-screen text-white flex items-center justify-center">
                Page
            </div>
        </>
    );
};

export default Page;