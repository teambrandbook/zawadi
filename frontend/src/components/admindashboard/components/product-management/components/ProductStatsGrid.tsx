"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CircleCheck, DollarSign, Package, Star, Trophy, XCircle, FileText } from "lucide-react";
import api from "@/services/api";

type ProductStats = {
  total: number;
  active: number;
  lowStock: number;
  featured: number;
  outOfStock: number;
  draft: number;
  revenue: number;
  bestSelling: string;
};

export default function ProductStatsGrid() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/products/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];

        const total = raw.length;
        const active = raw.filter((p) => {
          const s = String(p.status ?? "").toLowerCase();
          return s === "active";
        }).length;
        const lowStock = raw.filter((p) => {
          const stock = parseInt(p.stock_quantity ?? p.stock ?? 0, 10);
          return stock > 0 && stock <= 20;
        }).length;
        const featured = raw.filter((p) => Boolean(p.featured ?? p.is_featured)).length;
        const outOfStock = raw.filter((p) => {
          const stock = parseInt(p.stock_quantity ?? p.stock ?? 0, 10);
          return stock === 0;
        }).length;
        const draft = raw.filter((p) => {
          const s = String(p.status ?? "").toLowerCase();
          return s === "draft" || s === "inactive";
        }).length;
        const revenue = raw.reduce((sum, p) => {
          const price = parseFloat(p.price ?? p.base_price ?? 0);
          const sales = parseInt(p.total_sales ?? p.sales ?? 0, 10);
          return sum + (Number.isNaN(price) || Number.isNaN(sales) ? 0 : price * sales);
        }, 0);

        const bestSelling = raw.reduce(
          (best: { name: string; sales: number }, p) => {
            const sales = parseInt(p.total_sales ?? p.sales ?? 0, 10);
            return sales > best.sales ? { name: String(p.name ?? "—"), sales } : best;
          },
          { name: "—", sales: -1 }
        ).name;

        setStats({ total, active, lowStock, featured, outOfStock, draft, revenue, bestSelling });
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (n: number) => n.toLocaleString();
  const val = (v: number | string) => (stats != null ? (typeof v === "number" ? fmt(v) : v) : isLoading ? "…" : "—");

  const cards = [
    { primary: val(stats?.total ?? 0), secondary: "Total Products", note: "", Icon: Package, iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]", primaryClass: "text-[40px] leading-none" },
    { primary: val(stats?.active ?? 0), secondary: "Active Products", note: "Active", Icon: CircleCheck, iconColor: "text-[#22C55E]", iconBg: "bg-[#EAFBF0]", noteColor: "text-[#0A4833]", primaryClass: "text-[40px] leading-none" },
    { primary: val(stats?.lowStock ?? 0), secondary: "Low Stock", note: "Alert", Icon: AlertTriangle, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[40px] leading-none" },
    { primary: val(stats?.featured ?? 0), secondary: "Featured Items", note: "Featured", Icon: Star, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[40px] leading-none" },
    { primary: val(stats?.outOfStock ?? 0), secondary: "Out of Stock", note: "Urgent", Icon: XCircle, iconColor: "text-[#DC2626]", iconBg: "bg-[#FEECEC]", noteColor: "text-[#DC2626]", primaryClass: "text-[40px] leading-none" },
    { primary: val(stats?.draft ?? 0), secondary: "Draft Products", note: "Draft", Icon: FileText, iconColor: "text-[#4B5563]", iconBg: "bg-[#F1F3F5]", noteColor: "text-[#4B5563]", primaryClass: "text-[40px] leading-none" },
    {
      primary: stats?.revenue != null ? `$${(stats.revenue / 1000).toFixed(1)}K` : isLoading ? "…" : "—",
      secondary: "Total Revenue", note: "", Icon: DollarSign, iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]", primaryClass: "text-[44px] leading-none",
    },
    { primary: stats?.bestSelling ?? (isLoading ? "…" : "—"), secondary: "Best Selling", note: "Top", Icon: Trophy, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[36px] leading-tight" },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ primary, secondary, note, Icon, iconColor, iconBg, noteColor, primaryClass }) => (
        <article key={`${secondary}-${note}`} className="rounded-xl border border-[#DFDFDF] bg-white p-5">
          <div className="flex items-start justify-between">
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <p className={`text-[12px] font-medium ${noteColor}`}>{note}</p>
          </div>
          <p className={`mt-4 font-semibold text-[#0A4833] ${primaryClass}`}>{primary}</p>
          <p className="mt-2 text-sm leading-none text-[#6B7280]">{secondary}</p>
        </article>
      ))}
    </section>
  );
}
