/* eslint-disable @next/next/no-img-element */

import { Eye, Pencil, Trash2 } from "lucide-react";

type OrderRow = {
  id: string;
  customer: string;
  email: string;
  product: string;
  pack: string;
  date: string;
  amount: string;
  status: string;
  avatar: string;
};

type Props = {
  rows: OrderRow[];
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onOpenStatus: (orderId: string) => void;
};

function statusColor(status: string) {
  if (status === "Processing") return "text-[#854D0E]";
  if (status === "Delivered") return "text-[#166534]";
  if (status === "Shipped") return "text-[#1E40AF]";
  if (status === "Packed") return "text-[#9F8151]";
  return "text-[#0A4833]";
}

export default function RecentOrdersTable({ rows, page, perPage, total, onPageChange, onOpenStatus }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = rows.length === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <div className="flex items-center justify-between border-b border-[#DFDFDF] px-4 py-3">
        <h3 className="text-[28px] font-semibold text-[#0A4833]">Recent Orders</h3>
        <label>
          <select className="h-8 rounded-md border border-[#DFDFDF] bg-white px-2 text-sm">
            <option>10 per page</option>
            <option>20 per page</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-[#E9E0D0] text-[#6B7280]">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" /></th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#DFDFDF]">
                <td className="px-4 py-4"><input type="checkbox" /></td>
                <td className="px-4 py-4 font-medium text-[#0A4833]">{row.id}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <img src={row.avatar} alt={row.customer} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-[#111827]">{row.customer}</p>
                      <p className="text-xs text-[#6B7280]">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p>{row.product}</p>
                  <p className="text-xs text-[#6B7280]">{row.pack}</p>
                </td>
                <td className="px-4 py-4 text-[#6B7280]">{row.date}</td>
                <td className="px-4 py-4 font-semibold text-[#9F8151]">{row.amount}</td>
                <td className={`px-4 py-4 text-xs font-semibold ${statusColor(row.status)}`}>
                  <button type="button" onClick={() => onOpenStatus(row.id)} className="cursor-pointer hover:underline">
                    {row.status}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onOpenStatus(row.id)} className="text-[#0A4833] hover:text-[#083927]" aria-label="View status">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onOpenStatus(row.id)} className="text-[#A88751] hover:text-[#8F7348]" aria-label="Edit status">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="text-[#4B5563] hover:text-[#1F2937]" aria-label="Delete order">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DFDFDF] px-4 py-3">
        <p className="text-sm text-[#6B7280]">Showing {start} to {end} of {total} orders</p>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="rounded border border-[#DFDFDF] px-3 py-1 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`rounded border px-3 py-1 ${page === n ? "border-[#0A4833] bg-[#0A4833] text-white" : "border-[#DFDFDF] text-[#374151]"}`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="rounded border border-[#DFDFDF] px-3 py-1 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
