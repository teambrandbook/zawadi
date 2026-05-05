"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "@/lib/gsap";
import { Heart, Clock, Leaf, LayoutGrid, Layers } from "lucide-react";
import communityData from "@/data/community.json";

const iconMap: any = {
  Heart: Heart,
  Clock: Clock,
  Leaf: Leaf,
  LayoutGrid: LayoutGrid,
  Layers: Layers,
};

const CommunityValues = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { valuesGridSection } = communityData;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });

      // 1. Heading Line by Line Reveal
      tl.to(".value-heading-line", {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.15,
      });

      // 2. Premium Staggered Fade-Up for Cards
      tl.fromTo(".value-card", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "all"
        }, 
        "-=0.4"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!valuesGridSection) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-0">
        <div className="relative w-full max-w-7xl mx-auto bg-[#F3F7F2] rounded-[2rem] md:rounded-[2rem] py-16 px-8 md:py-24 md:px-20">

          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[3rem] md:rounded-[5rem] z-0">
            <Image
              src="/Patterns-03.webp"
              alt="Background Pattern"
              fill
              className="object-cover opacity-3 transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-white/80 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[#F3F7F2]/40" />
          </div>

          <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">

            {/* Header Content - Animated Line by Line */}
            <div className="flex flex-col justify-start pt-12 relative z-30">
              <h2 className="text-3xl md:text-4xl lg:text-[45px] font-playfair font-semibold text-[#1A4331] leading-[1.1] tracking-tight">
                {valuesGridSection.title.split('\n').map((line: string, i: number) => (
                  <span key={i} className="block overflow-hidden pb-2">
                    <span className="block value-heading-line translate-y-full opacity-0">{line}</span>
                  </span>
                ))}
              </h2>
            </div>

            {/* Value Cards */}
            {valuesGridSection.cards.map((card: any, idx: number) => {
              const Icon = iconMap[card.icon];
              return (
                <div
                  key={idx}
                  className="value-card bg-white hover:bg-[#1A4331] p-10 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-start aspect-square relative z-30 transition-colors duration-500 group cursor-default"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#1A4331]/20 group-hover:border-white/30 flex items-center justify-center text-[#1A4331] group-hover:text-white mb-8 transition-colors duration-500">
                    <Icon size={28} className="stroke-[1.5px]" />
                  </div>

                  <h4 className="text-xl md:text-2xl font-bold text-[#1A4331] group-hover:text-white mb-4 leading-tight font-inter transition-colors duration-500">
                    {card.title}
                  </h4>
                  <p className="text-[#333333] group-hover:text-white/80 text-xs md:text-sm leading-relaxed max-w-[240px] font-medium font-inter transition-colors duration-500">
                    {card.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityValues;
