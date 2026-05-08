"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Medal,
  Settings,
  UserRound,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "My Profile", Icon: UserRound, href: "/guestprofile", active: true },
  { label: "Orders", Icon: ReceiptText, href: "/guestprofile/history" },
  { label: "My Recipes", iconSrc: "/userdash/myrecipy/my-recipes-icon.png", href: "/guestprofile" },
  { label: "Settings", Icon: Settings, href: "#" },
];

const orders = [
  {
    id: "#ZW-8821",
    date: "Oct 21, 2024",
    status: "Processing",
    total: "$124.50",
    tone: "processing",
  },
  {
    id: "#ZW-8745",
    date: "Oct 14, 2024",
    status: "Delivered",
    total: "$89.20",
    tone: "delivered",
  },
  {
    id: "#ZW-8692",
    date: "Oct 07, 2024",
    status: "Delivered",
    total: "$156.00",
    tone: "delivered",
  },
  {
    id: "#ZW-8511",
    date: "Sep 30, 2024",
    status: "Cancelled",
    total: "$42.15",
    tone: "cancelled",
  },
  {
    id: "#ZW-8420",
    date: "Sep 23, 2024",
    status: "Delivered",
    total: "$210.40",
    tone: "delivered",
  },
];

const statusStyles = {
  processing: "bg-[#3b82f6] text-[#2563eb]",
  delivered: "bg-[#22c55e] text-[#16a34a]",
  cancelled: "bg-[#ef4444] text-[#dc2626]",
} as const;

function ProfileSidebar() {
  return (
    <aside className="space-y-4 w-full">
      <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 size-32">
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-[#d8c29a]">
              <Image
                src="/about/testimonial.webp"
                alt="Sarah Johnson"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-[#1f4d3a] text-white"
            >
              <Camera size={15} />
            </button>
          </div>

          <h1 className="text-2xl font-bold leading-9 tracking-[0.001em] text-[#121414]">
            Sarah Johnson
          </h1>
          <p className="text-base leading-6 text-[#3f4e50]">sarah.j@example.com</p>
        </div>

        <nav className="mt-8 space-y-2 sm:mt-10">
          {menuItems.map(({ label, Icon, iconSrc, href, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex w-full items-center gap-4 rounded-[15px] p-4 text-left text-base font-semibold transition",
                active ? "bg-[#1f4d3a] text-white" : "text-[#1f4d3a] hover:bg-[#f6f5f0]"
              )}
            >
              {iconSrc ? (
                <Image src={iconSrc} alt="" width={16} height={16} className="size-4" />
              ) : Icon ? (
                <Icon size={16} />
              ) : null}
              {label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="relative overflow-hidden rounded-[20px] bg-[#1f4d3a] p-6 text-white sm:p-8">
        <div className="absolute -bottom-10 -right-10 size-[120px] rounded-full bg-white/10" />
        <p className="text-xl font-bold leading-8">Member Since</p>
        <p className="mt-4 text-[32px] font-extrabold leading-[48px]">2022</p>
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#d8c29a]">
          <Medal size={14} />
          Gold Tier Member
        </div>
      </section>
    </aside>
  );
}

function LatestOrderCard() {
  return (
    <section className="rounded-[25px] border border-[rgba(216,194,154,0.3)] bg-[#f6f5f0] p-6 sm:p-8 lg:p-10">
      <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
        Latest Order: #ZW-8821
      </p>
      <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
        Your fresh harvest is on the way!
      </h2>
      <p className="mt-3 text-base leading-6 text-[#3f4e50]">
        Expected delivery: Thursday, Oct 24th
      </p>
      <Link
        href="/trackorder"
        className="mt-7 inline-flex h-[60px] items-center gap-4 rounded-full bg-[#1f4d3a] px-7 text-base font-semibold text-white transition hover:bg-[#1a4331] sm:px-8"
      >
        View Order Tracking
        <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#b47800]">
          <ArrowRight size={18} strokeWidth={1.5} />
        </span>
      </Link>
    </section>
  );
}

function StatusBadge({ tone, label }: { tone: keyof typeof statusStyles; label: string }) {
  const [dotClass, textClass] = statusStyles[tone].split(" ");

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", textClass)}>
      <span className={cn("size-2 rounded-full", dotClass)} />
      {label}
    </span>
  );
}

function OrderTable() {
  return (
    <>
      <div className="hidden space-y-4 md:block">
        <div className="grid grid-cols-[1.1fr_1.05fr_1.05fr_0.85fr_1fr] border-b border-[#f6f5f0] px-6 pb-4 text-sm font-bold uppercase leading-5 tracking-[0.05em] text-[#acacac]">
          <span>Order ID</span>
          <span>Date</span>
          <span>Status</span>
          <span>Total</span>
          <span className="text-right">Action</span>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="grid min-h-14 grid-cols-[1.1fr_1.05fr_1.05fr_0.85fr_1fr] items-center rounded-xl bg-[rgba(246,245,240,0.3)] px-6 py-4"
          >
            <span className="text-base font-bold leading-6 text-[#121414]">{order.id}</span>
            <span className="text-base leading-6 text-[#3f4e50]">{order.date}</span>
            <StatusBadge tone={order.tone as keyof typeof statusStyles} label={order.status} />
            <span className="text-base font-bold leading-6 text-[#121414]">{order.total}</span>
            <Link
              href="/trackorder"
              className="text-right text-base font-bold leading-6 text-[#1f4d3a] transition hover:text-[#b47800]"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl bg-[rgba(246,245,240,0.45)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#121414]">{order.id}</h3>
                <p className="mt-1 text-sm text-[#3f4e50]">{order.date}</p>
              </div>
              <p className="text-base font-bold text-[#121414]">{order.total}</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <StatusBadge tone={order.tone as keyof typeof statusStyles} label={order.status} />
              <Link href="/trackorder" className="text-sm font-bold text-[#1f4d3a]">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function OrderHistoryPanel() {
  return (
    <section className="overflow-hidden rounded-[25px] border border-[#e3dbd8] bg-white shadow-sm">
      <div className="flex border-b border-[#e3dbd8]">
        <Link
          href="/guestprofile"
          className="px-6 py-5 text-lg font-bold text-[#acacac] transition hover:text-[#1f4d3a] sm:px-10"
        >
          My Recipes
        </Link>
        <span className="border-b-4 border-[#1f4d3a] px-6 py-5 text-lg font-semibold text-[#1f4d3a] sm:px-10">
          Order History
        </span>
      </div>

      <div className="space-y-6 p-5 sm:p-8 lg:p-10">
        <OrderTable />
      </div>
    </section>
  );
}

function Pagination() {
  return (
    <nav aria-label="Order history pages" className="flex items-center justify-center gap-2 pt-3">
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "flex size-10 items-center justify-center rounded-lg border text-sm font-bold transition",
            page === 1
              ? "border-[#1f4d3a] bg-[#1f4d3a] text-white"
              : "border-[#e3dbd8] text-[#3f4e50] hover:border-[#1f4d3a] hover:text-[#1f4d3a]"
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        className="flex size-10 items-center justify-center rounded-lg border border-[#e3dbd8] text-[#3f4e50] transition hover:border-[#1f4d3a] hover:text-[#1f4d3a]"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default function History() {
  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProfileSidebar />

        <div className="space-y-4 sm:space-y-6">
          <LatestOrderCard />
          <OrderHistoryPanel />
          <Pagination />
        </div>
      </div>
    </main>
  );
}
