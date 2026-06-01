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
import { getImageUrl } from "@/lib/utils";

type ApiOrderDetail = {
  order_id: string;
  product_name: string;
  product_image?: string | null;
  pack_name: string;
  pack_price: string | number;
  quantity: number;
  subtotal: string | number;
  delivery_charge: string | number;
  total_amount: string | number;
  charged_currency?: string;
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
  updated_at?: string;
  gift_items?: GiftDisplayItem[];
};

type GiftDisplayItem = {
  name: string;
  image?: string | null;
  size?: string;
  quantity: number;
  price: string | number;
};

type ApiOrderListItem = {
  order_id: string;
};

type ApiCustomGiftDetail = {
  custom_gift_id: string;
  box_name: string;
  box_price: string | number;
  items: Array<{
    name?: string;
    image?: string | null;
    size?: string;
    price?: string | number;
    quantity?: number;
  }>;
  subtotal: string | number;
  delivery_charge: string | number;
  total_amount: string | number;
  charged_currency?: string;
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  postal_code?: string;
  address: string;
  message?: string;
  occasion?: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

type PaginatedResponse<T> = {
  results?: T[];
};

type ProgressStep = {
  label: string;
  status: "done" | "upcoming";
  Icon: LucideIcon;
};

const fallbackImage = "/product/p-1.webp";
const cardClass = "rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]";
const statusOrder = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

function toProductImageUrl(imagePath?: string | null): string {
  if (!imagePath) return fallbackImage;
  return getImageUrl(imagePath);
}

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "SAR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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

function normalizeStatus(value?: string): string {
  return String(value || "").toLowerCase().replace(/[_\s-]+/g, "_");
}

function getDisplayStatus(order?: ApiOrderDetail | null): string {
  if (!order) return "Confirmed";
  return toTitleCase(order.status);
}

function getPaymentStatus(order?: ApiOrderDetail | null): string {
  if (!order) return "Pay on Delivery";
  if (order.payment_method === "cod") return "Pay on Delivery";
  return toTitleCase(order.payment_status);
}

function getCompletedStepCount(status?: string): number {
  const normalized = normalizeStatus(status);
  if (!normalized || normalized === "pending" || normalized === "cancelled") return 0;
  const index = statusOrder.indexOf(normalized === "conformed" ? "confirmed" : normalized);
  return Math.max(0, index + 1);
}

function buildProgress(status?: string): ProgressStep[] {
  const completed = getCompletedStepCount(status);
  return [
    { label: "Confirmed", Icon: Check, status: completed >= 1 ? "done" : "upcoming" },
    { label: "Processing", Icon: ClipboardList, status: completed >= 2 ? "done" : "upcoming" },
    { label: "Shipped", Icon: PackageCheck, status: completed >= 3 ? "done" : "upcoming" },
    { label: "Out for Delivery", Icon: Truck, status: completed >= 4 ? "done" : "upcoming" },
    { label: "Delivered", Icon: MapPin, status: completed >= 5 ? "done" : "upcoming" },
  ];
}

function toList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

function mapCustomGiftOrder(order: ApiCustomGiftDetail): ApiOrderDetail {
  const quantity = order.items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0) || 1;
  const itemNames = order.items.map((item) => item.name).filter(Boolean).join(", ");
  return {
    order_id: order.custom_gift_id,
    product_name: itemNames ? `Custom Gift Box - ${itemNames}` : "Custom Gift Box",
    product_image: order.items[0]?.image ?? null,
    pack_name: order.box_name,
    pack_price: order.box_price,
    quantity,
    subtotal: order.subtotal,
    delivery_charge: order.delivery_charge,
    total_amount: order.total_amount,
    full_name: order.full_name,
    phone: order.phone,
    email: order.email ?? "",
    city: order.city ?? "",
    postal_code: order.postal_code ?? "",
    address: order.address,
    instructions: [order.occasion ? `Occasion: ${order.occasion}` : "", order.message ? `Message: ${order.message}` : ""]
      .filter(Boolean)
      .join(". "),
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    gift_items: order.items.map((item) => ({
      name: item.name || "Gift Box Product",
      image: item.image ?? null,
      size: item.size || "",
      quantity: item.quantity ?? 1,
      price: item.price ?? 0,
    })),
  };
}

export default function OrderPlacedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        setIsLoading(true);
        let selectedOrderId = orderId;

        if (!selectedOrderId) {
          const ordersResponse = await api.get<ApiOrderListItem[] | PaginatedResponse<ApiOrderListItem>>("/orders/");
          selectedOrderId = toList(ordersResponse.data)[0]?.order_id ?? null;
        }

        if (!selectedOrderId) {
          if (isMounted) setOrder(null);
          return;
        }

        if (selectedOrderId.startsWith("CG-")) {
          const response = await api.get<ApiCustomGiftDetail>(
            `/orders/custom-gifts/${encodeURIComponent(selectedOrderId)}/`
          );
          if (isMounted) setOrder(mapCustomGiftOrder(response.data));
          return;
        }

        const response = await api.get<ApiOrderDetail>(`/orders/${encodeURIComponent(selectedOrderId)}/`);
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
  const selectedOrderId = order?.order_id ?? orderId ?? "";
  const addressLines = useMemo(() => {
    if (!order) return ["Delivery address will appear here once the order loads."];
    return [order.address, `${order.city}${order.postal_code ? `, ${order.postal_code}` : ""}`].filter(Boolean);
  }, [order]);

  const productName = order?.product_name || "ZEWADI Buckwheat Product";
  const productImage = toProductImageUrl(order?.product_image);
  const packName = order?.pack_name || "Wellness Pack";
  const quantity = order?.quantity ?? 1;
  const giftItems = order?.gift_items ?? [];
  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.delivery_charge ?? 0;
  const total = order?.total_amount ?? 0;
  const currency = order?.charged_currency || "SAR";

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

              {giftItems.length > 0 ? (
                <div className="mt-5 space-y-3">
                  <div className="rounded-xl bg-[#EBE1CF] p-4">
                    <h3 className="text-base font-semibold leading-6 tracking-[-0.01em] text-[#1F2937]">
                      {packName}
                    </h3>
                    <p className="text-sm font-medium leading-5 tracking-[-0.01em] text-[#9F8151]">
                      Quantity: {quantity} products
                    </p>
                  </div>
                  {giftItems.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex flex-col gap-4 rounded-xl bg-[#F8F4EB] p-4 sm:flex-row sm:items-center">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={toProductImageUrl(item.image)} alt={item.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold leading-6 tracking-[-0.01em] text-[#1F2937]">
                          {item.name}
                        </h3>
                        <p className="text-sm leading-5 tracking-[-0.01em] text-[#4B5563]">{item.size || "Gift box item"}</p>
                        <p className="text-sm font-medium leading-5 tracking-[-0.01em] text-[#9F8151]">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-base font-semibold leading-6 tracking-[-0.01em] text-[#0A4833]">
                          {toCurrency(item.price, currency)}
                        </p>
                        <p className="text-sm leading-5 tracking-[-0.01em] text-[#6B7280]">each</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-4 rounded-xl bg-[#EBE1CF] p-4 sm:flex-row sm:items-center">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={productImage} alt={productName} fill sizes="64px" className="object-cover" />
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
                      {toCurrency(order?.pack_price ?? subtotal, currency)}
                    </p>
                    <p className="text-sm leading-5 tracking-[-0.01em] text-[#6B7280]">each</p>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3 border-t border-[#DFDFDF] pt-4">
                <SummaryRow label="Subtotal" value={toCurrency(subtotal, currency)} />
                <SummaryRow label="Shipping" value={toNumber(shipping) === 0 ? "Free" : toCurrency(shipping, currency)} />
                <div className="flex items-center justify-between gap-4 border-t border-[#DFDFDF] pt-4 text-lg font-semibold tracking-[-0.01em] text-[#0A4833]">
                  <span>{order?.payment_method === "cod" ? "Total Due" : "Total Paid"}</span>
                  <span>{toCurrency(total, currency)}</span>
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
                <ActionLink href={`/communityDashBoard/myorders/order-tracking?orderId=${encodeURIComponent(selectedOrderId)}`} label="Track Order" Icon={Truck} tone="primary" />
                <ActionLink href="/communityDashBoard/myorders" label="View My Orders" Icon={Receipt} tone="gold" />
                <ActionLink href="/communityDashBoard/products" label="Continue Shopping" Icon={ShoppingBag} tone="outline" />
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#0A4833]">Payment Details</h2>
              <div className="mt-4 space-y-3 text-base tracking-[-0.01em]">
                <SummaryRow label="Payment Method" value={order?.payment_method === "cod" ? "Cash on Delivery" : toTitleCase(order?.payment_method ?? "-")} />
                <SummaryRow label="Transaction ID" value={order?.payment_method === "cod" ? "Pending" : order?.order_id ?? "-"} small />
                <div className="flex items-center justify-between gap-4 border-t border-[#DFDFDF] pt-4 font-semibold text-[#0A4833]">
                  <span>{order?.payment_method === "cod" ? "Amount Due" : "Amount Paid"}</span>
                  <span>{toCurrency(total, currency)}</span>
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
