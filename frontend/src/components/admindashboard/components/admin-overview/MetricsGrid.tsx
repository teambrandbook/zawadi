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

const metrics: MetricCardItem[] = [
  { label: "Total Users", value: "12,847", subText: "+12% from last month", Icon: Users, valueColor: "text-[#0A4833]", subTextColor: "text-[#22A34A]", iconBg: "bg-[#EAF1FF]", iconColor: "text-[#3B82F6]" },
  { label: "Active Members", value: "8,942", subText: "+8% from last month", Icon: UserCheck, valueColor: "text-[#0A4833]", subTextColor: "text-[#22A34A]", iconBg: "bg-[#DCFCE7]", iconColor: "text-[#22C55E]" },
  { label: "Total Orders", value: "3,256", subText: "+15% from last month", Icon: ShoppingCart, valueColor: "text-[#0A4833]", subTextColor: "text-[#22A34A]", iconBg: "bg-[#F4EFE5]", iconColor: "text-[#B0894F]" },
  { label: "Revenue", value: "$47,892", subText: "+23% from last month", Icon: DollarSign, valueColor: "text-[#0A4833]", subTextColor: "text-[#22A34A]", iconBg: "bg-[#F3E8FF]", iconColor: "text-[#A855F7]" },
  { label: "Pending Recipes", value: "12", subText: "Needs Review", Icon: CookingPot, valueColor: "text-[#B45309]", subTextColor: "text-[#EA580C]", iconBg: "bg-[#FFF2E2]", iconColor: "text-[#F97316]" },
  { label: "Pending Blogs", value: "8", subText: "Awaiting Approval", Icon: RotateCcw, valueColor: "text-[#B45309]", subTextColor: "text-[#F59E0B]", iconBg: "bg-[#FEF9C3]", iconColor: "text-[#EAB308]" },
  { label: "Today's Consultations", value: "24", subText: "6 Upcoming", Icon: Stethoscope, valueColor: "text-[#1D4ED8]", subTextColor: "text-[#2563EB]", iconBg: "bg-[#DBEAFE]", iconColor: "text-[#3B82F6]" },
  { label: "Upcoming Events", value: "7", subText: "This Week", Icon: CalendarDays, valueColor: "text-[#0A4833]", subTextColor: "text-[#22A34A]", iconBg: "bg-[#DCFCE7]", iconColor: "text-[#22C55E]" },
];

export default function MetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, subText, Icon, valueColor, subTextColor, iconBg, iconColor }) => (
        <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-[#6B7280]">{label}</p>
              <p className={`mt-1 text-3xl font-bold leading-none ${valueColor}`}>{value}</p>
              <p className={`mt-1 text-xs ${subTextColor}`}>{subText}</p>
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
