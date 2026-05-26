"use client";

import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { sanitizeHTML } from "@/utils/sanitize";

export default function EventTestimonials() {
  const { locale } = useLocale();
  const testimonialText = translations[locale]?.eventsPage?.testimonials || translations.en.eventsPage.testimonials;
  const testimonials = testimonialText.items ?? [
    {
      quote: testimonialText.quote,
      name: testimonialText.name,
      role: testimonialText.role,
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];
  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <section className="bg-[#fffef5] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1f4d3a] ">
            <span>{testimonialText.badge}</span>
            <span className="text-[8px]">▼</span>
          </div>

          <h2
            className="testimonial-heading mx-auto text-center font-serif font-bold text-[2rem] leading-tight text-[#1a4331] sm:text-[2.75rem]"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(testimonialText.titleHTML) }}
          />
        </div>

        {/* Content Wrapper */}
        {/* 
          CHANGED: Used 'flex-col-reverse' to bring the image block to the top on mobile/tablet.
          'lg:flex-row' preserves the overlapping side-by-side arrangement on desktop.
        */}
        <div className="relative flex flex-col-reverse items-center md:flex-row">
          
          {/* Testimonial Card */}
          <div className="left-move relative z-20 w-full ltr:md:-mr-24 rtl:md:-ml-24 ltr:lg:-mr-32 rtl:lg:-ml-32 md:w-[60%]">
            <div className="relative overflow-hidden rounded-[20px] bg-[#f2f6eb] p-8 shadow-2xl shadow-black/5 md:p-10 lg:p-14">
              
              {/* Giant Quote SVG Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                <svg width="300" height="250" viewBox="0 0 334 262" fill="none">
                  <path d="M315.979 25.4951C266.724 31.4237 228.543 73.3136 228.543 124.093C228.543 130.72 233.82 135.997 240.447 135.997H328.876V256.24H208.634V124.093C208.634 62.4049 255.785 11.505 315.979 5.52246V25.4951ZM112.324 25.5049C89.1136 28.3469 67.5891 39.2952 51.6025 56.5C34.5333 74.87 25.039 99.0136 25.0244 124.09V124.093C25.0244 130.72 30.3027 135.997 36.9297 135.997H125.358V256.24H5.11621V124.093C5.11637 62.4049 52.2642 11.5123 112.324 5.52441V25.5049Z" fill="#1F4D3A"/>
                </svg>
              </div>

              <div className="relative z-10">
                <p className="fade-in text-[18px] md:text-[18px] lg:text-[22px] leading-[1.6] text-[#1f4d3a] font-medium text-left rtl:text-right">
                  {activeTestimonial.quote}
                </p>

                <div className="mt-10 flex items-center justify-between">
                  {/* User Info */}
                  <div className="fade-in flex items-center gap-4 rtl:flex-row-reverse">
                    <div className="h-14 w-14 rounded-full bg-[#dcdcd8]" />
                    <div className="text-left rtl:text-right">
                      <p className="text-[16px] font-bold text-[#1f4d3a]">{activeTestimonial.name}</p>
                      <p className="text-[12px] text-[#7a8c78]">{activeTestimonial.role}</p>
                    </div>
                  </div>

                  {/* Navigation Buttons - Positioned to overlap the card edge */}
                  <div className="absolute -right-4 bottom-10 flex gap-2 rtl:-left-4 rtl:right-auto md:-right-6 rtl:md:-left-6 rtl:md:right-auto">
                    <button
                      type="button"
                      onClick={showPrevious}
                      aria-label="Previous testimonial"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 border border-white backdrop-blur-sm text-[#1f4d3a] shadow-sm transition-all hover:bg-[#1f4d3a] hover:text-white"
                    >
                      <MoveLeft className="h-5 w-5 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next testimonial"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/80 text-[#1f4d3a] shadow-lg backdrop-blur-sm transition-all hover:bg-[#1f4d3a] hover:text-white"
                    >
                      <MoveRight className="h-5 w-5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {/* 
            CHANGED: Removed mobile top margin ('mt-8 lg:mt-0' -> 'lg:mt-0') 
            and introduced a bottom margin ('mb-8 lg:mb-0') so it separates naturally from the text card beneath it.
          */}
          <div className="w-full mb-8 md:mb-0 md:w-[50%]">
            <div className="image-topdown relative h-[350px] w-full overflow-hidden rounded-[20px] md:h-[420px] lg:h-[500px]">
              <Image
                src="/about/testimonial.webp " 
                alt="Community hands"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
