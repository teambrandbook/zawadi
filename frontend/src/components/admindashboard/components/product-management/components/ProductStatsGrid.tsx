import { AlertTriangle, CircleCheck, DollarSign, FileText, Package, Star, Trophy, XCircle } from "lucide-react";
import type { ProductRow } from "./ProductsTable";

type Props = { rows: ProductRow[] };

export default function ProductStatsGrid({ rows }: Props) {
  const total = rows.length;
  const active = rows.filter((p) => p.status === "Active").length;
  const lowStock = rows.filter((p) => p.stockUnits > 0 && p.stockUnits <= 20).length;
  const featured = rows.filter((p) => p.featured).length;
  const outOfStock = rows.filter((p) => p.stockUnits === 0).length;
  const draft = rows.filter((p) => p.status === "Draft").length;
  const totalRevenue = rows.reduce((sum, p) => sum + p.price * p.sales, 0);
  const bestSeller = rows.reduce(
    (best, p) => (p.sales > best.sales ? p : best),
    { name: "—", sales: 0 } as { name: string; sales: number }
  );

  const revenueLabel =
    totalRevenue >= 1000
      ? `$${(totalRevenue / 1000).toFixed(1)}K`
      : `$${totalRevenue.toFixed(0)}`;

  const cards = [
    { primary: String(total),        secondary: "Total Products",  note: "",        Icon: Package,      iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]",  primaryClass: "text-[40px] leading-none" },
    { primary: String(active),       secondary: "Active Products", note: "Active",  Icon: CircleCheck,  iconColor: "text-[#22C55E]", iconBg: "bg-[#EAFBF0]", noteColor: "text-[#0A4833]",  primaryClass: "text-[40px] leading-none" },
    { primary: String(lowStock),     secondary: "Low Stock",       note: "Alert",   Icon: AlertTriangle,iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]",  primaryClass: "text-[40px] leading-none" },
    { primary: String(featured),     secondary: "Featured Items",  note: "Featured",Icon: Star,         iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]",  primaryClass: "text-[40px] leading-none" },
    { primary: String(outOfStock),   secondary: "Out of Stock",    note: "Urgent",  Icon: XCircle,      iconColor: "text-[#DC2626]", iconBg: "bg-[#FEECEC]", noteColor: "text-[#DC2626]",  primaryClass: "text-[40px] leading-none" },
    { primary: String(draft),        secondary: "Draft Products",  note: "Draft",   Icon: FileText,     iconColor: "text-[#4B5563]", iconBg: "bg-[#F1F3F5]", noteColor: "text-[#4B5563]",  primaryClass: "text-[40px] leading-none" },
    { primary: revenueLabel,         secondary: "Total Revenue",   note: "",        Icon: DollarSign,   iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]",  primaryClass: "text-[44px] leading-none" },
    { primary: bestSeller.name,      secondary: "Best Selling",    note: "Top",     Icon: Trophy,       iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]",  primaryClass: "text-[28px] leading-tight" },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ primary, secondary, note, Icon, iconColor, iconBg, noteColor, primaryClass }) => (
        <article key={secondary} className="rounded-xl border border-[#DFDFDF] bg-white p-5">
          <div className="flex items-start justify-between">
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            {note && <p className={`text-[12px] font-medium ${noteColor}`}>{note}</p>}
          </div>
          <p className={`mt-4 font-semibold text-[#0A4833] ${primaryClass}`}>{primary || "0"}</p>
          <p className="mt-2 text-sm leading-none text-[#6B7280]">{secondary}</p>
        </article>
      ))}
    </section>
  );
}
