"use client";

import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { sanitizeHTML } from "@/utils/sanitize";

const CommunitySection = () => {
  const { locale } = useLocale();

  // Safeguard fallback strings from translations object structure
  const communityTranslations = translations[locale]?.communitySection || translations["en"].communitySection;

  return (
    <section className="relative w-full py-20 lg:py-32 bg-[#fffef5] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-50 flex flex-col md:flex-row items-center gap-12 md:gap-8 lg:gap-20">

        {/* --- Heading & Tagline Block --- */}
        {/* Placed first in DOM order. On small screens, it stays at the top. */}
        <div className="w-full lg:w-[45%] flex flex-col items-start order-1 md:hidden lg:hidden">
          <p className="text-[#3d634d] text-base font-semibold font-['Inter'] mb-3 text-center w-full fade-in">
            {communityTranslations.tagline}
          </p>

          <h2 className="text-[#121414] text-4xl font-bold font-['Playfair_Display'] leading-[1.1] mb-8 text-center w-full fade-in">
            {communityTranslations.title}
          </h2>
        </div>

        {/* --- Image Stack Content --- */}
        {/* On mobile/md, this comes second (under heading). On lg, it moves to the right. */}
        <div className="w-full md:w-[50%] lg:w-[55%] relative h-[350px] md:h-[360px] lg:h-[550px] mb-6 md:mb-0 lg:mb-0 flex justify-center lg:block order-2 md:order-2 lg:order-2">
          <div className="relative w-full max-w-[400px] md:max-w-[360px] lg:max-w-none h-full lg:mt-10">

            {/* 1. Dark Green Background Box */}
            <div className="zoom-item absolute top-0 right-0 z-0 h-[95%] w-[40%] overflow-hidden rounded-lg bg-[#1a3d2e] lg:right-[-30px]">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url('/Patterns-03.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              />
            </div>

            {/* 2. Main Image (Middle Stack) */}
            <div className="zoom-item absolute top-[15%] right-[5%] w-[65%] h-[80%] rounded-xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/home/communityBase.webp"
                alt="Sunset Field"
                fill
                className="object-cover"
              />

              {/* Dynamic Floating Badge */}
              <div className="absolute bottom-2 left-2 right-2 lg:bottom-4 lg:left-4 lg:right-4 bg-[#1a3d2e]/90 backdrop-blur-md px-4 py-3 lg:px-6 lg:py-4 rounded-t-2xl rounded-bl-2xl rounded-br-none lg:rounded-t-3xl lg:rounded-bl-3xl text-white flex items-center gap-3 lg:gap-4 z-20">
                <span className="text-2xl lg:text-4xl font-bold font-['Inter']">100%</span>
                <span
                  className="text-[10px] lg:text-[14px] leading-tight font-medium opacity-90 uppercase tracking-wide"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(communityTranslations.badgeTextHTML) }}
                />
              </div>
            </div>

            {/* 3. Overlapping Small Image (Top Stack Front Face) */}
            <div className="zoom-item absolute top-5 left-0 lg:top-10 w-[45%] h-[55%] rounded-xl overflow-hidden shadow-xl z-20 border-4 border-white">
              <Image
                src="/home/communityBase1.webp"
                alt="Crops"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>

        {/* --- Main Text Details & Actions Block --- */}
        {/* On mobile/md, this flows third (under image stack). On lg, it maps to the left column. */}
        <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col items-start order-3 md:order-1 lg:order-1">
          
          {/* Tablet/desktop headings to preserve side-by-side flexbox columns */}
          <div className="hidden md:block w-full">
            <p className="text-[#3d634d] md:text-[18px] lg:text-[22px] font-semibold font-['Inter'] mb-3 md:text-left lg:text-left fade-in">
              {communityTranslations.tagline}
            </p>

            <h2 className="text-[#121414] md:text-[38px] lg:text-[64px] font-bold font-['Playfair_Display'] leading-[1.1] mb-8 md:text-left lg:text-left fade-in">
              {communityTranslations.title}
            </h2>
          </div>

          <p className="text-[#444] text-sm lg:text-[15px] font-medium font-['Inter'] leading-relaxed mb-10 max-w-[480px] text-center md:text-left lg:text-left fade-in w-full md:w-auto lg:w-auto">
            {communityTranslations.description}
          </p>

          {/* Icons Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start lg:justify-start gap-8 md:gap-6 lg:gap-12 mb-12 fade-in w-full md:w-auto lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/home/wellness.webp" alt="Wellness" width={40} height={40} />
              </div>
              <h3 className="text-[#121414] text-[16px] font-bold font-['Inter']">
                {communityTranslations.iconText1}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/home/inclusive.webp" alt="Inclusive" width={40} height={40} />
              </div>
              <h3 className="text-[#121414] text-[16px] font-bold font-['Inter']">
                {communityTranslations.iconText2}
              </h3>
            </div>
          </div>

          {/* Action Link */}
          <Link
            href="/about"
            className="bg-[#244d3a] text-white rounded-full ps-8 pe-1.5 py-1.5 flex items-center gap-5 hover:opacity-90 transition-all font-bold font-['Inter'] text-[14px] mx-auto md:mx-0 lg:mx-0 cursor-pointer"
          >
            {communityTranslations.discoverBtn}
            <div className="w-9 h-9 rounded-full bg-[#b47800] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CommunitySection;
