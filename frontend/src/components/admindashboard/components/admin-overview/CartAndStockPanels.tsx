"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageX } from "lucide-react";
import api from "@/services/api";

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

function stockText(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return `${stock} in stock`;
}

export default function CartAndStockPanels() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const productRes = await api.get("/products/");

        if (!mounted) return;

        setProducts(toList<ProductItem>(productRes.data));
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

  const outOfStockCount = lowStockProducts.filter((product) => numberValue(product.stock_quantity) <= 0).length;

  return (
    <section>
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
