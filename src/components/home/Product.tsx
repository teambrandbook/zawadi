"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { productScrollAnimation } from "../../../lib/animations";

const products = [
  {
    id: 1,
    image: "/home/section6-1.webp",
    desc: "Bridging the gap between technology and agriculture.",
  },
  {
    id: 2,
    image: "/home/section6-center.webp",
    desc: "Experience the ultimate in sustainable agriculture.",
  },
  {
    id: 3,
    image: "/home/section6-right.webp",
    desc: "Redefining purity and taste.",
  },
];

export default function Product() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      productScrollAnimation(containerRef.current);
    }
  }, []);

  return (
    <div className="px-20">
      <section
        ref={containerRef}
        className="bg-[#9F8151] py-20 px-20"
      >

        <h2 className="text-4xl md:text-6xl font-bold text-[#EAE3D2] mb-12">
          Our Product
        </h2>

        {/* Cards */}
        <div className="relative flex justify-center items-start min-h-[460px] md:min-h-[520px] overflow-hidden">

          {products.map((product) => (
            <div
              key={product.id}
              className="card absolute w-52 md:w-[25rem] rounded-sm  will-change-transform flex flex-col items-center"
            >

              {/* Image */}
              <div className="relative w-full h-[14rem] md:h-[22rem] overflow-hidden rounded-sm">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text BELOW image */}
              <p className="desc text-white text-xs md:text-sm opacity-0 text-center mt-4 px-3 leading-relaxed">
                {product.desc}
              </p>

            </div>
          ))}

        </div>

      </section>
    </div>
  );
}