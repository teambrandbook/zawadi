"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import communityData from "@/data/community.json";
import { Diamond, Users, Lightbulb } from "lucide-react";
import gsap from "@/lib/gsap";

const iconMap: any = {
  Diamond: Diamond,
  Users: Users,
  Lightbulb: Lightbulb,
};

const WavyArrow = ({ className }: { className?: string }) => (
  <svg
    width="60"
    height="12"
    viewBox="0 0 60 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1 6C5 6 7 2 11 2C15 2 17 10 21 10C25 10 27 2 31 2C35 2 37 10 41 10C45 10 47 6 51 6H59M59 6L54 2M59 6L54 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
);

const CommunityOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { overviewSection } = communityData;

  useEffect(() => {
    if (!overviewSection) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });

      // 1. Image Wipe L->R
      tl.fromTo("#overview-img",
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut", clearProps: "all" }
      );

      // 2. Green Bg Wipe L->R with a time gap!
      tl.fromTo("#overview-green",
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut", clearProps: "all" },
        "+=0.2" // The requested gap in swiping
      );

      // 3. Text Content Fades In
      tl.fromTo(".overview-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
        "-=0.4"
      );

      // 4. Floating Cards Fade In Sequentially
      tl.fromTo(".overview-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 },
        "-=0.6"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [overviewSection]);

  if (!overviewSection) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Outer Relative Layout to protect floating cards from clipPath */}
        <div className="relative mb-64 md:mb-12">

          {/* The Wrapper (No longer backgrounded, purely layout) */}
          <div className="relative rounded-[2.5rem] min-h-[600px] md:min-h-[650px] shadow-2xl flex flex-col md:flex-row overflow-hidden bg-white">
            
            {/* Left Side: Editorial Image */}
            <div id="overview-img" className="w-full md:w-[42%] relative min-h-[400px] md:min-h-full bg-gray-100">
              <Image
                src={overviewSection.image}
                alt="Community Life"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Right Side: Headlines (Now hosts the green bg itself) */}
            <div id="overview-green" className="relative z-10 flex w-full flex-col items-center justify-start overflow-hidden bg-brand-green p-8 pb-48 text-center md:w-[58%] md:items-start md:p-16 md:pb-64 md:text-left lg:p-24">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url('/Patterns-03.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="overview-text relative z-10 mb-8 flex items-center gap-4 text-white/50">
                <WavyArrow className="rotate-180" />
                <span className="text-white text-xs font-dm font-bold tracking-[0.4em] uppercase">
                  {overviewSection.subtitle}
                </span>
                <WavyArrow />
              </div>

              <h2 className="overview-text relative z-10 mb-12 text-4xl font-playfair font-medium leading-[1.1] text-white md:text-5xl lg:text-7xl">
                {overviewSection.title}
              </h2>
            </div>
          </div>

          {/* Floating Cards (Outside the Wiped Container boundaries) */}
          <div className="absolute -bottom-64 md:bottom-20 left-0 w-full px-6 md:px-12 z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-12 max-w-[95%] md:max-w-6xl mx-auto">
              {overviewSection.cards.map((card: any, idx: number) => {
                const Icon = iconMap[card.icon];
                return (
                  <div
                    key={idx}
                    className="overview-card relative bg-[#F4F6F2] p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col justify-center min-h-[140px] md:min-h-[170px] hover:scale-[1.02] transition-transform duration-500 group cursor-default"
                  >
                    {/* Hanging Icon Circle - Side Position */}
                    <div className="absolute -left-5 md:-left-7 top-1/2 -translate-y-1/2 w-11 h-11 md:w-16 md:h-16 bg-white rounded-full border border-gray-100 shadow-md flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                      {Icon && <Icon size={idx === 2 ? 18 : 24} className="stroke-[1.5px]" />}
                    </div>

                    <div className="pl-3 md:pl-3">
                      <div className="text-gray-400 text-[10px] font-bold mb-2 tracking-widest uppercase opacity-70">
                        {card.id}
                      </div>
                      <h4 className="text-xl md:text-2xl font-inter font-bold text-brand-green mb-2 leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-dm line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityOverview;
