"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileText,
  Headset,
  Home,
  MapPin,
  Medal,
  RotateCcw,
  ReceiptText,
} from "lucide-react";
import { FaCamera } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type ProgressStatus = "done" | "current" | "pending";

const progressSteps: Array<{
  title: string;
  time: string;
  status: ProgressStatus;
  Icon: React.ElementType;
}> = [
  { title: "Order Placed", time: "Oct 21, 10:30 AM", status: "done", Icon: Check },
  { title: "Processing", time: "Oct 21, 02:15 PM", status: "done", Icon: Check },
  { title: "In Transit", time: "Oct 22, 09:00 AM", status: "current", Icon: ReceiptText },
  { title: "Delivered", time: "Pending", status: "pending", Icon: FaCamera },
];

const orderItems = [
  {
    name: "Buckwheat",
    description: "Fresh seasonal greens, nuts, and organic seeds.",
    price: "$45.00",
    quantity: "Qty: 1",
    image: "/product/p-main.webp",
  },
  {
    name: "Pistachio",
    description: "Pre-cut root vegetables with rustic bread kit.",
    price: "$32.50",
    quantity: "Qty: 2",
    image: "/product/p-1.webp",
  },
  {
    name: "Dried Fruits",
    description: "Smoothie base with fresh berries and grains.",
    price: "$14.50",
    quantity: "Qty: 1",
    image: "/product/p-4.webp",
  },
];

function StatusBadge({ status, Icon }: { status: ProgressStatus; Icon: React.ElementType }) {
  const isActive = status === "done" || status === "current";

  return (
    <span
      className={cn(
        "relative z-10 flex size-8 items-center justify-center rounded-full border-2",
        status === "pending"
          ? "border-[#e3dbd8] bg-white text-[#acacac]"
          : "border-[#1f4d3a] bg-[#1f4d3a] text-white"
      )}
    >
      <Icon size={15} strokeWidth={status === "pending" ? 2 : 3} />
      {status === "current" && (
        <span className="absolute inset-[-5px] rounded-full border border-[#1f4d3a]/25" />
      )}
      <span className="sr-only">{isActive ? "Active" : "Pending"}</span>
    </span>
  );
}

function OrderHeader() {
  return (
    <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.1em] text-[#acacac]">
              Order ID
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-[0.005em] text-[#121414] sm:text-[32px]">
              #ZW-8821
            </h1>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#acacac]">
                Estimated Delivery
              </p>
              <p className="mt-1 text-lg font-bold leading-7 text-[#1f4d3a]">
                Thursday, Oct 24, 2024
              </p>
            </div>
            <span className="hidden h-10 w-px bg-[#e3dbd8] sm:block" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#acacac]">
                Carrier
              </p>
              <p className="mt-1 text-lg font-bold leading-7 text-[#1f4d3a]">
                Zewadi Express Delivery
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 rounded-xl bg-[#f6f5f0] px-5 py-4 text-left sm:w-auto"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#b47800]/10 text-[#b47800]">
              <FileText size={20} />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#121414]">Invoices Ready</span>
              <span className="block text-xs text-[#3f4e50]">Download your digital receipt</span>
            </span>
          </span>
          <Download size={18} className="text-[#1f4d3a]" />
        </button>
      </div>
    </section>
  );
}

function DeliveryStatus() {
  return (
    <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <h2 className="text-xl font-bold text-[#121414]">Delivery Status</h2>

      <div className="relative mt-10 grid gap-8 sm:grid-cols-4 sm:gap-4">
        <div className="absolute left-4 top-4 hidden h-1 w-[calc(100%-2rem)] bg-[#e3dbd8] sm:block" />
        <div className="absolute left-4 top-4 hidden h-1 w-[50%] bg-[#1f4d3a] sm:block" />

        {progressSteps.map(({ title, time, status, Icon }, index) => (
          <div key={title} className="relative flex gap-4 sm:flex-col sm:items-center sm:text-center">
            <div className="absolute left-4 top-8 h-[calc(100%+2rem)] w-px bg-[#e3dbd8] sm:hidden" />
            {index < 2 && (
              <div className="absolute left-4 top-8 h-[calc(100%+2rem)] w-px bg-[#1f4d3a] sm:hidden" />
            )}
            <StatusBadge status={status} Icon={Icon} />
            <div>
              <p
                className={cn(
                  "text-sm font-bold leading-5",
                  status === "pending" ? "text-[#acacac]" : "text-[#121414]"
                )}
              >
                {title}
              </p>
              <p className="text-xs leading-4 text-[#acacac]">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ItemsCard() {
  return (
    <section className="overflow-hidden rounded-[25px] border border-[#e3dbd8] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e3dbd8] px-5 py-4 sm:px-8">
        <h2 className="text-sm font-bold text-[#1f4d3a]">Items in this Order</h2>
        <p className="text-sm text-[#3f4e50]">3 Items</p>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        {orderItems.map((item) => (
          <article key={item.name} className="grid gap-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
            <div className="relative size-24 overflow-hidden rounded-[15px] bg-[#f6f5f0]">
              <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-7 text-[#121414]">{item.name}</h3>
              <p className="text-base leading-6 text-[#3f4e50]">{item.description}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-lg font-bold leading-7 text-[#121414]">{item.price}</p>
              <p className="text-sm leading-5 text-[#acacac]">{item.quantity}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="space-y-4 bg-[#f6f5f0] p-5 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between text-base">
          <span className="text-[#3f4e50]">Subtotal</span>
          <span className="font-medium text-[#121414]">$124.50</span>
        </div>
        <div className="flex items-center justify-between text-base">
          <span className="text-[#3f4e50]">Delivery Fee</span>
          <span className="text-xs font-bold uppercase tracking-[0.05em] text-[#1f4d3a]">
            Free (Gold Tier)
          </span>
        </div>
        <div className="py-2">
          <div className="h-px bg-[#e3dbd8]" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#121414]">Total Amount</span>
          <span className="text-2xl font-extrabold text-[#1f4d3a]">$124.50</span>
        </div>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <aside className="space-y-8 w-full">
      <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#f6f5f0] text-[#1f4d3a]">
            <MapPin size={18} />
          </span>
          <h2 className="text-lg font-bold text-[#121414]">Shipping Address</h2>
        </div>
        <div className="mt-6 space-y-1 text-base leading-6">
          <p className="font-bold text-[#121414]">Sarah Johnson</p>
          <p className="text-[#3f4e50]">4521 Maple Grove</p>
          <p className="text-[#3f4e50]">Austin, TX 78701</p>
          <p className="pt-2 text-[#3f4e50]">+1 (555) 902-1234</p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[25px] bg-[#1f4d3a] p-8 text-white">
        <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#d8c29a]">
            <Medal size={15} />
            Gold Member Benefit
          </div>
          <h3 className="mt-4 text-xl font-bold leading-[25px]">Priority Harvesting</h3>
          <p className="mt-2 text-sm leading-5 text-white/80">
            Your order was picked first this morning for maximum nutrient density.
          </p>
        </div>
      </section>

      <div className="space-y-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-[15px] border-2 border-[#1f4d3a] bg-white py-4 font-bold text-[#1f4d3a]"
        >
          <Headset size={18} />
          Contact Support
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-[15px] border border-[#e3dbd8] bg-[#f6f5f0] py-4 font-bold text-[#3f4e50]"
        >
          <RotateCcw size={18} />
          Modify Delivery
        </button>
      </div>
    </aside>
  );
}

function RecipeCta() {
  return (
    <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#d8c29a]">
            <Image src="/about/testimonial.webp" alt="Recipe expert" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold leading-8 text-[#121414]">
              Looking for more fresh ideas?
            </h2>
            <p className="text-base leading-6 text-[#3f4e50]">
              Check out personalized recipes based on your current harvest.
            </p>
          </div>
        </div>

        <Link
          href="/recipes"
          className="inline-flex items-center justify-center gap-4 rounded-full bg-[#1f4d3a] px-8 py-4 font-semibold text-white transition hover:bg-[#1a4331]"
        >
          Explore Recipes
          <span className="flex size-8 items-center justify-center rounded-full bg-[#b47800]">
            <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function TrackOrder() {
  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-[1100px] space-y-10 lg:space-y-12">
        <OrderHeader />
        <DeliveryStatus />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <ItemsCard />
          <Sidebar />
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/communityDashBorde/myorders"
            className="inline-flex items-center gap-2 text-base font-bold text-[#b47800] transition hover:text-[#9c6900]"
          >
            <ArrowLeft size={15} />
            Back to Order History
          </Link>
        </div>

        <RecipeCta />
      </div>
    </main>
  );
}
