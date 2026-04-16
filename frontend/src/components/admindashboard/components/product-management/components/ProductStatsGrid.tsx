import { AlertTriangle, CircleCheck, DollarSign, Package, Star, Trophy, XCircle, FileText } from "lucide-react";

const cards = [
  { primary: "248", secondary: "Total Products", note: "+12%", Icon: Package, iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]", primaryClass: "text-[40px] leading-none" },
  { primary: "186", secondary: "Active Products", note: "Active", Icon: CircleCheck, iconColor: "text-[#22C55E]", iconBg: "bg-[#EAFBF0]", noteColor: "text-[#0A4833]", primaryClass: "text-[40px] leading-none" },
  { primary: "23", secondary: "Low Stock", note: "Alert", Icon: AlertTriangle, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[40px] leading-none" },
  { primary: "42", secondary: "Featured Items", note: "Featured", Icon: Star, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[40px] leading-none" },
  { primary: "8", secondary: "Out of Stock", note: "Urgent", Icon: XCircle, iconColor: "text-[#DC2626]", iconBg: "bg-[#FEECEC]", noteColor: "text-[#DC2626]", primaryClass: "text-[40px] leading-none" },
  { primary: "54", secondary: "Draft Products", note: "Draft", Icon: FileText, iconColor: "text-[#4B5563]", iconBg: "bg-[#F1F3F5]", noteColor: "text-[#4B5563]", primaryClass: "text-[40px] leading-none" },
  { primary: "$48.2K", secondary: "Total Revenue", note: "+18%", Icon: DollarSign, iconColor: "text-[#0A4833]", iconBg: "bg-[#E9F2EC]", noteColor: "text-[#22C55E]", primaryClass: "text-[44px] leading-none" },
  { primary: "Organic Flour", secondary: "Best Selling", note: "Top", Icon: Trophy, iconColor: "text-[#A88751]", iconBg: "bg-[#F5EFE5]", noteColor: "text-[#A88751]", primaryClass: "text-[36px] leading-tight" },
] as const;

export default function ProductStatsGrid() {
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
