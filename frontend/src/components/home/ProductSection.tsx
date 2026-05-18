"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productCarouselAnimation } from "@/utils/animations";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";

const products = [
  { image: "/home/productImg1.webp", text: "Bridging the gap between technology and agriculture to redefine your food experience." },
  { image: "/home/productImg2.webp", text: "Connecting innovation with agriculture to transform how you experience food." },
  { image: "/home/productImg3.webp", text: "Transforming agriculture through technology for a more meaningful food connection." },
];

const ProductSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const productTextRef = useRef<HTMLParagraphElement>(null);
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prev = () => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();

    if (isAnimating || wheelLockRef.current) {
      return;
    }

    wheelDeltaRef.current += event.deltaX;

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
    }, 520);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (isAnimating) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      next();
    } else {
      prev();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    productCarouselAnimation(
      containerRef.current,
      activeIndex,
      setIsAnimating
    );

    if (productTextRef.current) {
      gsap.fromTo(
        productTextRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-[#1f4b3f] py-12 lg:py-16"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src="/Patterns-03.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-24">
        {/* Header Container for Mobile Positioning */}
        <div className="relative mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#fdf6ee] sm:text-4xl lg:text-5xl">
            Our Product
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Mobile Arrows (Top Right) - Hidden on sm and up */}
            <button
              onClick={prev}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:hidden"
            >
              <ArrowLeft className="h-5 w-5 text-[#fdf6ee]" />
            </button>
            <button
              onClick={next}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:hidden"
            >
              <ArrowRight className="h-5 w-5 text-[#fdf6ee]" />
            </button>
          </div>
        </div>

        <div className="relative flex h-[280px] items-center justify-center sm:h-[360px] lg:h-[440px]">
          {/* Desktop/Tablet Arrows - Hidden on mobile */}
          <button
            onClick={prev}
            className="group absolute left-0 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:flex lg:left-20 lg:h-12 lg:w-12"
          >
            <ArrowLeft className="h-5 w-5 text-[#fdf6ee]" />
          </button>

          {products.map((item, i) => (
            <div
              key={i}
              className={`card absolute h-[180px] w-[160px] overflow-hidden rounded-xl opacity-90 sm:h-[260px] sm:w-[190px] lg:h-[300px] lg:w-[330px]`}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              <Image
                src={item.image}
                alt="product"
                fill
                className="object-cover object-center"
              />
            </div>
          ))}

          <button
            onClick={next}
            className="group absolute right-0 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-[#fdf6ee]/30 transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:flex lg:right-20 lg:h-12 lg:w-12"
          >
            <ArrowRight className="h-5 w-5 text-[#fdf6ee]" />
          </button>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/products"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#fdf6ee]/30 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#fdf6ee] transition-all duration-300 hover:border-[#b47b00] hover:bg-[#b47b00] sm:h-11 sm:px-5"
          >
            View Product
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p
          ref={productTextRef}
          className="mx-auto mt-6 max-w-[600px] text-center text-sm text-[#fdf6ee]/80"
        >
          {products[activeIndex].text}
        </p>
      </div>
    </section>
  );
};

export default ProductSection;
