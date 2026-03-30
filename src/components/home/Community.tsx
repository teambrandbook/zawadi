"use client";

import { useEffect, useRef } from "react";
import WipeButton from "../shared/WipeButton";
import { waveFillAnimation } from "../../../lib/animations";

export default function Community() {
  const topWaveRef = useRef<SVGPathElement>(null);
  const bottomWaveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    if (topWaveRef.current) {
      cleanups.push(waveFillAnimation(topWaveRef.current, "top"));
    }

    if (bottomWaveRef.current) {
      cleanups.push(waveFillAnimation(bottomWaveRef.current, "bottom"));
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full py-32 md:py-48 bg-black">

        {/* VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/home/home-section3.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* 🔥 TOP WAVE (FILLED) */}
        <div className="absolute top-0 left-0 w-full z-10">
          <svg
            className="w-full h-[60px] md:h-[120px]"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
          >
            <path ref={topWaveRef} fill="#ffffff" />
          </svg>
        </div>

        {/* CONTENT */}
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="font-display text-4xl md:text-7xl font-black text-[#EAE3D2] mb-8 uppercase tracking-tight leading-tight max-w-4xl">
            LEARN MORE ABOUT ZEWADI
          </h2>

          <p className="font-sans text-white text-base md:text-xl leading-relaxed max-w-3xl mb-12 drop-shadow-md">
            Bridging the gap between technology and agriculture to redefine your food experience.
          </p>

          <WipeButton
            href="/about"
            label="Explore More"
            variant="beige"
            showIcon={false}
          />
        </div>

        {/* 🔥 BOTTOM WAVE (FILLED) */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg
            className="w-full h-[60px] md:h-[120px]"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
          >
            <path ref={bottomWaveRef} fill="#ffffff" />
          </svg>
        </div>

      </div>
    </section>
  );
}