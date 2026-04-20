import type { FindNutritionistData } from "../assignNutritionistTypes";

type FindNutritionistCardProps = {
  data: FindNutritionistData;
};

export default function FindNutritionistCard({ data }: FindNutritionistCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-lg font-semibold text-[#0A4833]">{data.title}</h2>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <input
          type="text"
          placeholder={data.searchPlaceholder}
          className="h-10 rounded-md border border-[#E5E7EB] px-3 text-sm text-[#111827] outline-none"
        />
        <div className="flex h-10 items-center rounded-md border border-[#E5E7EB] px-3 text-sm text-[#374151]">{data.specializationLabel}</div>
        <div className="flex h-10 items-center rounded-md border border-[#E5E7EB] px-3 text-sm text-[#374151]">{data.availabilityLabel}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {data.chips.map((chip) => (
          <span
            key={chip.label}
            className={
              chip.active
                ? "rounded-full bg-[#A68966] px-3 py-1 text-xs font-medium text-white"
                : "rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#6B7280]"
            }
          >
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  );
}
