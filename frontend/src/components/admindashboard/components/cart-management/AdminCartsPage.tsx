"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageX, ShoppingCart, UserRound } from "lucide-react";
import api from "@/services/api";

type CartItem = {
  id: number | string;
  user_id?: number | string | null;
  user_email?: string | null;
  user_name?: string | null;
  product_name?: string | null;
  product_code?: string | null;
  product_image?: string | null;
  variant_name?: string | null;
  quantity?: number | string | null;
  unit_price?: number | string | null;
  line_total?: number | string | null;
  stock_quantity?: number | string | null;
  stock_status?: string | null;
  updated_at?: string | null;
};

function toList(data: unknown): CartItem[] {
  if (Array.isArray(data)) return data as CartItem[];
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results?: unknown }).results)
  ) {
    return (data as { results: CartItem[] }).results;
  }
  return [];
}

function numberValue(value: CartItem[keyof CartItem]) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function money(value: CartItem[keyof CartItem]) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numberValue(value));
}

function stockTone(stock: number) {
  if (stock <= 0) return "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]";
  if (stock <= 5) return "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]";
  return "bg-[#ECFDF5] text-[#047857] border-[#BBF7D0]";
}

function stockText(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return `${stock} in stock`;
}

export default function AdminCartsPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarts = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/orders/admin/cart/");
        setItems(toList(res.data));
      } catch {
        setFetchError("Failed to load active carts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const summary = useMemo(() => {
    const users = new Set(items.map((item) => String(item.user_id ?? item.user_email ?? "guest")));
    return {
      users: users.size,
      items: items.length,
      quantity: items.reduce((sum, item) => sum + numberValue(item.quantity), 0),
      value: items.reduce((sum, item) => sum + numberValue(item.line_total), 0),
      lowStock: items.filter((item) => {
        const stock = numberValue(item.stock_quantity);
        return stock > 0 && stock <= 5;
      }).length,
      outOfStock: items.filter((item) => numberValue(item.stock_quantity) <= 0).length,
    };
  }, [items]);

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <div>
          <p className="text-sm font-medium text-[#A88751]">Admin Dashboard</p>
          <h1 className="text-2xl font-semibold text-[#0A4833]">Active Carts</h1>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={UserRound} label="Customers With Carts" value={summary.users} />
          <SummaryCard icon={ShoppingCart} label="Cart Items" value={summary.items} />
          <SummaryCard icon={AlertTriangle} label="Low Stock In Carts" value={summary.lowStock} tone="warning" />
          <SummaryCard icon={PackageX} label="Out Of Stock In Carts" value={summary.outOfStock} tone="danger" />
        </div>

        <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0A4833]">Cart Details</h2>
              <p className="text-sm text-[#6B7280]">
                {summary.quantity} units reserved in carts, worth {money(summary.value)}
              </p>
            </div>
          </div>

          {isLoading && <p className="mt-4 text-sm text-[#6B7280]">Loading active carts...</p>}

          {fetchError && (
            <div className="mt-4 rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm text-[#B91C1C]">
              {fetchError}
            </div>
          )}

          {!isLoading && !fetchError && items.length === 0 && (
            <p className="mt-4 text-sm text-[#6B7280]">No products are currently in customer carts.</p>
          )}

          {!isLoading && !fetchError && items.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#EDEDED] text-xs uppercase text-[#6B7280]">
                    <th className="px-3 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Qty</th>
                    <th className="px-3 py-3 font-semibold">Unit Price</th>
                    <th className="px-3 py-3 font-semibold">Line Total</th>
                    <th className="px-3 py-3 font-semibold">Stock</th>
                    <th className="px-3 py-3 font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const stock = numberValue(item.stock_quantity);
                    return (
                      <tr key={item.id} className="border-b border-[#F4F4F4] text-[#374151] last:border-0">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#F3F4F6]">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name || "Product"}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-[#111827]">{item.product_name || "Product"}</p>
                              <p className="text-xs text-[#6B7280]">{item.product_code || "No code"}</p>
                              {item.variant_name && <p className="text-xs text-[#A88751]">{item.variant_name}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-[#111827]">{item.user_name || "Customer"}</p>
                          <p className="text-xs text-[#6B7280]">{item.user_email || "No email"}</p>
                        </td>
                        <td className="px-3 py-3">{numberValue(item.quantity)}</td>
                        <td className="px-3 py-3">{money(item.unit_price)}</td>
                        <td className="px-3 py-3 font-semibold text-[#111827]">{money(item.line_total)}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stockTone(stock)}`}>
                            {stockText(stock)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-[#6B7280]">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString("en-IN") : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof ShoppingCart;
  label: string;
  value: number;
  tone?: "default" | "warning" | "danger";
}) {
  const colors = {
    default: "bg-[#F0F7F3] text-[#0A4833]",
    warning: "bg-[#FFF7ED] text-[#C2410C]",
    danger: "bg-[#FEF2F2] text-[#B91C1C]",
  };

  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-[#6B7280]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#111827]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${colors[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
