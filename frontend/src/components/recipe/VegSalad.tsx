"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { recipyButtonAnimation } from "../../../lib/animations";

export default function VegSalad() {
  useEffect(() => {
    recipyButtonAnimation(".recipe-btn-wrap")
  }, [])
  return (
    <section className="w-full bg-white py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          {/* Left: Text */}
          <div className="flex flex-col">

            {/* Title */}
            <h2 className="font-boldonse text-xl md:text-[2rem] font-light text-black tracking-tight leading-[1.3] mb-3 uppercase">
              Buckwheat <br /> Chilla
            </h2>

            {/* Description */}
            <p className="font-mulish text-[#555] text-base leading-relaxed mb-3">
              Buckwheat chilla is a savory, protein-rich pancake made with buckwheat flour, finely chopped onions, fresh herbs, and mild spices. Light, wholesome, and quick to prepare, it's a delicious option for breakfast or a healthy snack.
            </p>

            {/* Benefits */}
            <div className="mb-2">
              <h3 className="font-mulish text-sm font-bold text-black mb-2 uppercase">
                Benefits
              </h3>
              <ul className="list-disc list-outside ml-5 space-y-1 font-mulish text-[#555] text-sm md:text-base leading-[1.3]">
                <li>Rich in plant-based protein and fiber</li>
                <li>Naturally gluten-free and easy to digest</li>
                <li>Supports heart health and balanced cholesterol</li>
                <li>Helps maintain steady energy levels</li>
                <li>Packed with essential minerals like magnesium and iron</li>
                <li>Light yet filling—ideal for breakfast or snacks</li>
                <li>Made with simple, wholesome ingredients</li>
                <li>Can be customized with vegetables for added nutrition</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="recipe-btn-wrap mt-4 flex items-center gap-6">
              <Link
                href="/recipe/buckwheat-chilla"
                className="detail-btn flex h-14 w-48 overflow-hidden rounded-full bg-[#0A4834] text-white shadow-sm transition-colors hover:bg-[#1A5A44] md:h-16"
              >
                <span className="whitespace-nowrap px-6 font-mulish text-sm font-bold uppercase tracking-widest flex items-center">
                  View More
                </span>
              </Link>

              <Link
                href="/recipe/buckwheat-chilla"
                className="arrow-btn flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4834] text-white shadow-md transition-colors hover:bg-[#1A5A44] md:h-16 md:w-16"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>

          {/* Right: Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-md shadow-sm lg:order-last">
            <Image
              src="/recipe/recipe-6.webp"
              alt="Buckwheat Chilla"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}