"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

// A slide is either an image card or a video card — never both.
type Slide = {
  title: string;
  content: string;
} & (
  | { image: string; video?: never; autoplay?: never }
  // `autoplay`: when true the video loops muted inline at all times. All video
  // cards also play on hover and open the popup on click regardless of flag.
  | { video: string; autoplay?: boolean; image?: never }
);

// True for local video files we can play with a native <video> element.
// YouTube/Vimeo links fall back to the iframe embed.
const isLocalVideo = (url: string): boolean => /\.(mp4|webm|ogg)$/i.test(url);

// Convert various YouTube URL formats (shorts, watch, youtu.be) into an
// embeddable URL with autoplay enabled. Returns the original URL otherwise.
const getEmbedUrl = (url: string): string => {
  const params = "autoplay=1&rel=0&modestbranding=1";

  // youtube.com/shorts/VIDEO_ID
  const shorts = url.match(/youtube\.com\/shorts\/([^?&/]+)/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}?${params}`;

  // youtu.be/VIDEO_ID
  const short = url.match(/youtu\.be\/([^?&/]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}?${params}`;

  // youtube.com/watch?v=VIDEO_ID
  const watch = url.match(/[?&]v=([^?&/]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}?${params}`;

  return url;
};

const CirculerSlider = () => {
  const [activeSlide, setActiveSlide] = useState<Slide | null>(null);

  // Seconds for the carousel to complete one full 360° rotation.
  // Lower = faster spin, higher = slower spin.
  const rotationDuration = 90;

  // When false, fast scrolling only speeds the spin up — it never flips the
  // rotation direction. Set true to let scroll direction reverse the spin.
  const allowReverse = true;

  // --- Responsive viewport tracking ---
  // The whole circular layout is computed from the viewport size, so we keep
  // it in state and recompute on resize. Starts at 0/0 for SSR; the effect
  // below fills it in on mount.
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      // Throttle to one update per animation frame during a drag-resize.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    measure(); // initial measure on mount
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Responsive layout values derived from the viewport.
  // On narrow screens the circle, cards and gap all scale down so the arc
  // stays on-screen instead of overflowing.
  const isMobile = viewport.width > 0 && viewport.width < 640;
  const isTablet = viewport.width >= 640 && viewport.width < 1024;

  // To keep the layout mathematically identical across all screen sizes (small desktop, 
  // tablet, mobile), we use pure viewport units (vw) for both the radius and the cards.
  const radiusVw = 0.59; // The user's perfectly tuned curve

  // 15.6vw equals ~300px on desktop. Using vw keeps the proportional gaps identical on all screens.
  const cardVw = 15.6;

  // Lock page scroll and pause the carousel spin while the popup is open
  useEffect(() => {
    if (!activeSlide) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    spinTweenRef.current?.pause();

    return () => {
      document.body.style.overflow = previousOverflow;
      spinTweenRef.current?.resume();
    };
  }, [activeSlide]);

  const slides: Slide[] = [
    {
      title: "",
      content: "",
      video: "/images/circuler-slider/1.mp4",
      autoplay: true,
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/1.png",
    },
    {
      title: "",
      content: "",
      video: "/images/circuler-slider/2.mp4",
      autoplay: true,
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/2.png",
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/3.png",
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/3v.png",
    },
    {
      title: "",
      content: "",
      video: "/images/circuler-slider/4.mp4",
      autoplay: true,
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/4.png",
    },
    {
      title: "",
      content: "",
      video: "/images/circuler-slider/5.mp4",
      autoplay: true,
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/5.png",
    },
    {
      title: "",
      content: "",
      video: "/images/circuler-slider/6.mp4",
      autoplay: true,
    },
    {
      title: "",
      content: "",
      image: "/images/circuler-slider/6.png",
    },
   
  ];

  // We use exactly 18 slides (the original 12 + the first 6 repeated)
  // This creates a 20-degree gap between cards.
  // 20 degrees is the perfect angle to fit exactly 5 cards across the top arc.
  const extendedSlides = [...slides, ...slides.slice(0, 6)];

  // On mobile we duplicate the slides to have 3 full sets (36 total). 
  // This provides a massive buffer on the left and right for seamless infinite dragging.
  const mobileSlides = [...slides, ...slides, ...slides];
  const displaySlides = isMobile ? mobileSlides : extendedSlides;

  // To prevent jerks during the continuous 360 rotation, the cards MUST exactly fill the circle.
  const cardGapDeg = 360 / extendedSlides.length;

  // --- Infinite Marquee for Mobile (GSAP based, NO RAF) ---
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGsapScrollRef = useRef(-1);

  const killAutoScroll = useCallback(() => {
    tweenRef.current?.kill();
    lastGsapScrollRef.current = -1;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!isMobile) return;
    const container = scrollContainerRef.current;
    const setW = slideRefs.current[slides.length]?.offsetLeft;
    if (!container || !setW || isInteractingRef.current) return;

    tweenRef.current?.kill();

    const distance = setW * 2 - container.scrollLeft;
    if (distance <= 0) {
      container.scrollLeft = setW;
      setTimeout(startAutoScroll, 0);
      return;
    }

    const duration = distance / 50; // speed = 50px/sec

    tweenRef.current = gsap.to(container, {
      scrollLeft: setW * 2,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        lastGsapScrollRef.current = container.scrollLeft;
      },
      onComplete: () => {
        container.scrollLeft = setW;
        startAutoScroll();
      }
    });
  }, [isMobile, slides.length]);

  useEffect(() => {
    if (!isMobile) return;

    const timeout = setTimeout(() => {
      const container = scrollContainerRef.current;
      const setW = slideRefs.current[slides.length]?.offsetLeft;
      if (container && setW && container.scrollLeft < setW) {
        container.scrollLeft = setW;
      }
      startAutoScroll();
    }, 100);

    return () => {
      clearTimeout(timeout);
      killAutoScroll();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isMobile, slides.length, startAutoScroll, killAutoScroll]);

  const handleContainerScroll = () => {
    if (!isMobile) return;
    const container = scrollContainerRef.current;
    const setW = slideRefs.current[slides.length]?.offsetLeft;
    if (!container || !setW) return;

    // Detect manual user scroll (if it differs from GSAP's last set value)
    if (lastGsapScrollRef.current !== -1 && Math.abs(container.scrollLeft - lastGsapScrollRef.current) > 2) {
      killAutoScroll();

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isInteractingRef.current) startAutoScroll();
      }, 500);
    }

    // Seamless wrap boundaries
    if (container.scrollLeft >= setW * 2) {
      container.scrollLeft -= setW;
    } else if (container.scrollLeft <= setW * 0.5) {
      container.scrollLeft += setW;
    }
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);

  // Smooth tilt setters (gsap.quickTo) that continuously interpolate the cards
  // toward the cursor instead of starting a fresh tween on every mousemove.
  // This removes the first-enter "jerk": the cards lerp to the new target the
  // same way whether it's the first move or the hundredth.
  const tiltXRef = useRef<gsap.QuickToFunc | null>(null);
  const tiltYRef = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const circle = circleRef.current;

      if (!section || !circle) return;

      // Configuration
      // Large radius so only the shallow top arc of the circle is visible,
      // giving the wide fanned-out layout (cards curve across the top).
      // `radiusVh`, `cardGapDeg` are responsive (see component scope above).
      // Read the live viewport height at layout time (this only re-runs on
      // breakpoint crossings, so a stale state value would lag behind).
      const vh = window.innerHeight;
      const radius = vh * radiusVh; // big circle → gentle arc

      // Angular spacing between adjacent cards (degrees of arc → radians).
      const sliceAngle = cardGapDeg * (Math.PI / 180);

      // Start the first card at the top of the circle (-90°) so the spread is
      // centered upward rather than running all the way around.
      const startAngle = -Math.PI / 2;

      // Helper function to update positions based on current rotation
      const updatePositions = (progressRotation: number) => {
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return;

          // Calculate the angle for this specific slide
          // offset by the scroll progress rotation
          const angle = startAngle + i * sliceAngle + progressRotation;

          // FORMULA: x = r * cos(theta), y = r * sin(theta)
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          // Apply transforms
          // We also rotate the slide itself so it faces the center (optional)
          // Convert radians to degrees for CSS rotation: angle * (180 / Math.PI)
          const rotationDeg = angle * (180 / Math.PI) + 90;

          gsap.set(slide, {
            x: x,
            y: y,
            rotation: rotationDeg, // Orient the card towards the center
            opacity: 1,
          });
        });
      };

      // --- Intro: cards rise from the bottom into their circular positions ---
      // Stack all cards just below the visible area, hidden, as the start.
      // Each card already starts at its FINAL rotation so the intro only moves
      // them into place (no rotation animation).
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const angle = startAngle + i * sliceAngle;
        const rotationDeg = angle * (180 / Math.PI) + 90;
        gsap.set(slide, {
          x: 0,
          y: -radius + vh, // ~bottom edge of the section
          rotation: rotationDeg, // final orientation, fixed from the start
          opacity: 0,
        });
      });

      // Proxy object holding the live rotation value (in radians).
      const animationState = { rotation: 0 };

      // Continuous auto-rotation. Spins forever; speed is driven by
      // `rotationDuration` (seconds per full revolution). Starts paused and
      // is kicked off once the intro animation finishes.
      const spinTween = gsap.to(animationState, {
        rotation: -Math.PI * 2, // one full turn
        duration: rotationDuration,
        ease: "none",
        repeat: -1, // loop indefinitely
        paused: true,
        onUpdate: () => {
          updatePositions(animationState.rotation);
        },
      });

      spinTweenRef.current = spinTween;

      // --- Smooth per-card tilt setters ---
      // quickTo gives a continuously-interpolating setter: each mousemove just
      // updates the target and GSAP eases toward it. The first move into the
      // section ramps in exactly like any later move — no flat→tilt snap.
      // Tilt the whole card (outer slide wrapper). rotationX/Y are layered on
      // top of the spin transforms, so the card stays on the circle while it
      // tilts in 3D toward the cursor.
      tiltXRef.current = gsap.quickTo(slideRefs.current, "rotationX", {
        duration: 0.6,
        ease: "power3.out",
      });
      tiltYRef.current = gsap.quickTo(slideRefs.current, "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      });
      // Perspective must be present for rotationX/Y to read as 3D tilt.
      gsap.set(slideRefs.current, { transformPerspective: 1200 });

      // --- Scroll velocity boosts the spin ---
      // The spin's normal direction is always timeScale = +1 (anti-clockwise).
      // A scroll delta momentarily perturbs the speed: scrolling down speeds
      // it up, scrolling up briefly reverses it (when allowReverse), but it
      // always eases back to the normal +1 anti-clockwise spin afterwards.
      const BASE_TIMESCALE = 1; // normal anti-clockwise spin speed
      const MAX_BOOST = 8; // cap on how fast the spin can get
      const VELOCITY_DIVISOR = 150; // higher = less sensitive to scroll speed

      // getVelocity() is spiky frame-to-frame; smooth it so the boost reacts
      // to the trend rather than every jittery sample. This is the main fix
      // for the scroll jerk.
      let smoothedVelocity = 0;
      const VELOCITY_SMOOTHING = 0.15; // 0..1, lower = smoother / more lag

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // velocity is px/sec: positive scrolling down, negative up.
          const raw = self.getVelocity();
          // Exponential moving average — filters out the per-frame spikes.
          smoothedVelocity += (raw - smoothedVelocity) * VELOCITY_SMOOTHING;
          const velocity = smoothedVelocity;

          // Map velocity → a timeScale boost, clamped to [-MAX, MAX].
          const boost = gsap.utils.clamp(
            -MAX_BOOST,
            MAX_BOOST,
            velocity / VELOCITY_DIVISOR,
          );

          let target: number;
          if (boost >= 0) {
            // Scrolling down: speed up the normal forward spin.
            target = Math.max(BASE_TIMESCALE, boost);
          } else if (allowReverse) {
            // Scrolling up: momentarily reverse (negative timeScale).
            target = boost;
          } else {
            // Reverse disabled: still react, but stay forward.
            target = Math.max(BASE_TIMESCALE, Math.abs(boost));
          }

          // Ease the timeScale UP to the perturbed speed (no hard snap), then
          // back down to the normal spin — a single overwriting tween keeps
          // the speed change continuous instead of jerking.
          gsap.to(spinTween, {
            timeScale: target,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
              gsap.to(spinTween, {
                timeScale: BASE_TIMESCALE,
                duration: 1.2,
                ease: "power2.out",
                overwrite: true,
              });
            },
          });

          // Skew the cards' top/bottom edges proportional to scroll speed
          // (horizontal shear), then settle back to 0 — a "drag" reaction
          // where the top trails behind the bottom on fast scroll.
          gsap.to(slideRefs.current, {
            skewX: gsap.utils.clamp(-12, 12, velocity / 200),
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.to(slideRefs.current, {
                skewX: 0,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto",
              });
            },
          });
        },
      });

      // --- Intro: cards rise from the bottom into their circular positions ---
      // Starts paused; a ScrollTrigger plays it once the section scrolls to
      // 80% of the viewport, so it doesn't run before the user reaches it.
      const introTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          spinTween.play(); // begin auto-spin after intro

          // Start the autoplay videos only now, once the intro has finished —
          // so they don't play behind the loading animation.
          slides.forEach((slide, i) => {
            if (!slide.autoplay) return;
            const video = videoRefs.current[i];
            video?.play().catch(() => {});
          });
        },
        scrollTrigger: {
          trigger: section,
          start: "top 80%", // section top hits 80% down the viewport
          once: true, // play a single time
        },
      });

      // Intro tuning knob:
      const INTRO_DURATION = 1; // how long the cards take to settle in

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;

        const angle = startAngle + i * sliceAngle;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // All cards animate into position at the same time (start time 0) —
        // only x/y/opacity move; rotation is already final. A smooth ease
        // gives a gentle settle.
        introTl.to(
          slide,
          {
            x,
            y,
            opacity: 1,
            duration: INTRO_DURATION,
            ease: "sine",
          },
          0, // every card starts together
        );
      });
    },
    {
      scope: sectionRef,
      // Re-run only when a breakpoint is crossed (radiusVh / cardGapDeg change
      // in discrete steps). We deliberately do NOT depend on viewport.height,
      // so a continuous drag-resize doesn't re-run the layout and jerk the
      // cards mid-spin.
      dependencies: [rotationDuration, allowReverse, radiusVh, cardGapDeg],
    },
  );

  // --- Pause the spin while hovering a card; play that card's video ---
  const handleCardMouseEnter = (index: number) => {
    spinTweenRef.current?.pause();

    const video = videoRefs.current[index];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleCardMouseLeave = (index: number) => {
    // Don't resume if the video popup is open (it owns the pause then).
    if (!activeSlide) spinTweenRef.current?.resume();

    // Pause hover playback on leave. Autoplay cards keep looping on their own,
    // so only reset the ones that aren't flagged autoplay.
    const video = videoRefs.current[index];
    if (video && !slides[index].autoplay) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // --- Per-card 3D tilt on section mouse-move ---
  // Moving the mouse anywhere in the section tilts each card individually in
  // 3D toward the cursor — a subtle parallax, like little 3D objects. The
  // tilt (rotationX/Y) is layered on top of each card's spin transforms.
  const MAX_TILT = 4; // degrees of tilt at the section edges

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    // Cursor position relative to the section center, normalized to [-1, 1].
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // Just update the targets; the quickTo setters ease toward them smoothly.
    tiltYRef.current?.(px * MAX_TILT * 2);
    tiltXRef.current?.(-py * MAX_TILT * 2);
  };

  const handleSectionMouseLeave = () => {
    // Ease the tilt back to flat through the same smooth setters.
    tiltXRef.current?.(0);
    tiltYRef.current?.(0);
  };

  return (
    <div className="overflow-x-hidden">
      <div
        ref={sectionRef}
        onMouseMove={handleSectionMouseMove}
        onMouseLeave={handleSectionMouseLeave}
        className="h-screen w-full relative overflow-hidden bg-black"
      >
        <div
          ref={(el) => {
            circleRef.current = el;
            scrollContainerRef.current = el;
          }}
          className={
            isMobile
              ? "flex overflow-x-auto items-center h-full w-full gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "absolute left-1/2 top-1/2 w-0 h-0 flex items-center justify-center"
          }
          onScroll={handleContainerScroll}
          onTouchStart={() => { isInteractingRef.current = true; killAutoScroll(); }}
          onTouchEnd={() => { isInteractingRef.current = false; startAutoScroll(); }}
          onMouseDown={() => { isInteractingRef.current = true; killAutoScroll(); }}
          onMouseUp={() => { isInteractingRef.current = false; startAutoScroll(); }}
          onMouseLeave={() => { isInteractingRef.current = false; startAutoScroll(); }}
          // Pivot sits one radius below centre so only the top arc shows.
          style={{ transform: `translate(-50%, ${radiusVh * 100}vh)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              onClick={() => {
                // Only video cards open the popup; image cards do nothing.
                if (slide.video) setActiveSlide(slide);
              }}
              onMouseEnter={() => handleCardMouseEnter(index)}
              onMouseLeave={() => handleCardMouseLeave(index)}
              className={`rounded-2xl overflow-hidden shadow-2xl shrink-0 ${isMobile ? "relative" : "absolute"
                } ${slide.video ? "cursor-pointer" : ""}`}
              style={
                isMobile
                  ? { width: "250px", height: "250px" }
                  : {
                    width: `clamp(100px, ${cardVw}vw, 400px)`,
                    height: `clamp(100px, ${cardVw}vw, 400px)`,
                    transformOrigin: "center center",
                  }
              }
            >
              {/* Card media: pure image or video, no overlay or filter. */}
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={slide.video}
                  muted
                  loop
                  playsInline
                  // Autoplay is started in JS after the intro finishes (see the
                  // intro timeline's onComplete) — not on mount — so videos
                  // don't play behind the loading animation.
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center z-10 relative">
        <h1 className="text-4xl font-bold">End of Scroll</h1>
      </div>

      {/* Video Popup Modal */}
      {activeSlide?.video && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => setActiveSlide(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveSlide(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
              {isLocalVideo(activeSlide.video) ? (
                <video
                  src={activeSlide.video}
                  className="absolute inset-0 h-full w-full"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeSlide.video)}
                  title={activeSlide.title}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CirculerSlider;
