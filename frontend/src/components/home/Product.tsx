"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type MatchMediaConditions = {
  sm?: boolean;
  md?: boolean;
};

const products = [
  {
    id: 1,
    image: "/home/section6-1.webp",
    desc: "Connecting traditions with modern precision.",
  },
  {
    id: 2,
    image: "/home/section6-center.webp",
    desc: "Crafted for shared moments and memories.",
  },
  {
    id: 3,
    image: "/home/section6-right.webp",
    desc: "Pure, honest food for intentional living.",
  },
];

export default function Product() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [resizeKey, setResizeKey] = useState(0);

  // Force re-calculation on resize to prevent "shattering"
  useGSAP(() => {
    const handleResize = () => setResizeKey(prev => prev + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, { scope: containerRef });

  const next = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prev = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".story-card");
    const texts = containerRef.current.querySelectorAll(".story-text");

    if (!cards.length || !texts.length) return;

    const mm = gsap.matchMedia();

    mm.add({
      sm: "(max-width: 767px)",
      md: "(min-width: 768px) and (max-width: 1023px)",
      lg: "(min-width: 1024px)",
    }, (context) => {
      const { sm, md } = context.conditions as MatchMediaConditions;

      const spreadX = sm ? 32 : md ? 42 : 48; // Calibrated for responsive fanning
      const baseScale = sm ? 0.75 : 0.8;

      setIsAnimating(true);
      const numProducts = products.length;

      cards.forEach((card, i) => {
        const text = texts[i];

        let pos = i - activeIndex;
        if (pos > 1) pos -= numProducts;
        if (pos < -1) pos += numProducts;

        let scale = 1;
        let opacity = 0;
        let zIndex = 10;
        let rotationY = 0;
        let z = 0;
        let x = 0;

        const spread = sm ? 160 : md ? 220 : 260; // Absolute pixel offsets for stability
        const baseScale = sm ? 0.75 : 0.8;

        if (pos === 0) {
          x = 0; opacity = 1; scale = 1; zIndex = 50; rotationY = 0; z = 0;
        } else if (pos === 1) {
          x = spread; opacity = 0.5; scale = baseScale; zIndex = 20; rotationY = -25; z = -180;
        } else if (pos === -1) {
          x = -spread; opacity = 0.5; scale = baseScale; zIndex = 20; rotationY = 25; z = -180;
        } else {
          x = pos > 0 ? spread * 1.5 : -spread * 1.5; opacity = 0; zIndex = 10; rotationY = pos > 0 ? -35 : 35; z = -350;
        }

        gsap.to(card, {
          x,
          xPercent: -50, // This ensures the card is centered on its absolute anchor (50% left)
          y: 0,
          scale,
          opacity,
          zIndex,
          rotationY,
          z,
          duration: 1.4,
          ease: "expo.out",
          onComplete: () => setIsAnimating(false),
          overwrite: "auto"
        });

        gsap.to(text, {
          opacity: pos === 0 ? 1 : 0,
          y: pos === 0 ? 0 : 20,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true
        });
      });
    });

    return () => mm.revert();

  }, [activeIndex, resizeKey]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || isAnimating) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  return (
    <section
      className="px-0 py-10 md:py-16 overflow-hidden bg-white"
    >
      <div
        ref={containerRef}
        className="max-w-[1400px] mx-auto py-20 px-6 md:px-12 lg:px-24 bg-[#B19468] min-h-[600px] md:min-h-[800px] relative flex flex-col justify-between"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Title Top Left */}
        <div className="w-full">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-boldonse font-light text-[#EAE3D2] mb-0">
            Our Product
          </h2>
        </div>

        {/* Carousel Zone - Fixed positioning for perspective */}
        <div 
          className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] z-20 mt-12 md:mt-16 lg:mt-24"
          style={{ perspective: "1500px" }}
        >
          {products.map((product, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={product.id}
                onClick={() => !isCenter && setActiveIndex(idx)}
                className={`story-card absolute top-1/2 left-1/2 w-44 md:w-60 lg:w-[24rem] aspect-[4/5] rounded-sm will-change-transform flex flex-col items-center -translate-y-1/2 ${!isCenter ? "cursor-pointer" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrative Zone - Bottom Center */}
        <div className="w-full flex justify-center items-center pb-8 min-h-[80px]">
          {products.map((product, idx) => (
            <p
              key={`text-${product.id}`}
              className="story-text absolute max-w-2xl text-center font-mulish text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed px-6 opacity-0"
            >
              {product.desc}
            </p>
          ))}
        </div>

        {/* Navigation Buttons (Hidden on small screens, purely for UX on Desktop) */}
        <div className="absolute inset-x-6 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className={`w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-full border border-white/20 text-[#EAE3D2] transition-all duration-300 pointer-events-auto bg-black/5 hover:bg-white/10 ${isAnimating ? "opacity-20" : "opacity-100"}`}
            aria-label="Previous product"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className={`w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-full border border-white/20 text-[#EAE3D2] transition-all duration-300 pointer-events-auto bg-black/5 hover:bg-white/10 ${isAnimating ? "opacity-20" : "opacity-100"}`}
            aria-label="Next product"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
