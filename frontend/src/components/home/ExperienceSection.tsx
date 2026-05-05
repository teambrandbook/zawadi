'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { animateSequence } from '@/utils/animations';

const ExperienceSection = () => {
  useEffect(() => {
    animateSequence('.experience-zoom-item', 0.0);
    animateSequence('.experience-lines-zoom-item', 0.2);
    animateSequence('.experience-dot-zoom-item', 0.5);
    animateSequence('.experience-card-item', 1);
    animateSequence('.experience-number-dot', 0.8);
  }, []);

  return (
    <section className="relative w-full py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">
        <h2 className="text-black text-4xl lg:text-[48px] font-semibold font-['Playfair_Display'] text-center mb-6 max-w-[600px]">
          The Experience of Zewadi
        </h2>
        <p className="text-[#3f4e50] text-sm lg:text-[14px] font-medium font-['Inter'] text-center max-w-[550px] mb-20 lg:mb-12">
          Every meal is more than just food - it&apos;s a moment to share, connect, and remember.
        </p>

        <div className="relative w-full max-w-[1100px] flex flex-col items-center lg:min-h-[600px]">
          <div className="experience-lines-zoom-item hidden lg:block absolute inset-0 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1100 600" fill="none">
              <path d="M320 100 H 400 L 440 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 110 H 700 L 660 170" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M320 490 H 400 L 440 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M780 490 H 700 L 660 430" stroke="#9CB4AB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="experience-zoom-item relative w-[280px] h-[280px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden shadow-2xl z-20 mb-12 lg:mb-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2">
            <Image src="/home/experienceImg1.webp" alt="Zewadi" fill className="object-cover" />
          </div>

          {[
            'left-[432px] top-[160px]',
            'right-[432px] top-[160px]',
            'left-[432px] bottom-[160px]',
            'right-[432px] bottom-[160px]',
          ].map((pos, i) => (
            <div
              key={i}
              className={`experience-dot-zoom-item hidden lg:flex absolute ${pos} h-4 w-4 items-center justify-center rounded-full border border-[#9CB4AB] bg-white z-30`}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#2D4A3E]" />
            </div>
          ))}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:absolute lg:inset-0 z-10 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center lg:h-full gap-8">
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute top-[-20px] md:top-[-62px] right-[-16px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">01</div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">Thoughtful Choices</h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    We handle what goes in, so you don&apos;t have to overthink it just enjoy food that&apos;s simple, balanced, and made right.
                  </p>
                </div>
              </div>

              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute bottom-[-56px] md:bottom-[-56px] right-[-16px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">03</div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">Meaningful Moments</h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    It&apos;s often the smallest moments that matter most the quiet, everyday ones that stay with you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:h-full lg:items-end gap-8">
              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute top-[-170px] md:top-[-62px] left-[-16px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">02</div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">Made for Sharing</h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    Zewadi is best enjoyed together, because good food is always better when shared.
                  </p>
                </div>
              </div>

              <div className="relative lg:w-[320px]">
                <div className="experience-number-dot absolute max-sm:top-[-20px] lg:bottom-[-62px] left-[-16px] w-10 h-10 bg-[#2D4A3E] rounded-full text-white flex items-center justify-center font-semibold text-xs z-30 shadow-md">04</div>
                <div className="experience-card-item bg-[#e6ceae] rounded-xl p-6 shadow-sm">
                  <h3 className="text-black text-lg font-bold mb-2">A Better Way of Living</h3>
                  <p className="text-[#2D4A3E] text-xs font-semibold leading-relaxed">
                    It blends into your life effortlessly, without any fuss just simple, thoughtful goodness every day.
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
