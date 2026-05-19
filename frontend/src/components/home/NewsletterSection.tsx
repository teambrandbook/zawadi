'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const NewsletterSection = () => {
  const { locale } = useLocale();

  // Dynamic localization fallback schema alignment
  const sectionData = translations[locale]?.newsletterSection || translations["en"].newsletterSection;

  return (
    // White background + spacing container wrapper
    <section className="w-full bg-[#fffef5] ">
      <div className="container mx-auto ">
        
        {/* Inner Green Box */}
        <div className=" overflow-hidden shadow-xl">
          <div className="relative flex w-full h-auto flex-col bg-[#244d3a] lg:h-[562px] lg:flex-row rtl:lg:flex-row-reverse">
            
            {/* Background Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <Image
                src="/Patterns-03.webp"
                alt=""
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Left/Right Media Containment Area */}
            <div className="relative z-10 h-[300px] w-full lg:h-full lg:w-1/2">
              <video
                src="/home/newsletterBg.webm"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Content Side Container - Fully Multi-directional Alignment handling */}
            <div className="relative z-10 flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-20 text-left rtl:text-right">
              
              <h2 className="text-white text-3xl lg:text-[50px] font-semibold leading-[1.1] mb-6">
                {sectionData.title}
              </h2>

              <p className="text-white/80 text-sm mb-8 max-w-[500px] leading-relaxed">
                {sectionData.description}
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-[500px]">
                <input
                  type="email"
                  placeholder={sectionData.placeholder}
                  className="flex-1 bg-white px-5 py-3 rounded text-sm outline-none text-gray-900 placeholder:text-gray-500"
                />
                <button className="bg-[#8dae84] text-white px-8 py-3 rounded text-sm hover:bg-[#7a9972] transition-colors whitespace-nowrap">
                  {sectionData.buttonText}
                </button>
              </form>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default NewsletterSection; 
