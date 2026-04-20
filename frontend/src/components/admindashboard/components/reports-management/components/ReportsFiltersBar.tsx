import type { FilterOption } from "../types";

type ReportsFiltersBarProps = {
  filters: FilterOption[];
};

export default function ReportsFiltersBar({ filters }: ReportsFiltersBarProps) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter.id}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              index === 0
                ? "border border-[#0A4B34] bg-[#0A4B34] text-white"
                : "border border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]"
            }`}
          >
            {filter.label}
          </button>
        ))}

        <button className="ml-0 rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs text-[#374151] md:ml-2">
          All Modules
        </button>
      </div>
    </div>
  );
}
