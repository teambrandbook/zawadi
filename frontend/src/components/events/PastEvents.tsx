"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { pastEvents } from './eventsData';
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

export default function PastEventsSection() {
  const { locale } = useLocale();
  const pastText = translations[locale]?.eventsPage?.past || translations.en.eventsPage.past;
  const localizedPastEvents = pastEvents.map((event, index) => ({
    ...event,
    ...pastText.events[index],
  }));

  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10 bg-[#fffef5]">
      {/* Main Rounded Container */}
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-[#f1f5eb] px-6 py-12 md:px-60 md:py-20">

        {/* Background Leaf Pattern */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-3"
          style={{
            backgroundImage: "url('/Patterns-03.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content Layer */}
        {/* 
          CHANGED: Wrapped everything inside a flex container on mobile to easily control 
          the layout flow of the button using ordering utilities.
        */}
        <div className="relative z-10 flex flex-col">

          {/* Header Row */}
          {/* 
            CHANGED: Removed the button out of this container so it can be re-ordered 
            independently below the grid layout on mobile viewports.
          */}
          <div className="mb-12">
            <h2 className="fade-in text-[#1f4d3a] text-3xl md:text-[42px] font-bold tracking-tight font-sans text-center md:text-left rtl:md:text-right">
              {pastText.title}
            </h2>
          </div>

          {/* Events Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {localizedPastEvents.map((event, index) => (
              <div
                key={index}
                className="left-reveal flex flex-col sm:flex-row rtl:sm:flex-row-reverse overflow-hidden rounded-[28px] bg-white 
                shadow-sm hover:shadow-md transition-shadow duration-300 
                max-w-[650px] w-full mx-auto"
              >

                {/* Image */}
                <div className="relative h-[140px] sm:h-[180px] sm:w-[40%] w-full shrink-0">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-3 text-left rtl:text-right sm:p-4">

                  <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-gray-400 rtl:flex-row-reverse rtl:justify-end">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>

                  <h3 className="mb-1 text-[17px] md:text-[18px] font-bold leading-tight text-[#1f4d3a]">
                    {event.title}
                  </h3>

                  <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-2">
                    {event.description}
                  </p>

                </div>

              </div>
            ))}
          </div>

          {/* View Gallery Link Button */}
          {/* 
            CHANGED: 'order-last' puts the button below the grid layout cards on mobile screens.
            'md:absolute md:top-0 md:right-0' brings it flawlessly up beside the heading title on desktops.
          */}
          <Link
            href="/gallery"
            className="order-last mt-10 mx-auto md:mx-0 inline-flex items-center gap-3 rounded-full bg-[#1f4d3a] px-7 py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-[#183c2e] hover:shadow-lg w-fit md:absolute md:top-0 md:right-0 md:mt-0 rtl:md:left-0 rtl:md:right-auto"
          >
            {pastText.viewGallery}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>

        </div>
      </div>
    </section>
  );
}
