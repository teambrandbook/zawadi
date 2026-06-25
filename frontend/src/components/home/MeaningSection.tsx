"use client";

import React from 'react';
import Image from 'next/image';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { sanitizeHTML } from "@/utils/sanitize";

const MeaningSection = () => {
  const { locale } = useLocale();

  // Fallback structural safety pointers
  const sectionData = translations[locale]?.meaningSection || translations["en"].meaningSection;

  return (
    <section className="relative w-full py-10 md:py-20 xl:py-32 bg-[#fffef5] overflow-hidden md:px-10 xl:px-20">
      <div className="container mx-auto px-6 md:px-16 xl:px-32">
        <div className="flex flex-col [@media_(min-width:640px)]:flex-row [@media_(min-width:640px)]:items-stretch gap-0 [@media_(min-width:640px)]:gap-8 md:gap-12 xl:gap-20">

          {/* Left Content Column */}
          <div className="w-full [@media_(min-width:640px)]:w-1/2 flex flex-col text-left rtl:text-right [@media_(min-width:640px)]:min-h-[580px] xl:min-h-[600px]">

            {/* Custom Heading Decor */}
            <div className="flex items-center gap-6 mb-8 fade-in">
              <div className="relative w-19 h-4 transform rtl:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="92" height="14" viewBox="0 0 92 14" fill="none">
                  <path d="M0 12.5986H90L81.0373 0.598633" stroke="#121414" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[#121414] text-[68.75%] font-bold font-sans uppercase tracking-[2.5px]">
                {sectionData.badge}
              </span>
            </div>

            <h2 
              className="text-[#121414] text-4xl md:text-[187.5%] xl:text-[337.5%] font-serif leading-[1.1] mb-6 fade-in"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(sectionData.titleHTML) }}
            />

            <p className="text-[#121414] text-[87.5%] font-normal font-sans leading-relaxed mb-12 max-w-[520px] xl:max-w-[460px] fade-in md:rtl:ml-auto">
              {sectionData.description1}
            </p>

            {/* Horizontal Image */}
            <div className="image-topdown rounded-2xl relative w-full aspect-[16/8] mb-12 [@media_(min-width:640px)]:mt-auto [@media_(min-width:640px)]:mb-0 overflow-hidden shadow-sm pt-73">
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
          <div className="w-full [@media_(min-width:640px)]:w-1/2 [@media_(min-width:640px)]:min-h-[580px] xl:min-h-[600px] [@media_(min-width:640px)]:pt-15 xl:pt-0 flex flex-col">
            <div className="image-topdown rounded-2xl relative w-full aspect-[3/4] [@media_(min-width:640px)]:mt-auto [@media_(min-width:640px)]:h-[520px] xl:h-[600px] overflow-hidden shadow-sm">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8 text-left rtl:text-right rtl:md:flex-row-reverse">
            <p className="text-[#121414] text-[93.75%] font-normal font-sans leading-relaxed max-w-[580px] fade-in">
            {sectionData.description2}
          </p>

          {/* Corrected Button: Using Tailwind Logical Padding and Auto-Reversing Direction */}
          <button className="group bg-[#1a3c34] hover:bg-[#132d27] text-white rounded-full ps-7 pe-1.5 py-1.5 flex items-center gap-5 transition-all duration-300 shrink-0 self-start md:self-auto rtl:self-end rtl:md:self-auto">
                <span className="text-[87.5%] font-semibold tracking-wide">
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

