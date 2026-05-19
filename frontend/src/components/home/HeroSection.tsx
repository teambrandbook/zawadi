"use client";

import Image from 'next/image';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const images = [
  "/home/a1.webp",
  "/home/a2.webp",
  "/home/a3.webp",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const { locale } = useLocale();

  // Safeguard fallback strings from translations object structure
  const heroTranslations = translations[locale]?.hero || translations["en"].hero;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen lg:h-screen flex items-center overflow-hidden bg-[#0e2207]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image
            src="/Patterns-03.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/home/heroBg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 lg:px-32 xl:px-40 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between h-full pt-28 pb-12 lg:py-0">

        {/* Copy and CTA Column */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start z-20 mt-12 lg:mt-0">
          <div className="max-w-[480px] mb-8 lg:mb-10">
            <p className="text-white text-sm lg:text-base font-medium font-['Inter'] leading-relaxed opacity-90 text-center lg:text-left rtl:lg:text-right fade-in">
              {heroTranslations.description}
            </p>
          </div>

          <div className="w-full lg:w-auto flex justify-center lg:justify-start">
            <Link href="/about">
              <button className="bg-white rounded-full ltr:pl-6 ltr:pr-1.5 rtl:pr-6 rtl:pl-1.5 py-1.5 flex items-center gap-5 hover:bg-gray-100 transition-all group mb-12 lg:mb-32 cursor-pointer">
                <span className="font-['Inter'] text-[13px] text-[#0e2207] font-bold">
                  {heroTranslations.discoverBtn}
                </span>
                <div className="w-9 h-9 rounded-full bg-[#b47800] flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transform transition-transform rtl:-rotate-180"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </Link>
          </div>

          {/* Localized About Us Badge/Card */}
          <div className="relative w-full max-w-[420px] lg:absolute lg:bottom-12">
            <div className={`inline-block bg-white px-6 py-2 ${locale === "ar" ? "rounded-t-lg" : "rounded-t-lg"}`}>
              <span className="font-['Playfair_Display'] font-bold text-[15px] text-[#121414]">
                {heroTranslations.cardBadge}
              </span>
            </div>
            
            {/* Conditional Corner Rounding applied dynamically based on locale */}
            <div className={`bg-white p-5 flex items-center gap-5 shadow-2xl rounded-b-lg ${
              locale === "ar" ? "rounded-tl-lg rounded-tr-none" : "rounded-tr-lg rounded-tl-none"
            }`}>
              <div className="relative w-[100px] h-[70px] lg:w-[110px] lg:h-[75px] shrink-0 rounded overflow-hidden">
                {images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt="About Us"
                    fill
                    className={`object-cover absolute top-0 left-0 transition-opacity duration-[2000ms] ease-in-out ${
                      current === index ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Inter'] font-semibold text-[15px] lg:text-[16px] text-[#171717] leading-tight mb-2 lg:mb-3">
                  {heroTranslations.cardHeading}
                </h3>
                <Link href="/about" className="w-fit">
                  <button className="flex items-center gap-1 font-['Inter'] text-[11px] text-[#555] font-bold uppercase tracking-widest group cursor-pointer">
                    {heroTranslations.cardLink}
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="transform transition-transform -rotate-45 group-hover:translate-x-0.5 rtl:rotate-45 rtl:group-hover:-translate-x-0.5" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Localized Massive Heading */}
        <div className="w-full lg:w-7/12 flex justify-center lg:justify-end -mt-6 lg:-mt-17">
          <h1 
            className="font-['Playfair_Display'] font-black text-4xl md:text-7xl lg:text-[76px] xl:text-[100px] text-white text-center lg:text-right rtl:lg:text-left leading-[1.1] lg:leading-[0.95] tracking-tight fade-in"
            dangerouslySetInnerHTML={{ __html: heroTranslations.titleHTML }}
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;