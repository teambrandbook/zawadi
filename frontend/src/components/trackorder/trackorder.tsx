"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { toast } from "sonner";

type Order = {
  order_id: string;
  product_name: string;
  pack_name: string;
  quantity: number;
  total_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

export default function TrackOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data) ? data : (data.results ?? []));
      })
      .catch(() => {
        toast.error("Could not load orders.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-[#0A4833]">No orders yet</p>
        <Link href="/products" className="rounded-lg bg-[#0a4833] px-6 py-2 text-sm text-white">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#0a4833]">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#111827]">{order.product_name}</p>
                <p className="text-xs text-[#6b7280]">
                  {order.pack_name} · Qty {order.quantity}
                </p>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#0a4833]">₹{order.total_amount}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {STATUS_STEPS.map((step, i) => {
                const currentIndex = STATUS_STEPS.indexOf(order.status);
                const done = i <= currentIndex && order.status !== "cancelled";
                return (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div
                      className={`h-2 w-full rounded-full ${done ? "bg-[#0a4833]" : "bg-gray-200"}`}
                    />
                    <span className="mt-1 text-[8px] capitalize text-[#9ca3af]">{step}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-right text-xs font-semibold uppercase text-[#6b7280]">
              Order # {order.order_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
