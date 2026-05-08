"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Check,
  CircleHelp,
  ClipboardList,
  Heart,
  Headset,
  MapPin,
  PackageCheck,
  Receipt,
  ShoppingBag,
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
};

type ProgressStep = {
  label: string;
  status: "done" | "upcoming";
  Icon: LucideIcon;
};

const fallbackImage = "/product/p-1.webp";
const cardClass = "rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]";
const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];

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

function toLongDate(value?: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toLongDateTime(value?: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function estimatedDelivery(value?: string): string {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return "-";
  parsed.setDate(parsed.getDate() + 3);
  return toLongDate(parsed.toISOString());
}

function toTitleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function getDisplayStatus(order?: ApiOrderDetail | null): string {
  if (!order) return "Confirmed";
  if (order.status === "pending") return "Confirmed";
  return toTitleCase(order.status);
}

function getPaymentStatus(order?: ApiOrderDetail | null): string {
  if (!order) return "Pay on Delivery";
  if (order.payment_method === "cod") return "Pay on Delivery";
  return toTitleCase(order.payment_status);
}

function getCompletedStepCount(status?: string): number {
  if (!status || status === "cancelled") return 2;
  const index = statusOrder.indexOf(status);
  return Math.max(2, index + 1);
}

function buildProgress(status?: string): ProgressStep[] {
  const completed = getCompletedStepCount(status);
  return [
    { label: "Confirmed", Icon: Check, status: completed >= 1 ? "done" : "upcoming" },
    { label: "Processing", Icon: ClipboardList, status: completed >= 2 ? "done" : "upcoming" },
    { label: "Packed", Icon: PackageCheck, status: completed >= 3 ? "done" : "upcoming" },
    { label: "Shipped", Icon: Truck, status: completed >= 4 ? "done" : "upcoming" },
    { label: "Delivered", Icon: MapPin, status: completed >= 5 ? "done" : "upcoming" },
  ];
}

export default function OrderPlacedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const selectedOrderId = orderId ?? "";
  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));
  const [loadError, setLoadError] = useState("");

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

  const progress = useMemo(() => buildProgress(order?.status), [order?.status]);
  const addressLines = useMemo(() => {
    if (!order) return ["Delivery address will appear here once the order loads."];
    return [order.address, `${order.city}${order.postal_code ? `, ${order.postal_code}` : ""}`].filter(Boolean);
  }, [order]);

  const productName = order?.product_name || "ZEWADI Buckwheat Product";
  const packName = order?.pack_name || "Wellness Pack";
  const quantity = order?.quantity ?? 1;
  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.delivery_charge ?? 0;
  const total = order?.total_amount ?? 0;

  if (!orderId && !isLoading) {
    return (
      <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-[720px] flex-col items-center justify-center rounded-2xl border border-[#DFDFDF] bg-white px-6 py-16 text-center shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <PackageCheck className="h-12 w-12 text-[#0A4833]" />
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[#0A4833]">No order selected</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#4B5563]">
            Open an order from My Orders or complete checkout to see the confirmation page.
          </p>
          <button
            type="button"
            onClick={() => router.push("/communityDashBorde/myorders")}
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
      <div className="mx-auto max-w-[1136px] space-y-6">
        <header className="rounded-2xl border border-[#DFDFDF] bg-white px-6 py-8 text-center shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0A4833] text-white">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-[30px] font-bold leading-9 tracking-[-0.02em] text-[#0A4833]">
            Order Placed Successfully!
          </h1>
          <p className="mx-auto mt-3 max-w-[672px] text-base leading-7 tracking-[-0.01em] text-[#4B5563] sm:text-lg">
            Your ZEWADI Buckwheat order has been confirmed and is now being processed. Thank you for choosing a
            healthier lifestyle with us.
          </p>
        </header>

        {loadError ? (
          <div className="rounded-2xl border border-[#F3D7D7] bg-[#FFF7F7] px-5 py-4 text-sm text-[#9B1C1C]">
            {loadError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,749px)_minmax(320px,363px)]">
          <main className="space-y-6">
            <section className={cardClass}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#0A4833]">Order Confirmation</h2>
                <span className="rounded-full bg-[#0A4833] px-4 py-1.5 text-sm font-medium text-white">
                  {getDisplayStatus(order)}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <DetailBlock label="Order ID" value={order?.order_id ? `#${order.order_id}` : isLoading ? "Loading..." : "-"} strong />
                <DetailBlock label="Estimated Delivery" value={order ? estimatedDelivery(order.created_at) : "-"} strong />
                <DetailBlock label="Order Date" value={order ? toLongDateTime(order.created_at) : "-"} />
                <DetailBlock label="Delivery Address" value={addressLines} />
                <DetailBlock label="Payment Status" value={getPaymentStatus(order)} strong />
                <DetailBlock label="Contact" value={order?.phone || "-"} />
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#0A4833]">Ordered Products</h2>

              <div className="mt-5 flex flex-col gap-4 rounded-xl bg-[#EBE1CF] p-4 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image src={fallbackImage} alt={productName} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold leading-6 tracking-[-0.01em] text-[#1F2937]">
                    {productName}
                  </h3>
                  <p className="text-sm leading-5 tracking-[-0.01em] text-[#4B5563]">{packName}</p>
                  <p className="text-sm font-medium leading-5 tracking-[-0.01em] text-[#9F8151]">Quantity: {quantity}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-base font-semibold leading-6 tracking-[-0.01em] text-[#0A4833]">
                    {toCurrency(order?.pack_price ?? subtotal)}
                  </p>
                  <p className="text-sm leading-5 tracking-[-0.01em] text-[#6B7280]">each</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-[#DFDFDF] pt-4">
                <SummaryRow label="Subtotal" value={toCurrency(subtotal)} />
                <SummaryRow label="Shipping" value={toNumber(shipping) === 0 ? "Free" : toCurrency(shipping)} />
                <div className="flex items-center justify-between gap-4 border-t border-[#DFDFDF] pt-4 text-lg font-semibold tracking-[-0.01em] text-[#0A4833]">
                  <span>{order?.payment_method === "cod" ? "Total Due" : "Total Paid"}</span>
                  <span>{toCurrency(total)}</span>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#0A4833]">Delivery Progress</h2>
              <div className="mt-6 grid grid-cols-5 items-start gap-2">
                {progress.map((step, index) => {
                  const done = step.status === "done";
                  const Icon = step.Icon;
                  return (
                    <div key={step.label} className="relative flex flex-col items-center gap-2 text-center">
                      {index < progress.length - 1 ? (
                        <span
                          className={`absolute left-[calc(50%+22px)] top-4 h-0.5 w-[calc(100%-18px)] ${
                            progress[index + 1].status === "done" ? "bg-[#0A4833]" : "bg-[#DFDFDF]"
                          }`}
                        />
                      ) : null}
                      <span
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                          done ? "bg-[#0A4833] text-white" : "bg-[#DFDFDF] text-[#9CA3AF]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className={`text-xs font-medium tracking-[-0.01em] ${done ? "text-[#0A4833]" : "text-[#9CA3AF]"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className={cardClass}>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#0A4833]">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <ActionLink href={`/communityDashBorde/myorders/order-tracking?orderId=${encodeURIComponent(selectedOrderId)}`} label="Track Order" Icon={Truck} tone="primary" />
                <ActionLink href="/communityDashBorde/myorders" label="View My Orders" Icon={Receipt} tone="gold" />
                <ActionLink href="/communityDashBorde/products" label="Continue Shopping" Icon={ShoppingBag} tone="outline" />
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#0A4833]">Payment Details</h2>
              <div className="mt-4 space-y-3 text-base tracking-[-0.01em]">
                <SummaryRow label="Payment Method" value={order?.payment_method === "cod" ? "Cash on Delivery" : toTitleCase(order?.payment_method ?? "-")} />
                <SummaryRow label="Transaction ID" value={order?.payment_method === "cod" ? "Pending" : order?.order_id ?? "-"} small />
                <div className="flex items-center justify-between gap-4 border-t border-[#DFDFDF] pt-4 font-semibold text-[#0A4833]">
                  <span>{order?.payment_method === "cod" ? "Amount Due" : "Amount Paid"}</span>
                  <span>{toCurrency(total)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#DFDFDF] bg-gradient-to-br from-[#EBE1CF] to-white p-6 text-center shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <Heart className="mx-auto h-6 w-6 fill-[#0A4833] text-[#0A4833]" />
              <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#0A4833]">Your Wellness Journey</h2>
              <p className="mt-2 text-sm leading-5 tracking-[-0.01em] text-[#4B5563]">
                Discover recipes, diet plans, and community wellness tips while you wait for your order.
              </p>
              <Link href="/recipes" className="mt-4 inline-flex text-sm font-medium tracking-[-0.01em] text-[#0A4833]">
                Explore Wellness Hub
              </Link>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#0A4833]">Need Help?</h2>
              <div className="mt-4 space-y-3">
                <HelpItem Icon={Headset} label="Contact Support" />
                <HelpItem Icon={CircleHelp} label="Order FAQ" />
                <HelpItem Icon={Truck} label="Delivery Info" />
              </div>
            </section>
          </aside>
        </div>

        <footer className="flex items-start gap-4 rounded-2xl border border-[#DFDFDF] bg-white px-6 py-6 text-center shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:items-center sm:justify-center">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#0A4833] sm:mt-0" />
          <p className="text-sm leading-6 tracking-[-0.01em] text-[#4B5563] sm:text-base">
            You will receive updates about your order in Notifications and My Orders. A confirmation email has been sent
            to your registered email address.
          </p>
        </footer>
      </div>
    </section>
  );
}

function DetailBlock({ label, value, strong = false }: { label: string; value: string | string[]; strong?: boolean }) {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div>
      <p className="text-sm font-medium leading-[17px] tracking-[-0.01em] text-[#6B7280]">{label}</p>
      <div className={`mt-1.5 text-base leading-6 tracking-[-0.01em] ${strong ? "font-semibold text-[#0A4833]" : "text-[#374151]"}`}>
        {values.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#4B5563]">{label}</span>
      <span className={`text-right font-medium text-black ${small ? "text-xs" : "text-base"}`}>{value}</span>
    </div>
  );
}

function ActionLink({ href, label, Icon, tone }: { href: string; label: string; Icon: LucideIcon; tone: "primary" | "gold" | "outline" }) {
  const className =
    tone === "primary"
      ? "bg-[#0A4833] text-white hover:bg-[#083B2A]"
      : tone === "gold"
        ? "bg-[#9F8151] text-white hover:bg-[#8A7149]"
        : "border border-[#0A4833] bg-white text-[#0A4833] hover:bg-[#F8F3E9]";

  return (
    <Link href={href} className={`flex h-12 items-center justify-center gap-2 rounded-lg text-base font-medium tracking-[-0.01em] transition-colors ${className}`}>
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function HelpItem({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <div className="flex h-6 items-center gap-3 text-sm tracking-[-0.01em] text-[#4B5563]">
      <Icon className="h-4 w-4 text-[#0A4833]" />
      <span>{label}</span>
    </div>
  );
}
