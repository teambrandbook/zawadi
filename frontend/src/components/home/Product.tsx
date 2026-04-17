"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { storyScrollAnimation } from "../../../lib/animations"; // ✅ added
import WipeButton from "../shared/WipeButton";

const products = [
  {
    id: 1,
    image: "/home/section6-1.webp",
    desc: "Connecting traditions with modern precision.",
  },
  {
    id: 2,
    image: "/home/section6-center.webp",
    desc: "Crafted for shared moments and memories.",
  },
  {
    id: 3,
    image: "/home/section6-right.webp",
    desc: "Pure, honest food for intentional living.",
  },
];

export default function Product() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = storyScrollAnimation(containerRef.current);

    return () => {
      cleanup && cleanup();
    };
  }, []);

  return (
    <div className="px-4 md:px-10 lg:px-20 py-10">
      <section
        ref={containerRef}
        className="bg-[#9F8151] py-10 px-4 md:px-10 lg:px-20 "
      >
        <h2 className="text-4xl md:text-4xl lg:text-5xl font-boldonse font-light text-[#EAE3D2] mb-10 lg:mb-12">
          Our Product
        </h2>

        <div className="relative flex justify-center items-start min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden">

          {products.map((product) => (
            <div
              key={product.id}
              className="story-card absolute w-40 sm:w-52 md:w-[25rem] rounded-sm will-change-transform flex flex-col items-center"
            >
              <div className="relative w-full h-[12rem] sm:h-[14rem] md:h-[22rem] overflow-hidden rounded-sm">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <p className="story-text text-white font-mulish text-xs md:text-sm opacity-0 text-center mt-4 px-3 leading-relaxed">
                {product.desc}
              </p>
            </div>
          ))}

          <div className="pt-80 md:pt-110 lg:pt-120">
            <WipeButton href="/events" label="Shop Now" />
          </div>

        </div>
      </section>
    </div>
  );
}