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
<section className="relative w-full overflow-x-hidden overflow-y-visible">
      <div className="relative w-full py-32 md:py-48 bg-black">

        {/* ✅ VIDEO (FINAL FIX APPLIED) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            transform: "translateZ(0)",
            top: "-1px",
            bottom: "-1px",
            left: "-1px",
            right: "-1px"
          }}
        >
          <source src="/home/home-section3.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* 🔥 TOP WAVE */}
<div className="absolute top-0 left-0 w-full z-10 overflow-visible">
          <svg
            className="w-full h-[60px] md:h-[120px]"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            style={{ display: "block", overflow: "visible" }}  
          >
            <path
              ref={topWaveRef}
              fill="#ffffff"
              style={{ shapeRendering: "geometricPrecision" }}
            />
          </svg>
        </div>

        {/* CONTENT */}
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="font-display text-2xl md:text-5xl font-light text-[#EAE3D2] mb-10 tracking-tight leading-tight max-w-4xl">
            Learn more about Zewadi
          </h2>

          <p className="font-mulish text-white text-base md:text-xl leading-relaxed max-w-3xl mb-12 drop-shadow-md">
            Zewadi is deeper than what you see on the surface. Get to know the thinking, the purpose, and the story behind it all.
          </p>

          <WipeButton
            href="/about"
            label="Explore More"
            variant="beige"
            showIcon={false}
          />
        </div>

        {/* 🔥 BOTTOM WAVE */}
<div className="absolute bottom-0 left-0 w-full z-10 overflow-visible">
          <svg
            className="w-full h-[60px] md:h-[120px]"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            style={{ display: "block", overflow: "visible" }}  // 👈
          >
            <path
              ref={bottomWaveRef}
              fill="#ffffff"
              style={{ shapeRendering: "geometricPrecision" }}
            />
          </svg>
        </div>

      </div>
    </section>
  );
}