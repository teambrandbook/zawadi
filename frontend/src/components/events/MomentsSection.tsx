"use client";

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

export default function MomentsSection() {
  const { locale } = useLocale();
  const momentsText = translations[locale]?.eventsPage?.moments || translations.en.eventsPage.moments;

  return (
    <section className="bg-[#fffef5] px-4 pb-10 pt-6 sm:px-6 md:pb-14 md:pt-8 lg:px-0">
      <div className="mx-auto max-w-[1200px] pt-20">
        <div className="relative overflow-hidden rounded-[12px]">

          {/* ✅ Reduced image height */}
          <div className="image-topdown relative h-[180px] sm:h-[280px] lg:h-[380px]">
            <video
              src="/event/moments_main.webm"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

        </div>

        {/* ✅ Reduced box size */}
        <div className="relative z-10 mx-auto -mt-6 max-w-[750px] rounded-[8px] bg-white px-5 py-5 text-left shadow-[0_20px_40px_rgba(0,0,0,0.08)] rtl:text-right sm:px-8 md:-mt-10 md:py-8">

          <h2 className=" font-sans text-[20px] font-semibold text-[#1f4d3a] md:text-[21px] fade-in">
            {momentsText.title}
          </h2>

          <p className="mt-4 max-w-[600px] font-sans text-[14px] leading-6 text-black md:text-[16px] md:leading-[1.4] fade-in">
            {momentsText.description}
          </p>

          <p className="mt-4 max-w-[620px] font-sans text-[14px] font-semibold leading-6 text-[#1f4d3a] md:text-[16px] md:leading-[1.4] fade-in">
            {momentsText.highlight}
          </p>

        </div>
      </div>
    </section>
  );
}
