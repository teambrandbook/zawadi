"use client";

import {
  CalendarDays,
  CookingPot,
  DollarSign,
  RotateCcw,
  ShoppingCart,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OverviewStats } from "./AdminOverviewDashboard";

type MetricCardItem = {
  label: string;
  value: string;
  subText: string;
  Icon: LucideIcon;
  valueColor: string;
  subTextColor: string;
  iconBg: string;
  iconColor: string;
};

function buildMetrics(stats: OverviewStats | null): MetricCardItem[] {
  const fmt = (n: number | undefined | null) =>
    n != null ? n.toLocaleString() : "—";
  const fmtCurrency = (n: number | undefined | null) =>
    n != null ? `$${n.toLocaleString()}` : "—";

  return [
    {
      label: "Total Users",
      value: fmt(stats?.total_users),
      subText: "Registered members",
      Icon: Users,
      valueColor: "text-[#0A4833]",
      subTextColor: "text-[#22A34A]",
      iconBg: "bg-[#EAF1FF]",
      iconColor: "text-[#3B82F6]",
    },
    {
      label: "Active Members",
      value: fmt(stats?.total_users),
      subText: "Total registered",
      Icon: UserCheck,
      valueColor: "text-[#0A4833]",
      subTextColor: "text-[#22A34A]",
      iconBg: "bg-[#DCFCE7]",
      iconColor: "text-[#22C55E]",
    },
    {
      label: "Total Orders",
      value: fmt(stats?.total_orders),
      subText: "All time",
      Icon: ShoppingCart,
      valueColor: "text-[#0A4833]",
      subTextColor: "text-[#22A34A]",
      iconBg: "bg-[#F4EFE5]",
      iconColor: "text-[#B0894F]",
    },
    {
      label: "Revenue",
      value: fmtCurrency(stats?.total_revenue),
      subText: "Total revenue",
      Icon: DollarSign,
      valueColor: "text-[#0A4833]",
      subTextColor: "text-[#22A34A]",
      iconBg: "bg-[#F3E8FF]",
      iconColor: "text-[#A855F7]",
    },
    {
      label: "Total Products",
      value: fmt(stats?.total_products),
      subText: "In catalogue",
      Icon: CookingPot,
      valueColor: "text-[#B45309]",
      subTextColor: "text-[#EA580C]",
      iconBg: "bg-[#FFF2E2]",
      iconColor: "text-[#F97316]",
    },
    {
      label: "Consultations",
      value: fmt(stats?.total_consultations),
      subText: "Total bookings",
      Icon: RotateCcw,
      valueColor: "text-[#B45309]",
      subTextColor: "text-[#F59E0B]",
      iconBg: "bg-[#FEF9C3]",
      iconColor: "text-[#EAB308]",
    },
    {
      label: "Today's Consultations",
      value: fmt(stats?.total_consultations),
      subText: "Total",
      Icon: Stethoscope,
      valueColor: "text-[#1D4ED8]",
      subTextColor: "text-[#2563EB]",
      iconBg: "bg-[#DBEAFE]",
      iconColor: "text-[#3B82F6]",
    },
    {
      label: "Upcoming Events",
      value: fmt(stats?.total_events),
      subText: "Total events",
      Icon: CalendarDays,
      valueColor: "text-[#0A4833]",
      subTextColor: "text-[#22A34A]",
      iconBg: "bg-[#DCFCE7]",
      iconColor: "text-[#22C55E]",
    },
  ];
}

type Props = {
  stats: OverviewStats | null;
};

export default function MetricsGrid({ stats }: Props) {
  const metrics = buildMetrics(stats);

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, subText, Icon, valueColor, subTextColor, iconBg, iconColor }) => (
        <article key={label} className="h-[126px] overflow-hidden rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs text-[#6B7280]">{label}</p>
              <p className={`mt-1 truncate text-[28px] font-bold leading-none ${valueColor}`}>{value}</p>
              <p className={`mt-1 truncate text-xs ${subTextColor}`}>{subText}</p>
            </div>
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
