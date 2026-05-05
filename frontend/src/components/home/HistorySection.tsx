"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { historySliderAnimation } from "@/utils/animations";

const historyItems = [
  {
    image: "/home/historyImg1.webp",
    text:
      "Zewadi started with one simple belief: food should feel warm, personal, and worth gathering around.",
  },
  {
    image: "/home/historyImg4.webp",
    text:
      "As the idea grew, each dish became part of a bigger story about comfort, care, and everyday connection.",
  },
  {
    image: "/home/historyImg2.webp",
    text:
      "The journey kept expanding through shared tables, thoughtful details, and moments people wanted to come back to.",
  },
  {
    image: "/home/historyImg3.webp",
    text:
      "Today, Zewadi continues to grow by turning simple meals into memorable experiences for the people around it.",
  },
];

const HistorySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    historySliderAnimation(sectionRef.current, slideDirection);
  }, [activeIndex, slideDirection]);

  const next = () => {
    setSlideDirection(1);
    setActiveIndex((prev) => (prev + 1) % historyItems.length);
  };

  const prev = () => {
    setSlideDirection(-1);
    setActiveIndex((prev) => (prev - 1 + historyItems.length) % historyItems.length);
  };

  const isSmallScreen = () => window.matchMedia("(max-width: 1023px)").matches;

  const isSectionCentered = () => {
    if (!sectionRef.current) return false;

    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return rect.top < viewportHeight * 0.45 && rect.bottom > viewportHeight * 0.55;
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    const mobileLikeScroll = isSmallScreen();

    if (mobileLikeScroll) {
      return;
    }

    const primaryDelta = mobileLikeScroll ? event.deltaY : event.deltaX;
    const secondaryDelta = mobileLikeScroll ? event.deltaX : event.deltaY;

    if (Math.abs(primaryDelta) < Math.abs(secondaryDelta)) {
      return;
    }

    if (mobileLikeScroll && !isSectionCentered()) {
      return;
    }

    event.preventDefault();

    if (wheelLockRef.current) {
      return;
    }

    wheelDeltaRef.current += primaryDelta;

    if (wheelResetTimeoutRef.current) {
      window.clearTimeout(wheelResetTimeoutRef.current);
    }

    wheelResetTimeoutRef.current = window.setTimeout(() => {
      wheelDeltaRef.current = 0;
    }, 180);

    if (Math.abs(wheelDeltaRef.current) < 55) {
      return;
    }

    wheelLockRef.current = true;

    if (wheelDeltaRef.current > 0) {
      next();
    } else {
      prev();
    }

    wheelDeltaRef.current = 0;

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 560);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (!isSmallScreen() || !isSectionCentered()) {
      return;
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="relative w-full overflow-hidden rounded-[40px] bg-[#244d3a] p-8 lg:rounded-[50px] lg:p-20">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <Image
              src="/Patterns-03.webp"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="relative z-10 mb-16 flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <div className="fade-in flex w-full flex-col gap-6 lg:w-2/3">
              <h2 className="font-['Playfair_Display'] text-4xl font-semibold uppercase text-white lg:text-[48px]">
                Where It Began
              </h2>
              <p className="max-w-[600px] text-sm text-white/80 lg:text-[14px]">
                More than just a meal, Zewadi is a growing story of connection, comfort, and everyday joy shared around food.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prev}
                aria-label="Previous history slide"
                className="flex h-[45px] w-[45px] items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-[#b47800]"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  &larr;
                </span>
              </button>

              <button
                onClick={next}
                aria-label="Next history slide"
                className="flex h-[45px] w-[45px] items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-[#b47800]"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  &rarr;
                </span>
              </button>
            </div>
          </div>

          <div className="relative z-10 my-10 flex items-center justify-between ml-10 md:pl-18 lg:my-12 lg:pl-50">
            {historyItems.map((_, i) => (
              <div key={i} className="flex flex-1 items-center">
                <div
                  className={`timeline-dot z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                    i === activeIndex ? "dot-active bg-[#b47800]" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i === activeIndex ? "bg-white" : "bg-[#244d3a]"
                    }`}
                  />
                </div>

                {i !== historyItems.length - 1 && <div className="h-[1px] flex-1 bg-white/30" />}
              </div>
            ))}
          </div>

          <div className="relative z-10 min-h-[380px] overflow-hidden lg:hidden">
            <div
              key={historyItems[activeIndex].image}
              data-history-card
              className="active-card relative z-10 h-[380px] w-full"
            >
              <div className="history-image relative h-full w-full overflow-hidden rounded-[20px]">
                <Image
                  src={historyItems[activeIndex].image}
                  alt={`Zewadi history moment ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="active-text absolute bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-[10px] bg-[#244d3a] p-5 text-[12px] text-white shadow-lg">
                {historyItems[activeIndex].text}
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden overflow-hidden lg:flex lg:min-h-[420px] lg:items-end lg:gap-6">
            {historyItems.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <div
                  key={item.image}
                  data-history-card
                  className={`relative transition-all duration-700 ease-out ${
                    isActive
                      ? "active-card z-10 h-[420px] w-[50%]"
                      : "inactive-card h-[300px] w-[20%] opacity-70"
                  }`}
                >
                  <div className="history-image relative h-full w-full overflow-hidden rounded-[24px]">
                    <Image
                      src={item.image}
                      alt={`Zewadi history moment ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {isActive && (
                    <div className="active-text absolute bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-[10px] bg-[#244d3a] p-5 text-[12px] text-white shadow-lg">
                      {item.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
