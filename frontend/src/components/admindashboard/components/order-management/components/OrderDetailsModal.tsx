/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";

type OrderDetails = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  pack: string;
  quantity: string;
  packPrice: string;
  subtotal: string;
  deliveryCharge: string;
  amount: string;
  status: string;
  payment: string;
  paymentMethod: string;
  date: string;
  city: string;
  postalCode: string;
  address: string;
  instructions: string;
  avatar: string;
  product_image: string;
};

type Props = {
  open: boolean;
  order: OrderDetails | null;
  onClose: () => void;
};

function labelStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-[#111827]">
        {value || "-"}
      </p>
    </div>
  );
}

export default function OrderDetailsModal({ open, order, onClose }: Props) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#DFDFDF] bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#DFDFDF] bg-white px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0A4833]">Order Details</h2>
            <p className="text-sm text-[#6B7280]">{order.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
            aria-label="Close order details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={order.avatar}
                alt={order.customer}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-[#111827]">{order.customer}</p>
                <p className="text-sm text-[#6B7280]">{order.email}</p>
              </div>
            </div>
            <div className="rounded-md bg-[#ECF8F2] px-3 py-2 text-sm font-semibold text-[#0A4833]">
              {labelStatus(order.status)}
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border border-[#E5E7EB] p-4 sm:grid-cols-[80px_1fr]">
            <img
              src={order.product_image}
              alt={order.product}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Product" value={order.product} />
              <DetailItem label="Pack" value={order.pack} />
              <DetailItem label="Quantity" value={order.quantity} />
              <DetailItem label="Pack Price" value={order.packPrice} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <DetailItem label="Subtotal" value={order.subtotal} />
            <DetailItem label="Delivery Charge" value={order.deliveryCharge} />
            <DetailItem label="Total Amount" value={order.amount} />
            <DetailItem label="Payment Status" value={order.payment} />
            <DetailItem label="Payment Method" value={order.paymentMethod} />
            <DetailItem label="Order Date" value={order.date} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Phone" value={order.phone} />
            <DetailItem label="City" value={order.city} />
            <DetailItem label="Postal Code" value={order.postalCode} />
            <DetailItem label="Address" value={order.address} />
          </div>

          <DetailItem label="Instructions" value={order.instructions} />
        </div>
      </div>
    </div>
  );
}
