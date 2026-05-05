"use client";

// Triggering dev server refresh

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap, { animatePopUp } from "@/lib/gsap";
import galleryData from "@/data/gallery.json";
import { cn } from "@/lib/utils";

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("SHOW ALL");
  const [mounted, setMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const { categories, items } = galleryData;

  const filteredItems = activeCategory.toUpperCase() === "SHOW ALL" 
    ? items.slice(0, 9) // Explicitly ensure we show up to 9 items
    : items.filter(item => item.category === activeCategory);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      animatePopUp(".gallery-item", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, [mounted, activeCategory]);

  if (!mounted) return null;

  return (
    <section className="pt-40 pb-20 md:pt-48 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16 md:mb-20 max-w-[360px] md:max-w-none mx-auto animate-fade-in w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 sm:px-6 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] sm:text-[11px] md:text-[13px] font-bold tracking-widest transition-all duration-300 uppercase border whitespace-nowrap",
                activeCategory === category
                  ? "bg-[#A67C00] border-[#A67C00] text-white shadow-lg"
                  : "bg-white border-gray-200 text-[#1A4331] hover:border-[#A67C00] hover:text-[#A67C00]"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item opacity-0 group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* New Hover Overlay (Gold) with Pill Title */}
              <div className="absolute inset-0 bg-[#A67C00]/85 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500">
                <div className="bg-white px-10 py-5 rounded-t-[1rem] rounded-b-none text-black text-base font-bold shadow-2xl translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500">
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;
