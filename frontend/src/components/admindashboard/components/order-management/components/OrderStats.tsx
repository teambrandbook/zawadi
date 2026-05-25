"use client";

import { useEffect, useState } from "react";
import { Clock3, ShoppingCart, Truck } from "lucide-react";
import api from "@/services/api";

type OrderStatsData = {
  total: number;
  pending: number;
  delivered: number;
};

export default function OrderStats() {
  const [stats, setStats] = useState<OrderStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/orders/admin/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];

        const total = raw.length;
        const pending = raw.filter((o) => {
          const s = String(o.status ?? "").toLowerCase();
          return s === "pending" || s === "processing";
        }).length;
        const delivered = raw.filter((o) => {
          const s = String(o.status ?? "").toLowerCase();
          return s === "delivered" || s === "shipped";
        }).length;

        setStats({ total, pending, delivered });
      } catch {
        // Silent fail - keep null stats
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fmt = (n: number) => n.toLocaleString();

  const cards = [
    {
      label: "Total Orders",
      value: stats != null ? fmt(stats.total) : isLoading ? "..." : "-",
      Icon: ShoppingCart,
      iconBg: "bg-[#F4ECE0]",
      iconColor: "text-[#A88751]",
    },
    {
      label: "Pending Orders",
      value: stats != null ? fmt(stats.pending) : isLoading ? "..." : "-",
      Icon: Clock3,
      iconBg: "bg-[#FFF4CC]",
      iconColor: "text-[#E4B300]",
    },
    {
      label: "Delivered Today",
      value: stats != null ? fmt(stats.delivered) : isLoading ? "..." : "-",
      Icon: Truck,
      iconBg: "bg-[#EAFBEF]",
      iconColor: "text-[#22C55E]",
    },
  ] as const;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {cards.map(({ label, value, Icon, iconBg, iconColor }) => (
        <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">{label}</p>
              <p className="mt-1 text-[38px] font-semibold leading-none text-[#0A4833]">{value}</p>
            </div>
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
