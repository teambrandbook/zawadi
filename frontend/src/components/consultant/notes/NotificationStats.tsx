"use client";

import type { NotificationStatItem } from "./notificationTypes";

const toneClasses = {
  sand: "bg-[#EBE1CF] text-[#0A4833]",
  rose: "bg-[#FEF2F2] text-[#EF4444]",
  green: "bg-[#F0FDF4] text-[#22C55E]",
  blue: "bg-[#EFF6FF] text-[#3B82F6]",
  amber: "bg-[#FEFCE8] text-[#EAB308]",
};

type Props = {
  stats: NotificationStatItem[];
};

export default function NotificationStats({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article key={stat.id} className="rounded-[12px] border border-[#DFDFDF] bg-white px-4 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#A88751]">{stat.label}</p>
                <p className="mt-2 text-[18px] font-bold leading-none text-[#0A4833]">{stat.value}</p>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${toneClasses[stat.tone]}`}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

