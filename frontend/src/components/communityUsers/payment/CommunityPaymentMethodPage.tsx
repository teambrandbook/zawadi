"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CreditCard,
  Lock,
  Package,
  TicketPercent,
  Truck,
} from "lucide-react";
import api from "@/services/api";

type DeliveryPayload = {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string;
  address: string;
  instructions: string;
};

type SingleCheckoutSession = {
  mode: "single";
  item: {
    productId: number;
    variantId?: number | null;
    productName: string;
    productImage?: string | null;
    packName: string;
    quantity: number;
    subtotal: string;
    deliveryCharge: string;
    totalAmount: string;
  };
  order: DeliveryPayload & {
    product_id: number;
    variant_id?: number | null;
    product_name: string;
    pack_name: string;
    pack_price: string;
    quantity: number;
    subtotal: string;
    delivery_charge: string;
    total_amount: string;
    payment_method: "cod";
  };
};

type CartCheckoutSession = {
  mode: "cart";
  delivery: DeliveryPayload;
};

type CheckoutSession = SingleCheckoutSession | CartCheckoutSession;

type CartItem = {
  id: number;
  product_name: string;
  image?: string | null;
  variant_name?: string | null;
  quantity: number;
  line_total: string | number;
  currency: string;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
};

type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

type DisplayItem = {
  name: string;
  image?: string | null;
  quantity: number;
  price: string | number;
  subtitle: string;
};

const fallbackImage = "/product/p-1.webp";

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

function toImageUrl(imagePath?: string | null): string {
  if (!imagePath) return fallbackImage;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function readCheckoutSession(): CheckoutSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem("zewadi_checkout");
    return value ? (JSON.parse(value) as CheckoutSession) : null;
  } catch {
    return null;
  }
}

export default function CommunityPaymentMethodPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const session = readCheckoutSession();
    setCheckout(session);

    async function loadCart() {
      if (!session || session.mode !== "cart") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<CartResponse>("/orders/cart/");
        if (!isMounted) return;
        setCartItems(response.data.items);
        setCartSummary(response.data.summary);
      } catch {
        if (isMounted) setStatusMessage("Unable to load your cart summary.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (!checkout) {
      return { subtotal: "0.00", shipping: "0.00", tax: "0.00", total: "0.00", itemCount: 0 };
    }

    if (checkout.mode === "single") {
      return {
        subtotal: checkout.item.subtotal,
        shipping: checkout.item.deliveryCharge,
        tax: "0.00",
        total: checkout.item.totalAmount,
        itemCount: checkout.item.quantity,
      };
    }

    return {
      subtotal: cartSummary?.subtotal ?? "0.00",
      shipping: cartSummary?.shipping ?? "0.00",
      tax: cartSummary?.tax ?? "0.00",
      total: cartSummary?.total ?? "0.00",
      itemCount: cartSummary?.item_count ?? 0,
    };
  }, [cartSummary, checkout]);

  const displayItem = useMemo<DisplayItem | null>(() => {
    if (!checkout) return null;
    if (checkout.mode === "single") {
      return {
        name: checkout.item.productName,
        image: checkout.item.productImage,
        quantity: checkout.item.quantity,
        price: checkout.item.totalAmount,
        subtitle: checkout.item.packName,
      };
    }

    const firstCartItem = cartItems[0];
    if (!firstCartItem) return null;
    return {
      name: firstCartItem.product_name,
      image: firstCartItem.image,
      quantity: firstCartItem.quantity,
      price: firstCartItem.line_total,
      subtitle: firstCartItem.variant_name || "Standard Pack",
    };
  }, [cartItems, checkout]);

  const currency = checkout?.mode === "cart"
    ? cartItems[0]?.currency ?? "USD"
    : "USD";

  async function completeCodOrder() {
    if (!checkout) {
      setStatusMessage("Start checkout before choosing payment.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Confirming cash on delivery order...");
    try {
      if (checkout.mode === "cart") {
        const response = await api.post<{ primary_order_id?: string; order_ids?: string[] }>(
          "/orders/cart/checkout/",
          {
            ...checkout.delivery,
            payment_method: "cod",
          }
        );
        const createdOrderId = response.data?.primary_order_id ?? response.data?.order_ids?.[0];
        sessionStorage.removeItem("zewadi_checkout");
        router.push(
          createdOrderId
            ? `/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(createdOrderId)}`
            : "/communityDashBoard/myorders/order-placed"
        );
        return;
      }

      const response = await api.post<{ order_id?: string }>("/orders/create/", {
        ...checkout.order,
        payment_method: "cod",
      });
      sessionStorage.removeItem("zewadi_checkout");
      router.push(
        response.data?.order_id
          ? `/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(response.data.order_id)}`
          : "/communityDashBoard/myorders/order-placed"
      );
    } catch (error: unknown) {
      const detail =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail === "string"
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
            ?? "Unable to complete this order."
          : "Unable to complete this order.";
      setStatusMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  }

  function applyPromo() {
    setStatusMessage(
      promoCode.trim()
        ? "Promo code validation is not available in the MVP checkout."
        : "Enter a promo code to apply it."
    );
  }

  if (!checkout && !isLoading) {
    return (
      <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-[720px] flex-col items-center justify-center rounded-3xl border border-[#DFDFDF] bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Package className="h-10 w-10 text-[#0A4833]" />
          <h1 className="mt-4 text-xl font-semibold text-[#1F2124]">No checkout in progress</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
            Add products to your cart or start an order before choosing a payment method.
          </p>
          <button
            type="button"
            onClick={() => router.push("/communityDashBoard/cart")}
            className="mt-6 rounded-xl bg-[#0A4833] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Cart
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,800px)_392px]">
        <div className="space-y-5">
          <h1 className="text-xl font-semibold leading-7 text-[#1F2124]">Payment Method</h1>

          <div className="rounded-3xl border border-[#DFDFDF] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex min-h-[58px] items-center justify-center gap-3 rounded-xl border-2 border-[#9F8151] bg-[#F9FAFB] px-4 py-4 text-sm font-medium text-[#1F2124]"
              >
                <Banknote className="h-5 w-5 text-[#0D6E2E]" />
                Cash on Delivery
              </button>
              <button
                type="button"
                disabled
                className="flex min-h-[58px] cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-[#DFDFDF] bg-white px-4 py-4 text-sm font-medium text-[#6B7280] opacity-60"
              >
                <CreditCard className="h-5 w-5 text-[#9F8151]" />
                Online Payment
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-[#DFDFDF] bg-[#F9FAFB] p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0D6E2E] text-white">
                  <Banknote className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#0A4833]">Cash on Delivery selected</h2>
                  <p className="mt-1 text-sm leading-6 text-[#4B5563]">
                    Pay the courier when your ZEWADI order arrives. Online gateways are intentionally disabled for the MVP and can be added in the next phase.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoCard icon={<Truck className="h-4 w-4" />} title="Standard Delivery" text="3-5 business days" />
              <InfoCard icon={<BadgeCheck className="h-4 w-4" />} title="COD Only" text="No card details needed" />
              <InfoCard icon={<Lock className="h-4 w-4" />} title="Order Review" text="Confirm before dispatch" />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#F3F4F6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
            <h2 className="text-2xl font-bold leading-9 text-[#1F4D3A]">Order Summary</h2>

            <div className="mt-6 space-y-4 border-b border-[#F3F4F6] pb-6">
              <SummaryRow label="Subtotal" value={toCurrency(summary.subtotal, currency)} />
              <SummaryRow
                label="Shipping"
                value={toNumber(summary.shipping) === 0 ? "Free" : toCurrency(summary.shipping, currency)}
              />
              <SummaryRow label="Estimated Tax" value={toCurrency(summary.tax, currency)} />
            </div>

            <div className="mt-5 flex items-center justify-between py-2">
              <span className="text-lg font-bold text-[#1F4D3A]">Total</span>
              <span className="text-3xl font-bold text-[#1F4D3A]">{toCurrency(summary.total, currency)}</span>
            </div>

            <div className="mt-6 flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2">
              <input
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Promo code"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#1F2124] outline-none placeholder:text-[#9CA3AF]"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#1F4D3A] px-4 text-sm font-semibold text-white"
              >
                <TicketPercent className="h-3.5 w-3.5" />
                Apply
              </button>
            </div>

            <button
              type="button"
              onClick={completeCodOrder}
              disabled={isSubmitting || isLoading}
              className="mt-7 inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1F4D3A] text-lg font-bold text-white transition hover:bg-[#173B2C] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Completing Order..." : "Confirm COD Order"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#6B7280]">
              Payment gateway integration is reserved for the next phase.
            </p>
          </div>

          {displayItem ? (
            <div className="flex items-center gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-4 opacity-90">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F9FAFB]">
                <Image src={toImageUrl(displayItem.image)} alt={displayItem.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-[#1F4D3A]">{displayItem.name}</h3>
                <p className="text-xs text-[#6B7280]">Quantity: {summary.itemCount}</p>
              </div>
              <span className="text-sm font-bold text-[#1F4D3A]">{toCurrency(displayItem.price, currency)}</span>
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
              {statusMessage}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-base text-[#4B5563]">{label}</span>
      <span className="text-base font-semibold text-[#1F4D3A]">{value}</span>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2 text-[#0A4833]">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-1 text-xs text-[#6B7280]">{text}</p>
    </div>
  );
}
