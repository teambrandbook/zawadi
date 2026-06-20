"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { historySliderAnimation } from "@/utils/animations";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const HistorySection = () => {
  const { locale } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimeoutRef = useRef<number | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchLastRef = useRef({ x: 0, y: 0 });
  const touchGestureRef = useRef<"horizontal" | "vertical" | null>(null);
  const swipeLockRef = useRef(false);

  // Safeguard fallback schema configuration pointers
  const sectionData = translations[locale]?.historySection || translations["en"].historySection;
  const historyItems = sectionData.items;

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

  const moveSlide = (direction: 1 | -1) => {
    if (swipeLockRef.current) return;

    swipeLockRef.current = true;

    if (direction > 0) {
      next();
    } else {
      prev();
    }

    window.setTimeout(() => {
      swipeLockRef.current = false;
    }, 520);
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

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    touchLastRef.current = touchStartRef.current;
    touchGestureRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    touchLastRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    if (!touchGestureRef.current && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) {
      touchGestureRef.current =
        Math.abs(deltaX) > Math.abs(deltaY) * 1.15 ? "horizontal" : "vertical";
    }

    if (touchGestureRef.current === "horizontal") {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch?.clientX ?? touchLastRef.current.x;
    const touchEndY = touch?.clientY ?? touchLastRef.current.y;

    const deltaX = touchEndX - touchStartRef.current.x;
    const deltaY = touchEndY - touchStartRef.current.y;
    const minSwipeDistance = 44;

    if (
      touchGestureRef.current === "horizontal" &&
      Math.abs(deltaX) > minSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.15
    ) {
      moveSlide(deltaX < 0 ? 1 : -1);
    }

    touchGestureRef.current = null;
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
      onTouchCancel={() => {
        touchGestureRef.current = null;
      }}
      className="relative w-full bg-[#fffef5] pt-10 pb-20 lg:pt-14 lg:pb-24 xl:pb-32 select-none touch-pan-y"
      style={{ touchAction: "pan-y" }}
    >
      <div className="container mx-auto px-6 lg:px-10 xl:px-12">
        <div className="relative w-full overflow-hidden rounded-[40px] bg-[#244d3a] p-8 lg:p-12 xl:rounded-[50px] xl:p-20">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <Image
              src="/Patterns-03.webp"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="relative z-10 mb-16 flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <div className="fade-in flex w-full flex-col gap-6 lg:w-2/3 text-left rtl:text-right">
              <h2 className="font-['Playfair_Display'] text-4xl font-semibold uppercase text-white lg:text-[262.5%] xl:text-[300%]">
                {sectionData.title}
              </h2>
              <p className="max-w-[600px] text-sm text-white/80">
                {sectionData.description}
              </p>
            </div>

            {/* Navigation Arrows Mirror Automatically on Layout Flip */}
            <div className="flex gap-4 self-end lg:self-auto direction-ltr:flex-row-reverse">
              <button
                onClick={() => moveSlide(-1)}
                aria-label="Previous history slide"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:h-11 sm:w-11"
              >
                <ArrowLeft className="h-5 w-5 text-[#fdf6ee] transform rtl:rotate-180" />
              </button>

              <button
                onClick={() => moveSlide(1)}
                aria-label="Next history slide"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:h-11 sm:w-11"
              >
                <ArrowRight className="h-5 w-5 text-[#fdf6ee] transform rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Timeline Dots */}
          <div className="relative z-10 my-10 flex items-center justify-between ltr:ml-10 rtl:mr-10 ltr:md:pl-18 rtl:md:pr-18 lg:my-12 ltr:lg:pl-24 rtl:lg:pr-24 ltr:xl:pl-50 rtl:xl:pr-50">
            {historyItems.map((_, i) => (
              <div key={i} className="flex flex-1 items-center">
                <button
                  onClick={() => {
                    setSlideDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`timeline-dot z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${
                    i === activeIndex ? "dot-active bg-[#b47800]" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i === activeIndex ? "bg-white" : "bg-[#244d3a]"
                    }`}
                  />
                </button>

                {i !== historyItems.length - 1 && <div className="h-[1px] flex-1 bg-white/30" />}
              </div>
            ))}
          </div>

          {/* Mobile Display */}
          <div className="relative z-10 min-h-[380px] overflow-hidden lg:hidden">
            <div
              key={activeIndex} 
              data-history-card
              className="active-card relative z-10 h-[380px] w-full"
            >
              <div className="history-image relative h-full w-full overflow-hidden rounded-[20px]">
                <Image
                  src={historyItems[activeIndex].image}
                  alt={`Zewadi history moment ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="active-text absolute bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-[10px] bg-[#244d3a] p-5 text-[75%] text-white shadow-lg text-center">
                {historyItems[activeIndex].text}
              </div>
            </div>
          </div>

          {/* Desktop Display */}
          <div className="relative z-10 hidden overflow-hidden lg:flex lg:min-h-[380px] lg:items-end lg:gap-4 xl:min-h-[420px] xl:gap-6">
            {historyItems.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <div
                  key={item.image}
                  data-history-card
                  className={`relative transition-all duration-700 ease-out ${
                    isActive
                      ? "active-card z-10 h-[380px] w-[50%] xl:h-[420px]"
                      : "inactive-card h-[270px] w-[20%] opacity-70 xl:h-[300px]"
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
                    <div className="active-text absolute bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-[10px] bg-[#244d3a] p-5 text-[75%] text-white shadow-lg text-center">
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
