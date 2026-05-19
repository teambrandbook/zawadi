"use client";

import React from 'react';
import Image from 'next/image';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const MeaningSection = () => {
  const { locale } = useLocale();

  // Fallback structural safety pointers
  const sectionData = translations[locale]?.meaningSection || translations["en"].meaningSection;

  return (
    <section className="relative w-full py-10 lg:py-32 bg-[#fffef5] overflow-hidden lg:px-20">
      <div className="container mx-auto px-6 lg:px-32">
        <div className="flex flex-col lg:flex-row items-start gap-0 lg:gap-20">

          {/* Left Content Column */}
          <div className="w-full lg:w-1/2 flex flex-col text-left rtl:text-right">

            {/* Custom Heading Decor */}
            <div className="flex items-center gap-6 mb-8 fade-in">
              <div className="relative w-19 h-4 transform rtl:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="92" height="14" viewBox="0 0 92 14" fill="none">
                  <path d="M0 12.5986H90L81.0373 0.598633" stroke="#121414" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[#121414] text-[11px] font-bold font-sans uppercase tracking-[2.5px]">
                {sectionData.badge}
              </span>
            </div>

            <h2 
              className="text-[#121414] text-4xl lg:text-[54px] font-serif leading-[1.1] mb-6 fade-in"
              dangerouslySetInnerHTML={{ __html: sectionData.titleHTML }}
            />

            <p className="text-[#121414] text-[14px] font-normal font-sans leading-relaxed mb-12 max-w-[460px] fade-in lg:rtl:ml-auto">
              {sectionData.description1}
            </p>

            {/* Horizontal Image */}
            <div className="image-topdown rounded-2xl relative w-full aspect-[16/8] mb-12 overflow-hidden shadow-sm">
              <Image
                src="/home/meaningImg2.webp"
                alt="Shared meals"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Content Column - Tall Image */}
          <div className="w-full lg:w-1/2 lm:pt-12">
            <div className="image-topdown rounded-2xl relative w-full aspect-[3/4] lg:h-[600px] overflow-hidden shadow-sm">
              <Image
                src="/home/meaningImg1.webp"
                alt="Meaningful moments"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row - Text and Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mt-12 gap-8 text-left rtl:text-right rtl:lg:flex-row-reverse">
          <p className="text-[#121414] text-[15px] font-normal font-sans leading-relaxed max-w-[580px] fade-in">
            {sectionData.description2}
          </p>

          {/* Corrected Button: Using Tailwind Logical Padding and Auto-Reversing Direction */}
          <button className="group bg-[#1a3c34] hover:bg-[#132d27] text-white rounded-full ps-7 pe-1.5 py-1.5 flex items-center gap-5 transition-all duration-300 shrink-0 self-start lg:self-auto rtl:self-end rtl:lg:self-auto">
            <span className="text-[14px] font-semibold tracking-wide">
              {sectionData.discoverBtn}
            </span>
            
            {/* Arrow Wrapper Container */}
            <div className="w-10 h-10 rounded-full bg-[#a37a00] flex items-center justify-center transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="transform rtl:rotate-180"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MeaningSection;
