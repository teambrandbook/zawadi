"use client";

import Image from "next/image";
import { Truck, CircleDollarSign } from "lucide-react";
import { PackOption } from "./types";

type Props = {
  productName: string;
  productImage?: string;
  selectedPack: PackOption;
  quantity: number;
  deliveryCharge: number;
  isSubmitting?: boolean;
  onPlaceOrder: () => void;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function OrderSummary({
  productName,
  productImage = "/product/product-1.webp",
  selectedPack,
  quantity,
  deliveryCharge,
  isSubmitting = false,
  onPlaceOrder,
}: Props) {
  const subtotal = selectedPack.price * quantity;
  const total = subtotal + deliveryCharge;

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-xl font-semibold text-[#0A4833]">Order Summary</h3>

      <div className="mt-4 rounded-lg bg-[#F8F3E9] p-3">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-[#E7DAC3]">
            <Image src={productImage} alt={productName} fill unoptimized className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A4833]">{productName}</p>
            <p className="text-xs text-[#6B7280]">{selectedPack.name} x {quantity}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm text-[#374151]">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex items-center justify-between"><span>Delivery Charge</span><span>{deliveryCharge === 0 ? "FREE" : formatCurrency(deliveryCharge)}</span></div>
          <div className="mt-1 flex items-center justify-between border-t border-[#DDD2BE] pt-1 text-base font-semibold text-[#0A4833]">
            <span>Total</span><span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-[#F8F3E9] p-3 text-xs text-[#6B7280]">
        <p className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-[#A88751]" /> Estimated Delivery: 3-5 business days</p>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isSubmitting}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <CircleDollarSign className="h-4 w-4" />
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </button>

      <button className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#DFDFDF] bg-white text-sm font-medium text-[#4B5563]">
        Continue Shopping
      </button>
    </section>
  );
}
