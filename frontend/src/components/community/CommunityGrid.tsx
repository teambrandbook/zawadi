"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import communityData from "@/data/community.json";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";

const CommunityGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { gridSection } = communityData;

  useEffect(() => {
    if (!gridSection || !gridSection.items) return;

    const ctx = gsap.context(() => {
      // Zoom-In Animation for Grid Items
      gsap.from(".grid-item", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none none",
        },
      });

      // Subtle Reveal for Footer Text
      gsap.from(".footer-text", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-text",
          start: "top 50%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [gridSection]);

  if (!gridSection || !gridSection.items) return null;

  return (
    <section ref={sectionRef} className="pt-24 pb-12 bg-white relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {gridSection.items.map((item: any, index: number) => {
            // Data sequence (already alternating): 0:I, 1:T, 2:I, 3:T, 4:I, 5:T
            // Goal:
            // Mobile (1-col): DOM Order (I,T,I,T...)
            // Desktop (3-col): DOM Order (I-T-I, T-I-T)
            // Tablet (2-col): Custom Order to make Row 2 (T,I) -> Row1(0,1), Row2(3,2), Row3(4,5)

            const orders: any = {
              0: "order-1 md:order-1 lg:order-1",
              1: "order-2 md:order-2 lg:order-2",
              2: "order-3 md:order-4 lg:order-3",
              3: "order-4 md:order-3 lg:order-4",
              4: "order-5 md:order-5 lg:order-5",
              5: "order-6 md:order-6 lg:order-6"
            };

            return (
              <div
                key={index}
                className={cn(
                  "grid-item group relative aspect-square overflow-hidden rounded-none border border-gray-100/5 flex flex-col hover:z-10",
                  orders[index] || ""
                )}
              >
                {item.type === "image" ? (
                  <div className="relative w-full h-full overflow-hidden cursor-pointer">
                    <Image
                      src={item.src}
                      alt={item.alt || "Community Gallery"}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#1a4331] flex flex-col items-center justify-center p-8 md:p-12 text-center text-white">
                    <h3 className="text-2xl md:text-3xl lg:text-[2.5rem] font-playfair font-medium mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/80 leading-relaxed font-inter max-w-[280px]">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {gridSection.footerText && (
          <div className="footer-text mt-12 max-w-6xl mx-auto px-6 border-t border-gray-100/10 pt-10">
            <p className="text-lg md:text-xl text-black/80 font-inter leading-relaxed max-w-4xl">
              {gridSection.footerText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityGrid;
