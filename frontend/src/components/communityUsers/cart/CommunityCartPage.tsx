"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Lock,
  Package,
  Plus,
  Minus,
  Trash2,
  Truck,
} from "lucide-react";
import api from "@/services/api";

type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  short_description: string;
  health_benefits?: string | null;
  image?: string | null;
  currency: string;
  stock_quantity: number;
  stock_status: string;
  variant_name?: string | null;
  variant_stock?: number | null;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  free_shipping_unlocked: boolean;
};

type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

const emptySummary: CartSummary = {
  item_count: 0,
  subtotal: "0.00",
  shipping: "0.00",
  tax: "0.00",
  total: "0.00",
  free_shipping_unlocked: false,
};

const fallbackImages = [
  "/product/p-1.webp",
  "/product/p-2.webp",
  "/product/p-4.webp",
  "/product/p-main.webp",
];

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  } catch {
    return `$${toNumber(value).toFixed(2)}`;
  }
}

function toImageUrl(imagePath: string | null | undefined, index: number): string {
  if (!imagePath) return fallbackImages[index % fallbackImages.length];
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function stockLabel(item: CartItem): { text: string; className: string } {
  const hasVariantStock = item.variant_stock !== null && item.variant_stock !== undefined;
  const stock = hasVariantStock ? item.variant_stock ?? 0 : item.stock_quantity;
  if ((!hasVariantStock && item.stock_status === "out_of_stock") || stock <= 0) {
    return { text: "Out of stock", className: "text-red-600" };
  }
  if (stock <= 3) {
    return { text: `Only ${stock} left`, className: "text-[#EA580C]" };
  }
  return { text: "In Stock", className: "text-[#16A34A]" };
}

export default function CommunityCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  const currency = items[0]?.currency ?? "USD";
  const itemLabel = useMemo(() => {
    const count = summary.item_count;
    return `${count} ${count === 1 ? "Item" : "Items"} in Cart`;
  }, [summary.item_count]);

  async function loadCart() {
    try {
      const response = await api.get<CartResponse>("/orders/cart/");
      setItems(response.data.items);
      setSummary(response.data.summary);
      setStatusMessage("");
    } catch {
      setStatusMessage("Unable to load your cart right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function updateQuantity(item: CartItem, nextQuantity: number) {
    if (nextQuantity < 1) return;
    setBusyItemId(item.id);
    try {
      const response = await api.patch<CartResponse>(`/orders/cart/items/${item.id}/`, {
        quantity: nextQuantity,
      });
      setItems(response.data.items);
      setSummary(response.data.summary);
    } catch {
      setStatusMessage("Unable to update this cart item.");
    } finally {
      setBusyItemId(null);
    }
  }

  async function removeItem(itemId: number) {
    setBusyItemId(itemId);
    try {
      const response = await api.delete<CartResponse>(`/orders/cart/items/${itemId}/`);
      setItems(response.data.items);
      setSummary(response.data.summary);
    } catch {
      setStatusMessage("Unable to remove this cart item.");
    } finally {
      setBusyItemId(null);
    }
  }

  function applyPromo() {
    setStatusMessage(
      promoCode.trim()
        ? "Promo validation is not available for this code yet."
        : "Enter a promo code to apply it."
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 gap-5 lg:grid-cols-[minmax(0,728px)_384px]">
        <div className="rounded-2xl border border-[#DFDFDF] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold leading-7 text-[#0A4833]">Your Cart</h1>
              <p className="mt-2 max-w-[460px] text-sm leading-6 text-[#4B5563] sm:text-base">
                Review your selected wellness products before proceeding to checkout.
              </p>
            </div>
            <div className="w-fit rounded-lg bg-[#9F8151]/10 px-4 py-2 text-sm font-medium leading-6 text-[#9F8151]">
              {itemLabel}
            </div>
          </header>

          <div className="mt-5 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[170px] animate-pulse rounded-xl border border-[#DFDFDF] bg-white p-6">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-xl bg-[#F3F4F6]" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-48 rounded bg-[#F3F4F6]" />
                      <div className="h-4 w-full rounded bg-[#F3F4F6]" />
                      <div className="h-4 w-40 rounded bg-[#F3F4F6]" />
                    </div>
                  </div>
                </div>
              ))
            ) : items.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#DFDFDF] bg-[#F9FAFB] px-6 text-center">
                <Package className="h-10 w-10 text-[#0A4833]" />
                <h2 className="mt-4 text-lg font-semibold text-[#111827]">Your cart is empty</h2>
                <p className="mt-1 max-w-md text-sm text-[#6B7280]">
                  Add products from the community catalog to start your checkout.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/communityDashBorde/products")}
                  className="mt-5 rounded-lg bg-[#0A4833] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const stock = stockLabel(item);
                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[#DFDFDF] bg-white p-4 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
                        <Image
                          src={toImageUrl(item.image, index)}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                          <div className="max-w-[380px]">
                            <h2 className="text-base font-semibold leading-6 text-[#0A4833]">
                              {item.product_name}
                            </h2>
                            <p className="mt-2 text-sm leading-5 text-[#4B5563]">
                              {item.short_description}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded bg-[#0A4833]/10 px-2 py-1 text-xs text-[#0A4833]">
                                {item.variant_name || "Standard Pack"}
                              </span>
                              <span className={`text-xs ${stock.className}`}>{stock.text}</span>
                            </div>
                            {item.health_benefits ? (
                              <p className="mt-3 line-clamp-1 text-xs text-[#6B7280]">
                                {item.health_benefits}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                            <div className="text-left sm:text-right">
                              <p className="max-w-14 text-base font-semibold leading-6 text-[#9F8151] sm:max-w-[64px]">
                                {toCurrency(item.unit_price, item.currency)}
                              </p>
                              <p className="text-sm leading-5 text-[#6B7280]">per item</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                disabled={busyItemId === item.id || item.quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFDFDF] text-[#374151] disabled:opacity-50"
                                aria-label={`Decrease ${item.product_name} quantity`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="flex h-8 w-12 items-center justify-center rounded-lg border border-[#DFDFDF] text-base font-medium text-black">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                disabled={busyItemId === item.id}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFDFDF] text-[#374151] disabled:opacity-50"
                                aria-label={`Increase ${item.product_name} quantity`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-base font-semibold text-[#0A4833]">
                              {toCurrency(item.line_total, item.currency)}
                            </p>

                            <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                              <button type="button" className="inline-flex items-center gap-1 hover:text-[#0A4833]">
                                <Heart className="h-3.5 w-3.5" />
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={busyItemId === item.id}
                                className="inline-flex items-center gap-1 hover:text-red-600 disabled:opacity-60"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-[#DFDFDF] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-6">
          <h2 className="text-lg font-semibold leading-7 text-[#0A4833]">Order Summary</h2>
          <div className="mt-6 space-y-3">
            <SummaryRow label={`Subtotal (${summary.item_count} ${summary.item_count === 1 ? "item" : "items"})`} value={toCurrency(summary.subtotal, currency)} />
            <SummaryRow
              label="Shipping"
              value={toNumber(summary.shipping) === 0 ? "Free" : toCurrency(summary.shipping, currency)}
              valueClass={toNumber(summary.shipping) === 0 ? "text-[#16A34A]" : undefined}
            />
            <SummaryRow label="Tax" value={toCurrency(summary.tax, currency)} />
            <div className="border-t border-[#DFDFDF] pt-3">
              <SummaryRow
                label="Total"
                value={toCurrency(summary.total, currency)}
                labelClass="text-[#0A4833] font-semibold"
                valueClass="text-[#9F8151] font-semibold"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <input
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="Promo code"
              className="h-[42px] min-w-0 flex-1 rounded-lg border border-[#DFDFDF] px-3 text-sm outline-none focus:border-[#0A4833]"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="rounded-lg bg-[#9F8151] px-4 text-sm font-medium text-white"
            >
              Apply
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/communityDashBorde/myorders/order?cart=1")}
              disabled={items.length === 0}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A4833] text-sm font-semibold text-white transition hover:bg-[#073826] disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
            >
              <Lock className="h-4 w-4" />
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => router.push("/communityDashBorde/products")}
              className="h-12 w-full rounded-xl border border-[#DFDFDF] text-sm font-medium text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-5 rounded-lg bg-[#EBE1CF] p-4">
            <div className="flex gap-3">
              <Truck className="mt-1 h-5 w-5 shrink-0 text-[#0A4833]" />
              <div>
                <h3 className="text-sm font-medium text-[#0A4833]">
                  {summary.free_shipping_unlocked ? "Free Delivery Unlocked!" : "Free Delivery Available"}
                </h3>
                <p className="mt-1 text-xs leading-4 text-[#4B5563]">
                  {summary.free_shipping_unlocked
                    ? "Your order qualifies for free standard delivery (3-5 business days)"
                    : "Spend $50.00 to qualify for free standard delivery."}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-4 text-[#6B7280]">
            Carefully curated wellness products for your healthier lifestyle.
          </p>

          {statusMessage ? (
            <div className="mt-4 rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6B7280]">
              {statusMessage}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  labelClass = "text-[#4B5563]",
  valueClass = "text-black",
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-base leading-6">
      <span className={labelClass}>{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
