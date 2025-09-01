'use client';

import { useState } from 'react';
import SplitTextAnimation from './SplitTextAnimation';

export default function AnimationDemo() {
  const [isVisible, setIsVisible] = useState(false);

  const triggerAnimation = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        {/* Trigger Button */}
        <button
          onClick={triggerAnimation}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 mb-8"
        >
          Trigger Animation
        </button>

        {isVisible && (
          <>
            {/* Main Title */}
            <div className="space-y-4">
              <SplitTextAnimation
                text="GSAP Split Text Animation"
                className="text-6xl md:text-7xl font-bold text-white leading-tight"
                duration={1.8}
                stagger={0.06}
                delay={0.2}
                maskDirection="up"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <SplitTextAnimation
                text="Smooth character-by-character reveal"
                className="text-xl md:text-2xl text-purple-200 leading-relaxed"
                duration={1.2}
                stagger={0.04}
                delay={2.0}
                maskDirection="up"
              />
            </div>

            {/* Animation Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Left to Right</h3>
                <SplitTextAnimation
                  text="Characters slide in from left"
                  className="text-lg text-white"
                  duration={1.0}
                  stagger={0.05}
                  delay={3.0}
                  maskDirection="left"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Right to Left</h3>
                <SplitTextAnimation
                  text="Characters slide in from right"
                  className="text-lg text-white"
                  duration={1.0}
                  stagger={0.05}
                  delay={3.5}
                  maskDirection="right"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Top to Bottom</h3>
                <SplitTextAnimation
                  text="Characters drop down from above"
                  className="text-lg text-white"
                  duration={1.0}
                  stagger={0.05}
                  delay={4.0}
                  maskDirection="down"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Bottom to Top</h3>
                <SplitTextAnimation
                  text="Characters rise up from below"
                  className="text-lg text-white"
                  duration={1.0}
                  stagger={0.05}
                  delay={4.5}
                  maskDirection="up"
                />
              </div>
            </div>

            {/* Long paragraph example */}
            <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-lg p-8">
              <SplitTextAnimation
                text="This demonstrates how the split text animation works with longer content. Each character appears smoothly with a beautiful masking effect, creating an engaging and professional text reveal animation."
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto"
                duration={1.5}
                stagger={0.03}
                delay={5.0}
                maskDirection="up"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
