/* eslint-disable @next/next/no-img-element */
"use client";

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
  product_image: string;
};

type Props = {
  rows: OrderRow[];
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onViewDetails: (orderId: string) => void;
  onOpenStatus: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  canEditOrders: boolean;
  canDeleteOrders: boolean;
};

function statusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "processing")
    return "text-[#854D0E]";

  if (normalized === "delivered")
    return "text-[#166534]";

  if (normalized === "shipped")
    return "text-[#1E40AF]";

  if (normalized === "confirmed")
    return "text-[#9F8151]";

  if (normalized === "cancelled")
    return "text-[#6B7280]";

  return "text-[#0A4833]";
}

function statusLabel(status: string) {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (part) =>
        `${part.charAt(0).toUpperCase()}${part
          .slice(1)
          .toLowerCase()}`
    )
    .join(" ");
}

export default function RecentOrdersTable({
  rows,
  page,
  perPage,
  total,
  onPageChange,
  onViewDetails,
  onOpenStatus,
  onDelete,
  canEditOrders,
  canDeleteOrders,
}: Props) {
  const totalPages = Math.max(
    1,
    Math.ceil(total / perPage)
  );

  const start =
    rows.length === 0
      ? 0
      : (page - 1) * perPage + 1;

  const end = Math.min(
    page * perPage,
    total
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDFDF] px-4 py-3">
        <h3 className="text-xl font-semibold text-[#0A4833] sm:text-[28px]">
          Recent Orders
        </h3>
      </div>

      <div className="hide-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[14%]" />
            <col className="w-[23%]" />
            <col className="w-[18%]" />
            <col className="w-[13%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
            <col className="w-[10%]" />
          </colgroup>

          <thead className="bg-[#E9E0D0] text-[#6B7280]">
            <tr>
              <th className="px-2 py-3 align-middle">
                <input type="checkbox" />
              </th>

              <th className="px-2 py-3 align-middle">
                Order ID
              </th>

              <th className="px-2 py-3 align-middle">
                Customer
              </th>

              <th className="px-2 py-3 align-middle">
                Product
              </th>

              <th className="px-2 py-3 align-middle">
                Date
              </th>

              <th className="px-2 py-3 align-middle">
                Amount
              </th>

              <th className="px-2 py-3 align-middle">
                Status
              </th>

              <th className="bg-[#E9E0D0] px-2 py-3 align-middle">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[#DFDFDF] align-middle"
              >
                <td className="px-2 py-4 align-middle">
                  <input type="checkbox" />
                </td>

                <td className="truncate px-2 py-4 align-middle font-medium text-[#0A4833]">
                  {row.id}
                </td>

                <td className="px-2 py-4 align-middle">
                  <div className="flex min-w-0 items-center gap-2">
                    <img
                      src={row.avatar}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.src = "/userdash/myrecipy/my-recipes-icon.png";
                      }}
                      className="h-8 w-8 shrink-0 rounded-full bg-[#EFE7D6] object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#111827]">
                        {row.customer}
                      </p>

                      <p className="truncate text-xs text-[#6B7280]">
                        {row.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-2 py-4 align-middle">
                  <p className="truncate font-medium text-[#111827]">
                    {row.product}
                  </p>

                  <p className="truncate text-xs text-[#374151]">
                    {row.pack}
                  </p>
                </td>

                <td className="truncate px-2 py-4 align-middle text-[#6B7280]">
                  {row.date}
                </td>

                <td className="truncate px-2 py-4 align-middle font-semibold text-[#9F8151]">
                  {row.amount}
                </td>

                <td
                  className={`truncate px-2 py-4 align-middle text-xs font-semibold ${statusColor(
                    row.status
                  )}`}
                >
                  {canEditOrders ? (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenStatus(row.id)
                      }
                      className="cursor-pointer hover:underline"
                    >
                      {statusLabel(row.status)}
                    </button>
                  ) : (
                    statusLabel(row.status)
                  )}
                </td>

                <td className="px-2 py-4 align-middle">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onViewDetails(row.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#0A4833] hover:bg-[#E8F2EE] hover:text-[#083927]"
                      aria-label="View order details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {canEditOrders && <button
                      type="button"
                      onClick={() =>
                        onOpenStatus(row.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#A88751] hover:bg-[#F3EBDC] hover:text-[#8F7348]"
                      aria-label="Edit status"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>}

                    {canDeleteOrders && <button
                      type="button"
                      onClick={() =>
                        onDelete(row.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#B91C1C]"
                      aria-label="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#DFDFDF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-right text-sm text-[#6B7280]">
          Showing {start} to {end} of{" "}
          {total} orders
        </p>

        <div className="hide-scrollbar flex w-full items-center justify-end gap-2 overflow-x-auto text-sm sm:w-auto">
          <button
            type="button"
            onClick={() =>
              onPageChange(
                Math.max(1, page - 1)
              )
            }
            className="shrink-0 rounded border border-[#DFDFDF] px-3 py-1 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                onPageChange(n)
              }
              className={`shrink-0 rounded border px-3 py-1 ${
                page === n
                  ? "border-[#0A4833] bg-[#0A4833] text-white"
                  : "border-[#DFDFDF] text-[#374151]"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              onPageChange(
                Math.min(
                  totalPages,
                  page + 1
                )
              )
            }
            className="shrink-0 rounded border border-[#DFDFDF] px-3 py-1 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
