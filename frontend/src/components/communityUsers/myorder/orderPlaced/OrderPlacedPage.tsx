"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Circle,
  Heart,
  Info,
  List,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ConfirmationDetail = {
  label: string;
  value: string;
};

type OrderedProduct = {
  id: string;
  name: string;
  pack: string;
  quantity: number;
  price: string;
  priceNote: string;
  image: string;
};

type ProgressStep = {
  label: string;
  completed: boolean;
  active?: boolean;
};

type PaymentDetail = {
  label: string;
  value: string;
  strong?: boolean;
};

type HelpItem = {
  label: string;
  Icon: LucideIcon;
};

type OrderPlacedData = {
  confirmation: {
    orderId: string;
    orderDate: string;
    time: string;
    paymentStatus: string;
    estimatedDelivery: string;
    deliveryAddress: string[];
    contact: string;
  };
  products: OrderedProduct[];
  totals: ConfirmationDetail[];
  progress: ProgressStep[];
  paymentDetails: PaymentDetail[];
  helpItems: HelpItem[];
  notice: string;
};

type Props = {
  order: OrderPlacedData;
};

const actionButtonClass =
  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors";

export default function OrderPlacedPage({ order }: Props) {
  const router = useRouter();

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <section className="rounded-xl border border-[#DFDFDF] bg-white px-5 py-8 text-center shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0A4833] text-white">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-[#0A4833]">Order Placed Successfully!</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#4B5563]">
            Your ZEWADI Buckwheat order has been confirmed and is now being processed. Thank you for
            choosing a healthy lifestyle with us.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Order Confirmation</h2>
              <div className="mt-5 grid grid-cols-1 gap-x-16 gap-y-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Order ID</p>
                  <p className="mt-1 text-sm font-bold text-[#0A4833]">{order.confirmation.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Estimated Delivery</p>
                  <p className="mt-1 text-sm font-bold text-[#111827]">{order.confirmation.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Order Date</p>
                  <p className="mt-1 text-sm font-medium text-[#111827]">
                    {order.confirmation.orderDate} <span className="ml-5">at {order.confirmation.time}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Delivery Address</p>
                  {order.confirmation.deliveryAddress.map((line) => (
                    <p key={line} className="mt-1 text-sm font-medium text-[#111827]">
                      {line}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Payment Status</p>
                  <p className="mt-1 text-sm font-bold text-[#0A4833]">{order.confirmation.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Contact</p>
                  <p className="mt-1 text-sm font-medium text-[#111827]">{order.confirmation.contact}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Ordered Products</h2>
              <div className="mt-4 space-y-4">
                {order.products.map((product) => (
                  <article key={product.id} className="flex items-center justify-between rounded-lg bg-[#EBE1CF] p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-white">
                        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">{product.name}</h3>
                        <p className="text-xs text-[#4B5563]">{product.pack}</p>
                        <p className="text-xs font-medium text-[#4B5563]">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0A4833]">{product.price}</p>
                      <p className="text-xs text-[#4B5563]">{product.priceNote}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-[#DFDFDF] pt-4 text-sm">
                {order.totals.map((total) => (
                  <div key={total.label} className="flex items-center justify-between">
                    <span className={total.label === "Total Paid" ? "font-bold text-[#0A4833]" : "text-[#4B5563]"}>
                      {total.label}
                    </span>
                    <span className={total.label === "Total Paid" ? "font-bold text-[#0A4833]" : "font-semibold text-[#111827]"}>
                      {total.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Delivery Progress</h2>
              <div className="mt-7 grid grid-cols-5 items-start gap-2">
                {order.progress.map((step, index) => (
                  <div key={step.label} className="relative flex flex-col items-center gap-2">
                    {index < order.progress.length - 1 && (
                      <span
                        className={`absolute left-1/2 top-3 h-0.5 w-full ${
                          step.completed ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                        step.completed
                          ? "bg-[#0A4833] text-white"
                          : step.active
                            ? "bg-[#0A4833] text-white"
                            : "bg-[#E5E7EB] text-[#9CA3AF]"
                      }`}
                    >
                      {step.completed || step.active ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
                    </span>
                    <span className="text-center text-[11px] font-medium text-[#4B5563]">{step.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/communityDashBorde/myorders")}
                  className={`${actionButtonClass} bg-[#0A4833] text-white hover:bg-[#083B2A]`}
                >
                  <Truck className="h-4 w-4" />
                  Track Order
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/communityDashBorde/myorders")}
                  className={`${actionButtonClass} bg-[#A88751] text-white hover:bg-[#927444]`}
                >
                  <List className="h-4 w-4" />
                  View My Orders
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/communityDashBorde/myorders/order-buckwheat")}
                  className={`${actionButtonClass} border border-[#0A4833] bg-white text-[#0A4833] hover:bg-[#F8F3E9]`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Payment Details</h2>
              <div className="mt-4 space-y-4 text-sm">
                {order.paymentDetails.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between gap-4">
                    <span className="text-[#4B5563]">{detail.label}</span>
                    <span className={detail.strong ? "font-bold text-[#0A4833]" : "font-semibold text-[#111827]"}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#DFDFDF] bg-[#F8F3E9] p-6 text-center">
              <Heart className="mx-auto h-7 w-7 fill-[#A88751] text-[#A88751]" />
              <h2 className="mt-3 text-lg font-bold text-[#0A4833]">Your Wellness Journey</h2>
              <p className="mt-2 text-sm leading-5 text-[#4B5563]">
                Discover recipes, diet plans, and community wellness tips while you wait for your order.
              </p>
              <button
                type="button"
                onClick={() => router.push("/communityDashBorde")}
                className="mt-4 text-sm font-bold text-[#0A4833]"
              >
                Explore Wellness Hub
              </button>
            </section>

            <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
              <h2 className="text-lg font-bold text-[#0A4833]">Need Help?</h2>
              <div className="mt-4 space-y-3">
                {order.helpItems.map(({ label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex w-full items-center gap-2 text-left text-sm text-[#374151] hover:text-[#0A4833]"
                  >
                    <Icon className="h-4 w-4 text-[#6B7280]" />
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="flex items-center justify-center gap-3 rounded-xl border border-[#DFDFDF] bg-white px-5 py-5 text-center text-sm text-[#4B5563]">
          <Info className="h-4 w-4 shrink-0 text-[#A88751]" />
          <p>{order.notice}</p>
        </section>
      </div>
    </section>
  );
}

export type { OrderPlacedData };
