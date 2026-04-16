"use client";

import { Briefcase, CalendarPlus2, CirclePlus, ClipboardCheck, Megaphone, Stethoscope } from "lucide-react";

const quickActions = [
  { label: "Add Product", Icon: CirclePlus },
  { label: "Create Event", Icon: CalendarPlus2 },
  { label: "Add Nutritionist", Icon: Stethoscope },
  { label: "Review Content", Icon: ClipboardCheck },
  { label: "Manage Orders", Icon: Briefcase },
  { label: "Send Alert", Icon: Megaphone },
];

const recentOrders = [
  { id: "#ZW-2024-001", customer: "Emma Johnson", product: "Organic Buckwheat Flour", status: "Shipped", amount: "$24.99" },
  { id: "#ZW-2024-002", customer: "Michael Chen", product: "Buckwheat Starter Kit", status: "Processing", amount: "$49.99" },
  { id: "#ZW-2024-003", customer: "Sarah Wilson", product: "Buckwheat Noodles Pack", status: "Confirmed", amount: "$18.50" },
];

function statusColor(status: string) {
  if (status === "Shipped") return "text-[#15803D]";
  if (status === "Processing") return "text-[#CA8A04]";
  return "text-[#2563EB]";
}

export default function MainPanels() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Quick Actions</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickActions.map(({ label, Icon }) => (
            <button
              key={label}
              className="flex h-[74px] flex-col items-center justify-center rounded-md bg-[#EDE4D3] text-xs text-[#4B5563] hover:bg-[#E6DABF]"
            >
              <Icon className="mb-1 h-4 w-4 text-[#A88751]" />
              {label}
            </button>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#0A4833]">Recent Orders</h3>
          <button className="text-xs text-[#A88751] hover:underline">View All</button>
        </div>
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
                  <td className={`px-2 py-2 ${statusColor(order.status)}`}>{order.status}</td>
                  <td className="px-2 py-2 font-medium text-[#111827]">{order.amount}</td>
                  <td className="px-2 py-2 text-[#A88751]">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
