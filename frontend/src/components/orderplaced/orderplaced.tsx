"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function OrderPlaced() {
  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-12 xl:px-24">
      <section className="mx-auto flex min-h-[520px] max-w-[1440px] flex-col items-center justify-center text-center md:min-h-[620px]">
        <div className="relative mb-8 size-[160px] sm:size-[190px] md:size-[220px]">
          <div className="absolute inset-0 rounded-full bg-[rgba(31,77,58,0.05)]" />
          <div className="absolute inset-3 rounded-full bg-[rgba(31,77,58,0.1)] sm:inset-4" />
          <div className="absolute inset-6 flex items-center justify-center rounded-full bg-[#1f4d3a] text-white sm:inset-8">
            <Check size={48} strokeWidth={3} className="md:size-[60px]" />
          </div>
          <span className="absolute right-1 top-0 size-6 rounded-full bg-[#b47800] sm:-right-2 sm:-top-2 sm:size-[36px]" />
          <span className="absolute bottom-6 left-1 size-5 rounded-full bg-[#2f735b] sm:bottom-8 sm:left-[-8px] sm:size-8" />
        </div>

        <div className="mx-auto max-w-[800px]">
          <h1 className="font-dm text-[28px] font-bold leading-tight text-[#1f4d3a] sm:text-4xl lg:text-[48px] lg:leading-[56px]">
            Order Successfully Placed!
          </h1>
          <p className="mx-auto mt-3 max-w-[600px] text-sm font-medium leading-6 text-[#121414]/70 sm:text-lg">
            Thank you for choosing Zewadi. Your journey to wellness continues.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-[#d8c29a] bg-[#f6f5f0] px-5 py-2.5 text-sm font-bold leading-5 text-[#1f4d3a]">
            Order ID: #ZW-8492017
          </div>
        </div>

        <Link
          href="/trackorder"
          className="mt-8 inline-flex h-[60px] w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-[#b47800] px-6 text-base font-bold leading-6 text-white transition hover:bg-[#9c6900] active:scale-[0.99]"
        >
          Track Order
          <ArrowRight size={20} />
        </Link>

        <div className="mt-10 flex flex-col items-center gap-4 text-base font-bold leading-6 text-[#1f4d3a] sm:flex-row sm:gap-6">
          <Link href="/products" className="inline-flex items-center gap-2 transition hover:text-[#1a4331]">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <span className="hidden h-6 w-px bg-[#d8c29a] sm:block" />
          <Link
            href="/communityDashBorde/myorders"
            className="transition hover:text-[#1a4331]"
          >
            View All Orders
          </Link>
        </div>
      </section>
    </main>
  );
}
