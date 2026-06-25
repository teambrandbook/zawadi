"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import communityData from "@/data/community.json";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type GridItem = {
  type: string;
  src?: string;
  alt?: string;
  title?: string;
  description?: string;
};

const itemOrders: Record<number, string> = {
  0: "order-1",
  1: "order-2",
  2: "order-3",
  3: "order-4",
  4: "order-5",
  5: "order-6",
};


const CommunityGrid = () => {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { gridSection } = communityData;
  const localizedGridSection = translations[locale]?.communityPage?.gridSection || translations.en.communityPage.gridSection;

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
    <section ref={sectionRef} className="pt-24 pb-12 bg-[#fffef5] relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 [@media_(min-width:640px)]:grid-cols-3 gap-8 [@media_(min-width:640px)_and_(max-width:1366px)]:!gap-5 max-w-6xl mx-auto">
          {gridSection.items.map((item: GridItem, index: number) => {
            const localizedItem = localizedGridSection.items[index] || {};

            return (
              <div
                key={index}
                className={cn(
                  "grid-item group relative aspect-square overflow-hidden rounded-none border border-gray-100/5 flex flex-col hover:z-10",
                  itemOrders[index] ?? ""
                )}
              >
                {item.type === "image" ? (
                  <div className="relative w-full h-full overflow-hidden cursor-pointer">
                    <Image
                      src={item.src ?? "/placeholder.webp"}
                      alt={item.alt || "Community Gallery"}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#1a4331] flex flex-col items-center justify-center p-8 md:p-12 [@media_(min-width:640px)_and_(max-width:1366px)]:!p-4 text-center text-white">
                    <h3 className="text-2xl md:text-3xl lg:text-[2.5rem] [@media_(min-width:640px)_and_(max-width:1366px)]:!text-[1.2rem] font-playfair font-medium mb-4 [@media_(min-width:640px)_and_(max-width:1366px)]:!mb-2 leading-tight">
                      {localizedItem.title || item.title}
                    </h3>
                    <p className="text-sm md:text-base [@media_(min-width:640px)_and_(max-width:1366px)]:!text-[11.5px] text-white/80 leading-relaxed [@media_(min-width:640px)_and_(max-width:1366px)]:!leading-[1.45] font-inter max-w-[280px] [@media_(min-width:640px)_and_(max-width:1366px)]:!max-w-[210px]">
                      {localizedItem.description || item.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {localizedGridSection.footerText && (
          <div className="footer-text mt-12 max-w-6xl mx-auto px-6 border-t border-gray-100/10 pt-10">
            <p className="text-lg md:text-xl text-black/80 font-inter leading-relaxed max-w-4xl text-left rtl:text-right">
              {localizedGridSection.footerText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityGrid;

