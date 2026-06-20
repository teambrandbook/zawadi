'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { animateSequence } from '@/utils/animations';

const ExperienceSection = () => {
  const { locale } = useLocale();
  const isRtl = locale === 'ar';
  const mobileBadgeSide = isRtl ? 'left-[-12px]' : 'right-[-12px]';

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
    <section className="relative w-full py-24 lg:py-28 xl:py-32 bg-[#fffef5] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10 xl:px-12 flex flex-col items-center">
        
        {/* Localization Text Headers */}
        <h2 className="text-black text-4xl lg:text-[42px] xl:text-[48px] font-semibold font-serif text-center mb-6 max-w-[600px]">
          {sectionData.title}
        </h2>
        <p className="text-[#3f4e50] text-sm lg:text-[14px] font-medium font-sans text-center max-w-[550px] mb-20 lg:mb-14 xl:mb-12">
          {sectionData.description}
        </p>

        <div dir="ltr" className="relative w-full max-w-[1100px] flex flex-col items-center lg:min-h-[540px] xl:min-h-[600px]">
          
          {/* The diagram geometry stays fixed; only localized card copy changes direction. */}
          <div className="experience-lines-zoom-item hidden lg:block absolute inset-0 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1100 600" fill="none">
              <path d="M320 100 H 400 L 440 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 110 H 700 L 660 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M320 490 H 400 L 440 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 490 H 700 L 660 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Central Image Node */}
          <div className="experience-zoom-item relative w-[280px] h-[280px] lg:w-[260px] lg:h-[260px] xl:w-[300px] xl:h-[300px] rounded-full overflow-hidden shadow-2xl z-20 mb-12 lg:mb-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2">
            <Image 
              src="/home/experienceImg1.webp" 
              alt="Zewadi center context element" 
              fill 
              className="object-cover" 
            />
          </div>

          {/* SVG anchor pins */}
          {[
            'lg:left-[370px] xl:left-[432px] top-[145px] xl:top-[160px]',
            'lg:right-[370px] xl:right-[432px] top-[145px] xl:top-[160px]',
            'lg:left-[370px] xl:left-[432px] bottom-[145px] xl:bottom-[160px]',
            'lg:right-[370px] xl:right-[432px] bottom-[145px] xl:bottom-[160px]',
          ].map((pos, i) => (
            <div
              key={i}
              className={`experience-dot-zoom-item hidden lg:flex absolute ${pos} h-4 w-4 items-center justify-center rounded-full border border-[#9CB4AB] bg-white z-30`}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#2D4A3E]" />
            </div>
          ))}

          {/* Grid Layout tree containing localized cards data */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:block lg:absolute lg:inset-0 z-10 gap-8 lg:gap-0">
            
            {/* Left Column Stack (Items 01 & 03) */}
            <div className="flex min-w-0 flex-col justify-center gap-8 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[240px] xl:w-[320px]">
              
              {/* Item 01 */}
              <div className="relative w-full">
                <div className={`experience-number-dot absolute top-[-20px] ${mobileBadgeSide} lg:top-[-28%] lg:left-auto lg:right-[-16%] xl:right-[-1%] xl:top-[-72px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md`}>
                  01
                </div>
                <div dir={isRtl ? 'rtl' : 'ltr'} className={`experience-card-item bg-[#e6ceae] rounded-xl p-5 xl:p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-black text-base xl:text-lg font-bold mb-2">
                    {sectionData.item1Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-[11px] xl:text-xs font-semibold leading-5 xl:leading-relaxed">
                    {sectionData.item1Desc}
                  </p>
                </div>
              </div>

              {/* Item 03 */}
              <div className="relative w-full">
                <div className={`experience-number-dot absolute top-[-20px] ${mobileBadgeSide} lg:top-auto lg:bottom-[-28%] lg:left-auto lg:right-[-26%] xl:right-[-6%] xl:bottom-[-66px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md`}>
                  03
                </div>
                <div dir={isRtl ? 'rtl' : 'ltr'} className={`experience-card-item bg-[#e6ceae] rounded-xl p-5 xl:p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-black text-base xl:text-lg font-bold mb-2">
                    {sectionData.item3Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-[11px] xl:text-xs font-semibold leading-5 xl:leading-relaxed">
                    {sectionData.item3Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column Stack (Items 02 & 04) */}
            <div className="flex min-w-0 flex-col justify-center gap-8 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[240px] xl:w-[320px]">
              
              {/* Item 02 */}
              <div className="relative w-full">
                <div className={`experience-number-dot absolute top-[-20px] ${mobileBadgeSide} lg:right-auto lg:left-[-30%] lg:top-[-25%] xl:left-[-16px] xl:top-[-62px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md`}>
                  02
                </div>
                <div dir={isRtl ? 'rtl' : 'ltr'} className={`experience-card-item bg-[#e6ceae] rounded-xl p-5 xl:p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-black text-base xl:text-lg font-bold mb-2">
                    {sectionData.item2Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-[11px] xl:text-xs font-semibold leading-5 xl:leading-relaxed">
                    {sectionData.item2Desc}
                  </p>
                </div>
              </div>

              {/* Item 04 */}
              <div className="relative w-full">
                <div className={`experience-number-dot absolute top-[-20px] ${mobileBadgeSide} lg:right-auto lg:left-[-38px] lg:top-auto lg:bottom-[-27%] xl:bottom-[-62px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md`}>
                  04
                </div>
                <div dir={isRtl ? 'rtl' : 'ltr'} className={`experience-card-item bg-[#e6ceae] rounded-xl p-5 xl:p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-black text-base xl:text-lg font-bold mb-2">
                    {sectionData.item4Title}
                  </h3>
                  <p className="text-[#2D4A3E] text-[11px] xl:text-xs font-semibold leading-5 xl:leading-relaxed">
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
