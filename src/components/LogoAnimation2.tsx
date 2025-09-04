"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Register GSAP plugins
gsap.registerPlugin(DrawSVGPlugin);

export default function TrionnLetterLoader() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Create timeline for infinite letter animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    // Set initial state - all letters invisible
    gsap.set(".trionn-letter", {
      drawSVG: "0%",
      stroke: "#FF008A",
      strokeWidth: 3,
      fill: "none",
      opacity: 0,
    });

    // Animate each letter sequentially with stagger
    tl
      // Phase 1: Draw letters one by one
      .to("#letter-t", {
        duration: 0.8,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      })
      .to("#letter-r", {
        duration: 0.8,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      .to("#letter-i", {
        duration: 0.6,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      .to("#letter-o", {
        duration: 0.8,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      .to("#letter-n1", {
        duration: 0.8,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      .to("#letter-n2", {
        duration: 0.8,
        drawSVG: "100%",
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      
      // Phase 2: Fill with gradient and add glow
      .to(".trionn-letter", {
        duration: 1.2,
        fill: "url(#letterGradient)",
        stroke: "#00E0FF",
        // filter: "drop-shadow(0 0 8px #00E0FF)",
        ease: "power2.inOut",
        stagger: 0.1,
      })
      
      // Phase 3: Pulse effect
      .to(".trionn-letter", {
        duration: 0.3,
        scale: 1.05,
        transformOrigin: "center",
        ease: "power2.out",
        stagger: {
          amount: 0.6,
          from: "start",
        }
      })
      .to(".trionn-letter", {
        duration: 0.3,
        scale: 1,
        ease: "power2.in",
        stagger: {
          amount: 0.6,
          from: "start",
        }
      })
      
      // Phase 4: Color wave effect
      .to("#letter-t", {
        duration: 0.4,
        stroke: "#FF6B35",
        fill: "url(#orangeGradient)",
        // filter: "drop-shadow(0 0 10px #FF6B35)",
        ease: "power2.inOut",
      })
      .to("#letter-r", {
        duration: 0.4,
        stroke: "#FFD60A",
        fill: "url(#yellowGradient)",
        // filter: "drop-shadow(0 0 10px #FFD60A)",
        ease: "power2.inOut",
      }, "-=0.2")
      .to("#letter-i", {
        duration: 0.4,
        stroke: "#06FFA5",
        fill: "url(#greenGradient)",
        // filter: "drop-shadow(0 0 10px #06FFA5)",
        ease: "power2.inOut",
      }, "-=0.2")
      .to("#letter-o", {
        duration: 0.4,
        stroke: "#9D4EDD",
        fill: "url(#purpleGradient)",
        // filter: "drop-shadow(0 0 10px #9D4EDD)",
        ease: "power2.inOut",
      }, "-=0.2")
      .to("#letter-n1", {
        duration: 0.4,
        stroke: "#FF006E",
        fill: "url(#pinkGradient)",
        // filter: "drop-shadow(0 0 10px #FF006E)",
        ease: "power2.inOut",
      }, "-=0.2")
      .to("#letter-n2", {
        duration: 0.4,
        stroke: "#00F5FF",
        fill: "url(#cyanGradient)",
        // filter: "drop-shadow(0 0 10px #00F5FF)",
        ease: "power2.inOut",
      }, "-=0.2")
      
      // Phase 5: Synchronized glow pulse
      .to(".trionn-letter", {
        duration: 0.8,
        // filter: "drop-shadow(0 0 20px currentColor)",
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      })
      
      // Phase 6: Fade out with stagger
      .to(".trionn-letter", {
        duration: 0.6,
        opacity: 0,
        drawSVG: "0%",
        scale: 0.8,
        ease: "power2.in",
        stagger: {
          amount: 0.8,
          from: "end",
        }
      })
      
      // Phase 7: Reset all properties
      .set(".trionn-letter", {
        stroke: "#FF008A",
        fill: "none",
        filter: "none",
        scale: 1,
      });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="text-center">
        {/* <h1 className="text-2xl font-bold mb-12 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
          Trionn Letter Loader
        </h1> */}
        
        <svg
          ref={containerRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 150 30"
          width="800"
          height="200"
          className="mx-auto"
        >
          <defs>
            {/* Gradient definitions for different colors */}
            <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF008A"/>
              <stop offset="100%" stopColor="#00E0FF"/>
            </linearGradient>
            
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35"/>
              <stop offset="100%" stopColor="#FFB347"/>
            </linearGradient>
            
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD60A"/>
              <stop offset="100%" stopColor="#FFF700"/>
            </linearGradient>
            
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06FFA5"/>
              <stop offset="100%" stopColor="#00FF88"/>
            </linearGradient>
            
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9D4EDD"/>
              <stop offset="100%" stopColor="#C77DFF"/>
            </linearGradient>
            
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF006E"/>
              <stop offset="100%" stopColor="#FF3399"/>
            </linearGradient>
            
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF"/>
              <stop offset="100%" stopColor="#0DBEDC"/>
            </linearGradient>
          </defs>

          {/* Letter T */}
          <path
            id="letter-t"
            className="trionn-letter"
            d="M0.053 1.604V3.181H4.287H8.522V15.591V28H10.247H11.972V15.591V3.181H16.233H20.494V1.604V0.027H10.273H0.053V1.604Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />

          {/* Letter R */}
          <path
            id="letter-r"
            className="trionn-letter"
            d="M25.669 14.014V28H27.421H29.172V15.587V3.175L32.871 3.196C36.384 3.215 36.594 3.222 37.066 3.324C39.055 3.756 40.225 4.572 40.919 6.011C41.276 6.752 41.409 7.340 41.443 8.331C41.503 10.081 41.079 11.342 40.089 12.363C39.250 13.227 38.226 13.727 36.700 14.018C36.356 14.084 35.814 14.109 34.308 14.128C33.237 14.141 32.361 14.163 32.361 14.176C32.361 14.219 33.968 16.621 37.814 22.323L41.640 27.995L43.747 27.998L45.854 28L45.519 27.522C45.335 27.259 43.753 24.961 42.005 22.416C40.256 19.871 38.711 17.627 38.572 17.430C38.433 17.233 38.337 17.056 38.359 17.038C38.381 17.019 38.646 16.940 38.948 16.862C41.367 16.237 43.182 14.857 44.187 12.880C44.474 12.315 44.786 11.354 44.916 10.631C45.053 9.868 45.103 8.288 45.016 7.464C44.603 3.547 42.295 1.026 38.425 0.265C37.272 0.039 36.913 0.027 31.149 0.027H25.669V14.014Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />

          {/* Letter I */}
          <path
            id="letter-i"
            className="trionn-letter"
            d="M51.024 14.014V28H52.776H54.527V14.014V0.027H52.776H51.024V14.014Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />

          {/* Letter O */}
          <path
            id="letter-o"
            className="trionn-letter"
            d="M74.819 3.545C76.618 3.723 78.202 4.274 79.673 5.234C82.873 7.322 84.689 10.941 84.425 14.698C84.159 18.467 81.913 21.775 78.496 23.428C77.002 24.151 75.533 24.484 73.835 24.484C71.820 24.484 69.955 23.965 68.240 22.926C64.931 20.924 62.944 17.080 63.247 13.271C63.409 11.229 64.031 9.531 65.243 7.821C65.689 7.193 66.948 5.949 67.597 5.496C69.768 3.982 72.307 3.296 74.819 3.545Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />

          {/* Letter N (first) */}
          <path
            id="letter-n1"
            className="trionn-letter"
            d="M93.161 14.014V28H94.886H96.611L96.624 16.948L96.638 5.896L96.963 6.335C97.142 6.577 98.458 8.403 99.887 10.394C102.655 14.250 104.487 16.801 106.647 19.805C107.383 20.828 109.008 23.091 110.258 24.832L112.530 27.998L114.295 27.999L116.059 28V27.636V27.272L114.560 25.167C112.306 22.003 110.021 18.804 105.021 11.816C102.460 8.238 102.227 7.911 98.946 3.323L96.589 0.027H94.875H93.161V14.014Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />

          {/* Letter N (second) */}
          <path
            id="letter-n2"
            className="trionn-letter"
            d="M112.609 8.36789V16.7087L113.531 17.9981C114.038 18.7073 114.809 19.7853 115.243 20.3937L116.033 21.4998L116.059 13.6978L116.085 5.89573L116.796 6.87814C117.187 7.41847 118.608 9.39622 119.956 11.2731C121.303 13.1501 123.04 15.5699 123.817 16.6506C124.593 17.7312 125.713 19.2901 126.305 20.1148C126.896 20.9396 128.413 23.0511 129.674 24.8072L131.968 28H133.738H135.507V27.6133V27.2267L134.863 26.3336C132.847 23.5402 130.447 20.1944 127.064 15.4613C125.315 13.0142 123.65 10.6869 122.089 8.50688C119.72 5.19744 116.314 0.432791 116.175 0.233775L116.033 0.0310354L114.321 0.0290724L112.609 0.0271063V8.36789ZM132.004 8.34048V16.6538L132.596 17.4795C132.921 17.9336 133.699 19.0206 134.325 19.8951C134.95 20.7696 135.472 21.4851 135.484 21.4851C135.497 21.4851 135.507 16.657 135.507 10.7561V0.0271063H133.755H132.004V8.34048Z"
            fill="none"
            stroke="#FF008A"
            strokeWidth="2"
          />
        </svg>
        
        {/* <div className="mt-8 text-sm text-gray-400">
          Watch the letters come to life with smooth drawing and color transitions
        </div> */}
      </div>
    </div>
  );
}