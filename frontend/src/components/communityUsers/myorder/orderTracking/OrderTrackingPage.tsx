"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Download,
  Headset,
  Heart,
  Home,
  PackageCheck,
  RefreshCw,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "@/services/api";

type ApiOrderDetail = {
  order_id: string;
  product_name: string;
  pack_name: string;
  pack_price: string | number;
  quantity: number;
  subtotal: string | number;
  delivery_charge: string | number;
  total_amount: string | number;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string;
  address: string;
  instructions?: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type TimelineStep = {
  title: string;
  description: string;
  date?: string;
  Icon: LucideIcon;
};

type StepState = "completed" | "current" | "upcoming";

const cardClass = "rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]";
const fallbackImage = "/product/p-1.webp";

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function toShortDate(value?: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toShortDateTime(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function addDays(value: string | undefined, days: number): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString();
}

function toTitleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function activeStepIndex(status?: string): number {
  const normalized = (status || "pending").toLowerCase();
  if (normalized === "delivered") return 6;
  if (normalized === "shipped") return 4;
  if (normalized === "processing") return 2;
  if (normalized === "confirmed") return 1;
  if (normalized === "pending") return 0;
  if (normalized === "cancelled") return 1;
  return 0;
}

function getStepState(index: number, activeIndex: number): StepState {
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "current";
  return "upcoming";
}

function getStatusLabel(order?: ApiOrderDetail | null): string {
  if (!order) return "Loading";
  if (order.status === "pending") return "Order Placed";
  if (order.status === "shipped") return "In Transit";
  return toTitleCase(order.status);
}

function getPaymentLabel(order?: ApiOrderDetail | null): string {
  if (!order) return "-";
  if (order.payment_method === "cod") return "Cash on Delivery";
  return toTitleCase(order.payment_status);
}

function buildTimeline(order?: ApiOrderDetail | null): TimelineStep[] {
  const createdAt = order?.created_at;
  return [
    {
      title: "Order Placed",
      description: "Your order has been successfully placed",
      date: toShortDateTime(createdAt),
      Icon: Check,
    },
    {
      title: "Order Confirmed",
      description: order?.payment_method === "cod" ? "Cash on delivery order confirmed" : "Payment verified and order confirmed",
      date: toShortDateTime(addDays(createdAt, 0)),
      Icon: Check,
    },
    {
      title: "Processing",
      description: "Your wellness essentials are being prepared",
      date: toShortDateTime(addDays(createdAt, 1)),
      Icon: Check,
    },
    {
      title: "Packed",
      description: "Order securely packed and ready for shipment",
      date: toShortDateTime(addDays(createdAt, 1)),
      Icon: Check,
    },
    {
      title: "In Transit",
      description: "Your package is on the way to you",
      date: toShortDateTime(addDays(createdAt, 2)),
      Icon: Truck,
    },
    {
      title: "Out for Delivery",
      description: "Package will be delivered today",
      Icon: Truck,
    },
    {
      title: "Delivered",
      description: "Package successfully delivered",
      Icon: Home,
    },
  ];
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));
  const [loadError, setLoadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get<ApiOrderDetail>(`/orders/${encodeURIComponent(orderId)}/`);
        if (isMounted) setOrder(response.data);
      } catch {
        if (isMounted) setLoadError("We could not load this order right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const timeline = useMemo(() => buildTimeline(order), [order]);
  const currentIndex = activeStepIndex(order?.status);
  const expectedDate = toShortDate(addDays(order?.created_at, 5));
  const productName = order?.product_name || "ZEWADI Buckwheat Product";
  const packName = order?.pack_name || "Wellness Pack";
  const quantity = order?.quantity ?? 1;
  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.delivery_charge ?? 0;
  const total = order?.total_amount ?? 0;
  const addressLines = order
    ? [order.address, `${order.city}${order.postal_code ? `, ${order.postal_code}` : ""}`].filter(Boolean)
    : ["Delivery address will appear here once the order loads."];

  if (!orderId && !isLoading) {
    return (
      <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-[720px] flex-col items-center justify-center rounded-xl border border-[#DFDFDF] bg-white px-6 py-16 text-center shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <PackageCheck className="h-12 w-12 text-[#0A4833]" />
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[#0A4833]">No order selected</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#4B5563]">
            Open an order from My Orders to track its delivery progress.
          </p>
          <button
            type="button"
            onClick={() => router.push("/communityDashBoard/myorders")}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[#0A4833] px-6 text-sm font-medium text-white"
          >
            View My Orders
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1136px] space-y-8">
        <header>
          <h1 className="text-2xl font-bold leading-8 tracking-[-0.02em] text-[#0A4833]">Track Your Order</h1>
          <p className="mt-2 text-base leading-6 tracking-[-0.02em] text-[#4B5563]">
            Stay updated with your ZEWADI Buckwheat delivery and order progress.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm tracking-[-0.02em]">
            <span className="text-[#6B7280]">Order #{order?.order_id || (isLoading ? "Loading..." : "-")}</span>
            {order ? (
              <span className="rounded-full bg-[#0A4833] px-3 py-1 text-xs font-medium text-white">{getStatusLabel(order)}</span>
            ) : null}
          </div>
        </header>

        {loadError ? (
          <div className="rounded-xl border border-[#F3D7D7] bg-[#FFF7F7] px-5 py-4 text-sm text-[#9B1C1C]">{loadError}</div>
        ) : null}

        {statusMessage ? (
          <div className="rounded-xl border border-[#DFDFDF] bg-[#F9FAFB] px-5 py-4 text-sm text-[#4B5563]">{statusMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,747px)_minmax(320px,357px)]">
          <main className="space-y-6">
            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Order Summary</h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EBE1CF] p-2">
                  <Image src={fallbackImage} alt={productName} fill sizes="96px" className="object-cover p-2" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium leading-6 tracking-[-0.02em] text-[#0A4833]">{productName}</h3>
                  <p className="text-sm leading-5 tracking-[-0.02em] text-[#4B5563]">{packName}</p>
                  <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <InlineMeta label="Quantity:" value={`${quantity} pack${quantity === 1 ? "" : "s"}`} />
                    <InlineMeta label="Order Date:" value={order ? toShortDate(order.created_at) : "-"} />
                    <InlineMeta label="Payment:" value={getPaymentLabel(order)} valueClass="text-[#16A34A]" />
                    <InlineMeta label="Expected:" value={expectedDate} />
                  </div>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Delivery Progress</h2>
              <div className="relative mt-5 space-y-6">
                <span className="absolute bottom-7 left-6 top-7 w-0.5 bg-[#DFDFDF]" />
                {timeline.map((step, index) => {
                  const state = getStepState(index, currentIndex);
                  const Icon = step.Icon;
                  return (
                    <div key={step.title} className="relative flex gap-4">
                      <span
                        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                          state === "completed"
                            ? "bg-[#0A4833] text-white"
                            : state === "current"
                              ? "bg-[#9F8151] text-white"
                              : "bg-[#DFDFDF] text-[#9CA3AF]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className={`pt-2 tracking-[-0.02em] ${state === "upcoming" ? "text-[#9CA3AF]" : "text-[#0A4833]"}`}>
                        <h3 className="text-base font-medium leading-6">{step.title}</h3>
                        <p className={`text-sm leading-5 ${state === "upcoming" ? "text-[#9CA3AF]" : "text-[#4B5563]"}`}>{step.description}</p>
                        {step.date ? <p className="mt-1 text-xs leading-4 text-[#6B7280]">{step.date}</p> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Live Delivery Status</h2>
              <div className="mt-4 rounded-lg bg-[#EBE1CF] p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#9F8151]" />
                  <h3 className="text-base font-medium tracking-[-0.02em] text-[#0A4833]">
                    {order?.status === "delivered" ? "Package delivered" : "Package in transit"}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-5 tracking-[-0.02em] text-[#4B5563]">
                  Your ZEWADI wellness essentials are currently traveling to your location via our trusted delivery partner.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm tracking-[-0.02em] sm:grid-cols-2">
                  <InlineMeta label="Courier:" value="Express Wellness Delivery" />
                  <InlineMeta label="Tracking ID:" value={order?.order_id ? `EWD-${order.order_id}` : "-"} />
                  <InlineMeta label="Last Update:" value={order ? toShortDateTime(order.updated_at || order.created_at) : "-"} />
                  <InlineMeta label="Expected Window:" value="Today 2-6 PM" />
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Delivery Address</h2>
              <div className="mt-4 space-y-3 text-sm tracking-[-0.02em]">
                <div>
                  <p className="text-base font-medium leading-6 text-[#111827]">{order?.full_name || "-"}</p>
                  <p className="leading-5 text-[#4B5563]">{order?.phone || "-"}</p>
                </div>
                <div className="space-y-1 leading-5 text-[#4B5563]">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="border-t border-[#DFDFDF] pt-3 text-xs leading-4 text-[#6B7280]">
                  Delivery Note: {order?.instructions?.trim() || "No special instructions"}
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Order Details</h2>
              <div className="mt-4 space-y-3 text-sm tracking-[-0.02em]">
                <SummaryRow label={`${productName} (${quantity}x)`} value={toCurrency(subtotal)} />
                <SummaryRow label="Shipping" value={toNumber(shipping) === 0 ? "Free" : toCurrency(shipping)} />
                <div className="flex items-center justify-between border-t border-[#DFDFDF] pt-4 text-base font-semibold text-[#0A4833]">
                  <span>{order?.payment_method === "cod" ? "Total Due" : "Total Paid"}</span>
                  <span>{toCurrency(total)}</span>
                </div>
                <p className="text-xs leading-4 text-[#6B7280]">
                  Payment Method: <span className="font-medium">{getPaymentLabel(order)}</span>
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">Need Help?</h2>
              <div className="mt-4 space-y-3">
                <HelpButton Icon={Headset} label="Contact Support" onClick={() => setStatusMessage("Support contact flow is not available in the MVP.")} />
                <HelpButton Icon={AlertTriangle} label="Report Issue" onClick={() => setStatusMessage("Issue reporting is not available in the MVP.")} />
                <HelpButton Icon={Download} label="Download Invoice" onClick={() => setStatusMessage("Invoice download is not available in the MVP.")} />
                <HelpButton Icon={RefreshCw} label="Reorder" onClick={() => router.push("/communityDashBoard/products")} />
              </div>
            </section>

            <section className="rounded-xl bg-[#0A4833] p-6 text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <div className="flex gap-4">
                <Heart className="mt-1 h-5 w-5 shrink-0 fill-white text-white" />
                <div>
                  <h2 className="text-base font-semibold leading-6 tracking-[-0.02em]">
                    Your wellness essentials are on the way!
                  </h2>
                  <p className="mt-3 text-sm leading-5 tracking-[-0.02em] text-white/90">
                    While you wait, explore healthy recipes and nutrition tips from our wellness community.
                  </p>
                  <Link href="/recipes" className="mt-4 inline-flex text-sm font-medium underline underline-offset-4">
                    Browse Recipes
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InlineMeta({ label, value, valueClass = "text-black" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex min-w-0 gap-2">
      <span className="shrink-0 text-[#6B7280]">{label}</span>
      <span className={`min-w-0 truncate font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="min-w-0 truncate text-[#4B5563]">{label}</span>
      <span className="shrink-0 font-medium text-black">{value}</span>
    </div>
  );
}

function HelpButton({ Icon, label, onClick }: { Icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[50px] w-full items-center gap-3 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium tracking-[-0.02em] text-black transition-colors hover:bg-[#F8F3E9]"
    >
      <Icon className="h-4 w-4 text-[#0A4833]" />
      {label}
    </button>
  );
}
