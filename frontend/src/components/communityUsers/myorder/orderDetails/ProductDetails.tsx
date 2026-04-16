"use client";

import Image from "next/image";
import { CheckCircle2, Leaf, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetails() {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-36 w-36 overflow-hidden rounded-lg bg-[#ECE3D0]">
          <Image src="/product/product-1.webp" alt="Buckwheat" fill className="object-cover" />
        </div>

        <div className="flex-1">
          <span className="inline-flex rounded-full bg-[#F1E3C4] px-2 py-1 text-[10px] font-semibold text-[#8C6A37]">
            PREMIUM QUALITY
          </span>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-[#0A4833]">ZEWADI Buckwheat</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Our premium buckwheat is carefully sourced and processed to preserve its natural nutrients.
            It supports healthy living and sustainable farming.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-lg bg-[#F6F7F3] px-2 py-2 text-[#0A4833]">
              <Leaf className="mb-1 h-4 w-4 text-[#0A4833]" />
              High Fiber
            </div>
            <div className="rounded-lg bg-[#F6F7F3] px-2 py-2 text-[#0A4833]">
              <ShieldCheck className="mb-1 h-4 w-4 text-[#0A4833]" />
              Wellness Choice
            </div>
            <div className="rounded-lg bg-[#F6F7F3] px-2 py-2 text-[#0A4833]">
              <CheckCircle2 className="mb-1 h-4 w-4 text-[#0A4833]" />
              Freshly Ready
            </div>
            <div className="rounded-lg bg-[#F6F7F3] px-2 py-2 text-[#0A4833]">
              <Truck className="mb-1 h-4 w-4 text-[#0A4833]" />
              Community Trusted
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
