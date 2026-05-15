"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, PackageX } from "lucide-react";
import api from "@/services/api";

type CartItem = {
  id: string | number;
  user_name?: string | null;
  user_email?: string | null;
  product_name?: string | null;
  quantity?: string | number | null;
  line_total?: string | number | null;
  stock_quantity?: string | number | null;
};

type ProductItem = {
  id: string | number;
  product_name?: string | null;
  product_code?: string | null;
  stock_quantity?: string | number | null;
};

function toList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results?: unknown }).results)
  ) {
    return (data as { results: T[] }).results;
  }
  return [];
}

function numberValue(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function money(value: unknown) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numberValue(value));
}

function stockText(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return `${stock} in stock`;
}

export default function CartAndStockPanels() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [cartRes, productRes] = await Promise.allSettled([
          api.get("/orders/admin/cart/"),
          api.get("/products/"),
        ]);

        if (!mounted) return;

        if (cartRes.status === "fulfilled") {
          setCartItems(toList<CartItem>(cartRes.value.data));
        }
        if (productRes.status === "fulfilled") {
          setProducts(toList<ProductItem>(productRes.value.data));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => numberValue(product.stock_quantity) <= 5)
        .sort((a, b) => numberValue(a.stock_quantity) - numberValue(b.stock_quantity))
        .slice(0, 5),
    [products],
  );

  const recentCartItems = cartItems.slice(0, 5);
  const cartValue = cartItems.reduce((sum, item) => sum + numberValue(item.line_total), 0);
  const outOfStockCount = lowStockProducts.filter((product) => numberValue(product.stock_quantity) <= 0).length;

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#0A4833]">Active Carts</h3>
            <p className="text-sm text-[#6B7280]">
              {cartItems.length} items, {money(cartValue)} current cart value
            </p>
          </div>
          <Link href="/admindashboard/carts" className="text-xs font-semibold text-[#A88751] hover:underline">
            View All
          </Link>
        </div>

        {isLoading && <p className="mt-4 text-sm text-[#6B7280]">Loading carts...</p>}

        {!isLoading && recentCartItems.length === 0 && (
          <p className="mt-4 text-sm text-[#6B7280]">No active cart items.</p>
        )}

        {!isLoading && recentCartItems.length > 0 && (
          <div className="mt-3 space-y-3">
            {recentCartItems.map((item) => {
              const stock = numberValue(item.stock_quantity);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[#F4F4F4] pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#111827]">{item.product_name || "Product"}</p>
                    <p className="truncate text-xs text-[#6B7280]">{item.user_name || item.user_email || "Customer"}</p>
                    {stock <= 5 && (
                      <p className={`mt-1 text-xs font-semibold ${stock <= 0 ? "text-[#B91C1C]" : "text-[#C2410C]"}`}>
                        {stockText(stock)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#111827]">x{numberValue(item.quantity)}</p>
                    <p className="text-xs text-[#6B7280]">{money(item.line_total)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#0A4833]">Stock Alerts</h3>
            <p className="text-sm text-[#6B7280]">
              {lowStockProducts.length} low stock products, {outOfStockCount} out of stock
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7ED] text-[#C2410C]">
            {outOfStockCount > 0 ? <PackageX className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
        </div>

        {isLoading && <p className="mt-4 text-sm text-[#6B7280]">Loading stock alerts...</p>}

        {!isLoading && lowStockProducts.length === 0 && (
          <p className="mt-4 text-sm text-[#6B7280]">No low stock products right now.</p>
        )}

        {!isLoading && lowStockProducts.length > 0 && (
          <div className="mt-3 space-y-3">
            {lowStockProducts.map((product) => {
              const stock = numberValue(product.stock_quantity);
              return (
                <div key={product.id} className="flex items-center justify-between gap-3 border-b border-[#F4F4F4] pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#111827]">{product.product_name || "Product"}</p>
                    <p className="text-xs text-[#6B7280]">{product.product_code || "No code"}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      stock <= 0 ? "bg-[#FEF2F2] text-[#B91C1C]" : "bg-[#FFF7ED] text-[#C2410C]"
                    }`}
                  >
                    {stockText(stock)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </section>
  );
}
