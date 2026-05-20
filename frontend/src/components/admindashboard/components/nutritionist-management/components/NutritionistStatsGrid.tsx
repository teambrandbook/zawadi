import { CalendarDays, CheckCircle2, CheckCheck, Clock3, ListChecks, PauseCircle, Star, UsersRound } from "lucide-react";
import type { NutritionistStatCard } from "../nutritionistTypes";

type NutritionistStatsGridProps = {
  items: NutritionistStatCard[];
};

function iconByType(icon: NutritionistStatCard["icon"]) {
  if (icon === "users") return UsersRound;
  if (icon === "check") return CheckCircle2;
  if (icon === "calendar") return CalendarDays;
  if (icon === "star") return Star;
  if (icon === "clock") return Clock3;
  if (icon === "pause") return PauseCircle;
  if (icon === "list") return ListChecks;
  return CheckCheck;
}

function iconTone(tone: NutritionistStatCard["iconTone"]) {
  if (tone === "green") return "bg-[#E9EFEA] text-[#0A4833]";
  if (tone === "gold") return "bg-[#F3EFE7] text-[#9F8151]";
  if (tone === "teal") return "bg-[#E7EFED] text-[#0A5B48]";
  return "bg-[#E9EDEE] text-[#7B8B88]";
}

export default function NutritionistStatsGrid({ items }: NutritionistStatsGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = iconByType(item.icon);
        const isNameCard = item.id === "top";

        return (
          <article key={item.id} className="h-[126px] overflow-hidden rounded-xl border border-[#DFDFDF] bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconTone(item.iconTone)}`}>
                <Icon size={15} />
              </div>
              <p className="truncate text-[11px] text-[#9F8151]">{item.label}</p>
            </div>

            <p
              className={
                isNameCard
                  ? "mt-3 truncate text-[18px] font-semibold leading-tight text-[#0A4833]"
                  : "mt-3 truncate text-[28px] font-semibold leading-none text-[#0A4833]"
              }
              title={item.value}
            >
              {item.value}
            </p>
            <p className="mt-1.5 truncate text-xs text-[#7C9B90]">{item.subText}</p>
          </article>
        );
      })}
    </section>
  );
}
