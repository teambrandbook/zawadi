import type { OtherNutritionistItem } from "../assignNutritionistTypes";

type OtherNutritionistsCardProps = {
  title: string;
  items: OtherNutritionistItem[];
};

export default function OtherNutritionistsCard({ title, items }: OtherNutritionistsCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-lg font-semibold text-[#0A4833]">{title}</h2>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="rounded-lg border border-[#E5E7EB] p-3">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                <p className="text-xs text-[#6B7280]">{item.role}</p>
                <p className="text-xs text-[#6B7280]">Rating: {item.rating}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className={item.availabilityTone === "warning" ? "text-xs text-[#D97706]" : "text-xs text-[#6B7280]"}>{item.availabilityText}</p>
              <button className="rounded-md bg-[#F3F4F6] px-3 py-1 text-xs text-[#6B7280]">{item.actionLabel}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
