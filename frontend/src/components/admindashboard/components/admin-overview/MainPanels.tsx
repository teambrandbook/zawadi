"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, CalendarPlus2, CirclePlus, ClipboardCheck, Megaphone, Stethoscope } from "lucide-react";
import api from "@/services/api";

const quickActions = [
  { label: "Add Product", Icon: CirclePlus, href: "/admindashboard/products/add" },
  { label: "Create Event", Icon: CalendarPlus2, href: "/admindashboard/events/create" },
  { label: "Add Nutritionist", Icon: Stethoscope, href: "/admindashboard/nutritionist/addnutritonist" },
  { label: "Review Content", Icon: ClipboardCheck, href: "/admindashboard/blog" },
  { label: "Manage Orders", Icon: Briefcase, href: "/admindashboard/orders" },
  { label: "Send Alert", Icon: Megaphone, href: "/admindashboard/notifications/create" },
];

type RecentOrder = {
  id: string;
  customer: string;
  product: string;
  status: string;
  amount: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(item: Record<string, any>, index: number): RecentOrder {
  return {
    id: String(item.order_id ?? item.id ?? `ORD-${index + 1}`),
    customer: String(item.full_name ?? item.customer_name ?? item.customer ?? "Unknown"),
    product: String(item.product_name ?? item.product ?? "—"),
    status: String(item.status ?? "Pending"),
    amount:
      item.total_amount != null
        ? `$${parseFloat(item.total_amount).toFixed(2)}`
        : String(item.amount ?? "$0.00"),
  };
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "shipped" || s === "delivered") return "text-[#15803D]";
  if (s === "processing") return "text-[#CA8A04]";
  return "text-[#2563EB]";
}

function statusLabel(status: string) {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

export default function MainPanels() {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/admin/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRecentOrders(raw.slice(0, 5).map(mapOrder));
      } catch {
        // Silent fail — show empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Quick Actions</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickActions.map(({ label, Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex h-[74px] flex-col items-center justify-center rounded-md bg-[#EDE4D3] text-xs text-[#4B5563] hover:bg-[#E6DABF]"
            >
              <Icon className="mb-1 h-4 w-4 text-[#A88751]" />
              {label}
            </Link>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#0A4833]">Recent Orders</h3>
          <Link href="/admindashboard/orders" className="text-xs text-[#A88751] hover:underline">
            View All
          </Link>
        </div>

        {isLoading && (
          <p className="mt-4 text-sm text-[#6B7280]">Loading recent orders...</p>
        )}

        {!isLoading && recentOrders.length === 0 && (
          <p className="mt-4 text-sm text-[#6B7280]">No recent orders.</p>
        )}

        {!isLoading && recentOrders.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDEDED] text-[#6B7280]">
                  <th className="px-2 py-2 font-medium">Order ID</th>
                  <th className="px-2 py-2 font-medium">Customer</th>
                  <th className="px-2 py-2 font-medium">Product</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Amount</th>
                  <th className="px-2 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#F4F4F4] text-[#374151] last:border-0">
                    <td className="px-2 py-2">{order.id}</td>
                    <td className="px-2 py-2">{order.customer}</td>
                    <td className="px-2 py-2">{order.product}</td>
                    <td className={`px-2 py-2 ${statusColor(order.status)}`}>{statusLabel(order.status)}</td>
                    <td className="px-2 py-2 font-medium text-[#111827]">{order.amount}</td>
                    <td className="px-2 py-2">
                      <Link
                        href={`/admindashboard/orders?order=${encodeURIComponent(order.id)}`}
                        className="text-[#A88751] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
