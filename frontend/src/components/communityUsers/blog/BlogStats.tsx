import { CheckCircle2, Clock, Edit3, SquarePen } from "lucide-react";

const statCards = [
  { label: "Total Blogs", value: "12", Icon: SquarePen, iconWrap: "bg-[#E9DFCC]", iconColor: "text-[#06402B]" },
  { label: "Published", value: "8", Icon: CheckCircle2, iconWrap: "bg-[#DDF7E8]", iconColor: "text-[#16A34A]" },
  { label: "Drafts", value: "3", Icon: Edit3, iconWrap: "bg-[#FEF3C7]", iconColor: "text-[#A88751]" },
  { label: "Pending Review", value: "1", Icon: Clock, iconWrap: "bg-[#DBEAFE]", iconColor: "text-[#2563EB]" },
];

export default function BlogStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6B7280]">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#06402B]">{card.value}</p>
            </div>
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${card.iconWrap}`}>
              <card.Icon className={`h-5 w-5 ${card.iconColor}`} />
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
