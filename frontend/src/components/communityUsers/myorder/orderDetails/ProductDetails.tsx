"use client";

import Image from "next/image";
import { HeartPulse, Leaf, ShieldCheck, UtensilsCrossed, Users } from "lucide-react";

const productHighlights = [
  {
    title: "High in Fiber",
    description: "Supports digestion",
    Icon: HeartPulse,
  },
  {
    title: "Wellness Choice",
    description: "Nutrient-rich",
    Icon: ShieldCheck,
  },
  {
    title: "Recipe Ready",
    description: "Versatile use",
    Icon: UtensilsCrossed,
  },
  {
    title: "Community Trusted",
    description: "5000+ orders",
    Icon: Users,
  },
] as const;

export default function ProductDetails() {
  return <ProductDetailsCard />;
}

type ProductDetailsProps = {
  productName?: string;
  productDescription?: string;
  productImage?: string;
};

export function ProductDetailsCard({
  productName = "ZEWADI Product",
  productDescription = "Premium wellness product from ZEWADI, crafted to support your healthy lifestyle and daily nutrition.",
  productImage = "/product/product-1.webp",
}: ProductDetailsProps) {
  return (
    <section className="rounded-[28px] border border-[#E6E0D6] bg-white p-5 shadow-[0_8px_30px_rgba(15,68,47,0.06)] lg:p-7">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[24px] bg-[#EFE2C9] px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
          <div className="absolute left-4 top-3 h-14 w-14 rounded-full bg-white/30 blur-[1px] sm:left-5 sm:top-4 sm:h-16 sm:w-16" />
          <div className="relative mx-auto flex h-[250px] w-full max-w-[300px] items-center justify-center sm:h-[280px]">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0D5A41] px-4 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(13,90,65,0.24)]">
            <Leaf className="h-3.5 w-3.5" />
            100% Organic
          </div>
        </div>

        <div className="flex-1">
          <span className="inline-flex rounded-full bg-[#F4EADB] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B28A54]">
            Premium Wellness
          </span>
          <h2 className="mt-4 text-[36px] font-bold leading-[0.92] text-[#0A4833] sm:text-[44px]">
            {productName}
          </h2>
          <p className="mt-4 max-w-[340px] text-[15px] leading-8 text-[#6E8A7B]">
            {productDescription}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {productHighlights.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl bg-[#F5F7F3] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(10,72,51,0.03)]"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A4833] shadow-[0_2px_8px_rgba(10,72,51,0.08)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-5 text-[#0A4833]">{title}</p>
                  <p className="text-xs leading-5 text-[#8A968F]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
