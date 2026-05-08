"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FaBagShopping } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const categories = [
  "All Products",
  "Most Purchased",
  "Furniture",
  "Shoes",
  "Clothes",
  "Electronic",
  "Sports",
  "Grocery",
];

const products = [
  {
    name: "Buckwheat",
    price: "$15",
    image: "/product/buckwheat.webp",
    badge: "New",
    color: "#1a1a1a",
  },
  {
    name: "Oats",
    price: "$19",
    image: "/product/oats.webp",
    badge: "New",
    color: "#e5e5ea",
  },
  {
    name: "Broken Wheat",
    price: "$13",
    image: "/product/broken wheet.webp",
    badge: "New",
    color: "#2b3a55",
  },
  {
    name: "Flaxseed",
    price: "$16",
    image: "/product/flaxseed.webp",
    badge: "New",
    color: "#1a1a1a",
  },
  {
    name: "Quinoa",
    price: "$18",
    image: "/product/quinoa.webp",
    badge: "New",
    color: "#e5e5ea",
  },
  {
    name: "Chia Seed",
    price: "$14",
    image: "/product/chia.webp",
    badge: "New",
    color: "#2b3a55",
  },
];



function Rating() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-[#f2c94c]" aria-label="Rated 4.8 out of 5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={cn(index === 4 ? "fill-transparent" : "fill-current", "stroke-current")}
          />
        ))}
      </div>
      <span className="text-sm font-medium leading-5 tracking-[0.01em] text-[#6b7280]">
        4.8 (124 reviews)
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] sm:p-6">
      <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#f8f8f8]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 402px, (min-width: 768px) 45vw, 90vw"
          className={cn(
            "object-cover transition-transform duration-500",
            product.name === "Buckwheat" 
              ? "scale-[1.35] group-hover:scale-[1.45]" 
              : "group-hover:scale-105"
          )}
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#f2c94c] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
          {product.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-bold capitalize text-[#1a1a1a] sm:text-[22px]">
            {product.name}
          </h2>
          <p className="text-[20px] font-bold text-[#1a1a1a] sm:text-[22px]">
            {product.price}
          </p>
        </div>

        <div className="mt-2.5">
          <Rating />
        </div>

        <p className="mt-4 text-[13px] leading-[1.6] text-[#6b7280] sm:text-[14px]">
          Experience studio-quality sound with adaptive noise cancellation. Designed for ultimate comfort during extended listening sessions with premium acoustic architecture.
        </p>

        <div className="mt-6 pt-2 mt-auto">
          <Link
            href="/products/details"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1f4d3a] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#1a4331] active:scale-[0.99] sm:text-[16px]"
          >
            <FaBagShopping size={18} />
            Add to Cart
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductCards() {
  return (
    <section className="bg-[#fbfaf2] px-6 py-20 sm:px-8 lg:px-20">
      <div className="mx-auto max-w-[1422px]">
        <div className="flex justify-center overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium leading-5 tracking-[0.002em] transition",
                  index === 0
                    ? "bg-[#1f4d3a] text-white"
                    : "text-[#6b7280] hover:bg-white hover:text-[#1f4d3a]"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-9 grid grid-cols-1 justify-items-center gap-x-9 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
