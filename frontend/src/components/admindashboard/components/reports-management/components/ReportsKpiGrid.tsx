import { DollarSign, ShoppingCart, Sparkles, Users } from "lucide-react";
import type { KpiCard } from "../types";

type ReportsKpiGridProps = {
  cards: KpiCard[];
};

export default function ReportsKpiGrid({ cards }: ReportsKpiGridProps) {
  const iconMap = {
    revenue: <DollarSign size={16} />,
    orders: <ShoppingCart size={16} />,
    users: <Users size={16} />,
    bookings: <Sparkles size={16} />,
  };

  const iconStyleMap = {
    revenue: "bg-[#E9F1EC] text-[#0A4833]",
    orders: "bg-[#F4EFE3] text-[#9C7A4D]",
    users: "bg-[#EAF2FF] text-[#2E73D2]",
    bookings: "bg-[#EFE8FF] text-[#7B57C8]",
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.id} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${iconStyleMap[card.icon]}`}
            >
              {iconMap[card.icon]}
            </span>
            <span className="text-xs font-medium text-[#0A7A44]">{card.change}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#0A4B34]">{card.value}</p>
          <p className="text-xs text-[#6B7280]">{card.label}</p>
        </article>
      ))}
    </div>
  );
}
