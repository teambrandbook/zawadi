import { ChevronRight, Search } from "lucide-react";
import type { HeaderData } from "../assignNutritionistTypes";

type AssignHeaderProps = {
  data: HeaderData;
};

export default function AssignHeader({ data }: AssignHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        
        <h1 className="text-3xl font-semibold text-[#0A4833]">{data.title}</h1>
        <p className="mt-1 text-sm text-[#6B7280]">{data.subtitle}</p>
      </div>

      <div className="relative w-full max-w-[280px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder={data.searchPlaceholder}
          className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#111827] outline-none"
        />
      </div>
    </div>
  );
}
