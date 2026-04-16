"use client";

import Image from "next/image";
import { Truck, CircleDollarSign } from "lucide-react";
import { PackOption } from "./types";

type Props = {
  selectedPack: PackOption;
  quantity: number;
  onPlaceOrder: () => void;
};

export default function OrderSummary({ selectedPack, quantity, onPlaceOrder }: Props) {
  const subtotal = selectedPack.price * quantity;
  const delivery = subtotal >= 500 ? 0 : 50;
  const total = subtotal + delivery;

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-xl font-semibold text-[#0A4833]">Order Summary</h3>

      <div className="mt-4 rounded-lg bg-[#F8F3E9] p-3">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-[#E7DAC3]">
            <Image src="/product/product-1.webp" alt="ZEWADI Buckwheat" fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A4833]">ZEWADI Buckwheat</p>
            <p className="text-xs text-[#6B7280]">{selectedPack.name} x {quantity}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm text-[#374151]">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex items-center justify-between"><span>Delivery Charge</span><span>{delivery === 0 ? "FREE" : `₹${delivery.toFixed(2)}`}</span></div>
          <div className="mt-1 flex items-center justify-between border-t border-[#DDD2BE] pt-1 text-base font-semibold text-[#0A4833]">
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-[#F8F3E9] p-3 text-xs text-[#6B7280]">
        <p className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-[#A88751]" /> Estimated Delivery: 3-5 business days</p>
      </div>

      <button
        onClick={onPlaceOrder}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A]"
      >
        <CircleDollarSign className="h-4 w-4" />
        Place Order
      </button>

      <button className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#DFDFDF] bg-white text-sm font-medium text-[#4B5563]">
        Continue Shopping
      </button>
    </section>
  );
}
