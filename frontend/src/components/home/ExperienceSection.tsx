'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { animateSequence } from '@/utils/animations';

const ExperienceSection = () => {
  const { locale } = useLocale();

  // Fallback structural safety pointers
  const sectionData = translations[locale]?.experienceSection || translations["en"].experienceSection;

  useEffect(() => {
    animateSequence('.experience-zoom-item', 0.0, 0.55, 0.1);
    animateSequence('.experience-lines-zoom-item', 0.1, 0.55, 0.1);
    animateSequence('.experience-dot-zoom-item', 0.24, 0.55, 0.1);
    animateSequence('.experience-card-item', 0.42, 0.55, 0.1);
    animateSequence('.experience-number-dot', 0.34, 0.55, 0.1);
  }, [locale]);

  return (
    <section className="relative w-full py-24 lg:py-32 bg-[#fffef5] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Localization Text Headers */}
        <h2 className="text-black text-4xl lg:text-[48px] font-semibold font-serif text-center mb-6 max-w-[600px]">
          {sectionData.title}
        </h2>
        <p className="text-[#3f4e50] text-sm lg:text-[14px] font-medium font-sans text-center max-w-[550px] mb-20 lg:mb-12">
          {sectionData.description}
        </p>

        <div className="relative w-full max-w-[1100px] flex flex-col items-center lg:min-h-[600px]">
          
          {/* Background Connecting Lines Map - Rotates dynamically on RTL context layout trees */}
          <div className="experience-lines-zoom-item hidden lg:block absolute inset-0 z-0 pointer-events-none transform rtl:rotate-y-180">
            <svg width="100%" height="100%" viewBox="0 0 1100 600" fill="none">
              <path d="M320 100 H 400 L 440 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 110 H 700 L 660 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M320 490 H 400 L 440 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 490 H 700 L 660 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Central Image Node */}
          <div className="experience-zoom-item relative w-[280px] h-[280px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden shadow-2xl z-20 mb-12 lg:mb-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2">
            <Image 
              src="/home/experienceImg1.webp" 
              alt="Zewadi center context element" 
              fill 
              className="object-cover" 
            />
          </div>

          {/* SVG Anchor Anchor Pins - Re-mapped to flip visually across sides in RTL */}
          {[
            'left-[432px] rtl:right-[432px] rtl:left-auto top-[160px]',
            'right-[432px] rtl:left-[432px] rtl:right-auto top-[160px]',
            'left-[432px] rtl:right-[432px] rtl:left-auto bottom-[160px]',
            'right-[432px] rtl:left-[432px] rtl:right-auto bottom-[160px]',
          ].map((pos, i) => (
            <div
              key={i}
              className={`experience-dot-zoom-item hidden lg:flex absolute ${pos} h-4 w-4 items-center justify-center rounded-full border border-[#9CB4AB] bg-white z-30`}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#2D4A3E]" />
            </div>
          ))}

          {/* Grid Layout tree containing localized cards data */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:absolute lg:inset-0 z-10 gap-8 lg:gap-0 text-left rtl:text-right">
            
            {/* Left Column Stack (Items 01 & 03) */}
            <div className="flex flex-col justify-center lg:h-full gap-8">
              
              {/* Item 01 */}
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute top-[-20px] right-[-16px] md:left-[-16px] md:right-auto lg:top-[-62px] lg:left-auto lg:right-[-16px] rtl:left-[-16px] rtl:right-auto md:rtl:left-auto md:rtl:right-[-16px] lg:rtl:left-[-16px] lg:rtl:right-auto w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">
                  01
                </div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">
                    {sectionData.item1Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    {sectionData.item1Desc}
                  </p>
                </div>
              </div>

              {/* Item 03 */}
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute bottom-[-56px] right-[-16px] md:bottom-auto md:top-[-20px] md:left-[-16px] md:right-auto lg:top-auto lg:bottom-[-56px] lg:left-auto lg:right-[-16px] rtl:left-[-16px] rtl:right-auto md:rtl:left-auto md:rtl:right-[-16px] lg:rtl:left-[-16px] lg:rtl:right-auto w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">
                  03
                </div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">
                    {sectionData.item3Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    {sectionData.item3Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column Stack (Items 02 & 04) */}
            <div className="flex flex-col justify-center lg:h-full lg:items-end gap-8">
              
              {/* Item 02 */}
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute top-[-170px] left-[-16px] md:top-[-20px] lg:top-[-62px] rtl:right-[-16px] rtl:left-auto w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">
                  02
                </div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">
                    {sectionData.item2Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    {sectionData.item2Desc}
                  </p>
                </div>
              </div>

              {/* Item 04 */}
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute top-[-20px] left-[-16px] md:top-[-20px] lg:top-auto lg:bottom-[-62px] rtl:right-[-16px] rtl:left-auto w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">
                  04
                </div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">
                    {sectionData.item4Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    {sectionData.item4Desc}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
