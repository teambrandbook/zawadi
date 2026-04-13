import { Clock3, DollarSign, ShoppingCart, Truck } from "lucide-react";

const cards = [
  { label: "Total Orders", value: "1,247", Icon: ShoppingCart, iconBg: "bg-[#F4ECE0]", iconColor: "text-[#A88751]" },
  { label: "Pending Orders", value: "23", Icon: Clock3, iconBg: "bg-[#FFF4CC]", iconColor: "text-[#E4B300]" },
  { label: "Delivered Today", value: "47", Icon: Truck, iconBg: "bg-[#EAFBEF]", iconColor: "text-[#22C55E]" },
  { label: "Total Revenue", value: "$24,890", Icon: DollarSign, iconBg: "bg-[#F4ECE0]", iconColor: "text-[#A88751]" },
] as const;

export default function OrderStats() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
