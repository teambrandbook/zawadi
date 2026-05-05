"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "@/lib/gsap";
import { ArrowRight } from "lucide-react";
import communityData from "@/data/community.json";

export default function CommunityHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hero } = communityData;
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate SVG particles mimicking the design (left edge sparse, right convex curve)
    const newParticles = Array.from({ length: 55 }).map((_, i) => {
      // 60% outline, 40% solid
      const type = Math.random() > 0.4 ? "outline" : "solid";
      
      const isLeftSide = i < 15; // Dedicate 15 particles strictly to the far-left edge
      let left, top;

      if (isLeftSide) {
        // Curved distribution tightly anchored to the left border
        const yRatio = Math.random();
        top = -10 + yRatio * 120; // Cover from top to bottom
        
        // Sine wave curve: gentle bulge keeping well clear of text
        const curveOffset = Math.sin(yRatio * Math.PI) * 4; // reduced inward bulge
        const baseLeft = -10 + curveOffset;
        const spread = 6 + (yRatio * 10); 
        
        left = baseLeft + Math.random() * spread;
      } else {
        // Sweeping curved "slide" on the right side
        const yRatio = Math.pow(Math.random(), 0.6);
        top = -10 + yRatio * 120; 
        
        // Compute the left boundary using a curve that stays much further right
        // Pushes the base boundary to the edge until the very bottom
        const minLeft = 85 - (Math.pow(yRatio, 3) * 35); 
        const spread = 15 + (yRatio * 25); 
        
        left = minLeft + Math.random() * spread;
      }

      const size = 15 + Math.random() * 110; // slightly smaller max size to prevent rogue points crossing center
      const rotate = Math.random() * 360;
      
      // Ensure low opacity for scattered, layered look
      const baseOpacity = type === "outline" ? (0.1 + Math.random() * 0.25) : (0.05 + Math.random() * 0.2);
      
      // Colors: light green, yellow accents, soft forest green
      const colors = ["#89B092", "#E2C365", "#A6C79A", "#4A785E"]; 
      let color = colors[Math.floor(Math.random() * colors.length)];
      
      // Subtle white outlines
      if (type === "outline" && Math.random() > 0.2) {
        color = "rgba(255, 255, 255, 0.25)";
      }

      return { id: i, type, left: `${left}%`, top: `${top}%`, size, rotate, baseOpacity, color };
    });
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".reveal-title",
        { y: 40, opacity: 0, filter: "blur(20px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 2.2, ease: "power2.out" }
      );

      tl.fromTo(
        ".reveal-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 },
        "-=2"
      );

      tl.fromTo(
        ".reveal-button",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5 },
        "-=1.5"
      );

      // Animate individual particles popping in
      tl.fromTo(
        ".triangle-particle",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 2.5, stagger: 0.05 },
        "-=2"
      );

      // Continuous floating movement for particles (slightly more active)
      gsap.to(".triangle-particle", {
        y: "random(-120, 120)",
        x: "random(-120, 120)",
        rotation: "random(-90, 90)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.3,
          from: "random",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#1F4130] flex flex-col items-center justify-center pt-32 overflow-hidden text-center text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/Patterns-03.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dynamic Background Clusters (Mimicking the reference design) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute triangle-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ opacity: p.baseOpacity }}
            >
              {p.type === "solid" ? (
                <polygon points="50,0 100,100 0,100" fill={p.color} />
              ) : (
                <polygon points="50,1 99,99 1,99" fill="none" stroke={p.color} strokeWidth="2" />
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center w-full max-w-6xl">
          <h1 className="reveal-title text-5xl md:text-6xl lg:text-[5.5rem] font-playfair font-medium leading-[1.1] mb-8 tracking-tight whitespace-normal md:whitespace-nowrap">
            {hero.title} <span className="text-[#D8C29A] font-normal">{hero.titleAccent}</span>
          </h1>

          <p className="reveal-desc text-base md:text-lg text-white/90 max-w-2xl mb-10 leading-relaxed font-inter opacity-80">
            {hero.description}
          </p>

          <div className="reveal-button">
            <Link href="/about" className="bg-[#D8C29A] text-[#1A4331] font-bold px-8 py-3.5 rounded-full hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide shadow-2xl group cursor-pointer inline-flex">
              {hero.ctaText}
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
