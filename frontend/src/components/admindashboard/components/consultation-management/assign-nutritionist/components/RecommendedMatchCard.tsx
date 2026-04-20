import { Star } from "lucide-react";
import type { RecommendedMatchData } from "../assignNutritionistTypes";

type RecommendedMatchCardProps = {
  data: RecommendedMatchData;
};

export default function RecommendedMatchCard({ data }: RecommendedMatchCardProps) {
  return (
    <div className="rounded-xl border border-[#D8C8A8] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
        <Star size={14} className="fill-[#C29B5C] text-[#C29B5C]" />
        {data.title}
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={data.image} alt={data.name} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">{data.name}</p>
              <p className="text-xs text-[#6B7280]">{data.role}</p>
              <p className="text-xs text-[#6B7280]">
                <span className="text-[#EAB308]">Rating:</span> {data.rating} {data.reviewsText}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#15803D]">{data.statusText}</div>
            <p className="mt-1 text-xs text-[#6B7280]">{data.nextSlotText}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-[#4B5563]">{data.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">{data.activeConsultationsText}</p>
          <button className="rounded-md bg-[#0A4833] px-5 py-2 text-sm font-medium text-white">{data.ctaLabel}</button>
        </div>
      </div>
    </div>
  );
}
