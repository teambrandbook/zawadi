"use client";

import { useEffect, useRef } from "react";
import { dashBorderAnimation } from "../../../lib/animations";

type Props = {
  count: number 
  text: string;
};

export default function IncreditionsTable({ count, text }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      dashBorderAnimation(ref.current);
    }
  }, []);

  return (
    <section className="py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-[85rem] mx-auto">
        <div
          ref={ref}
          className="border-box relative p-10 flex flex-col gap-6 overflow-hidden"
        >
          {/* CONTENT */}
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-light text-black">
              {count}
            </span>
            <h2 className="font-display text-2xl font-light text-black">
              Ingredients
            </h2>
          </div>

          <p className="font-mulish text-gray-600 leading-relaxed max-w-4xl">
            {text}
          </p>

          

          {/* TOP */}
          <div className="border-top absolute top-0 left-0 w-full h-[2px] border-t-2 border-dashed border-[#0A4834]" />

          {/* RIGHT */}
          <div className="border-right absolute top-0 right-0 h-full w-[2px] border-r-2 border-dashed border-[#0A4834]" />

          {/* BOTTOM */}
          <div className="border-bottom absolute bottom-0 left-0 w-full h-[2px] border-b-2 border-dashed border-[#0A4834]" />

          {/* LEFT */}
          <div className="border-left absolute top-0 left-0 h-full w-[2px] border-l-2 border-dashed border-[#0A4834]" />
        </div>
      </div>
    </section>
  );
}