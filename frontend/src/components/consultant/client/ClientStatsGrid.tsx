"use client";

import { AlertTriangle, CircleAlert, UserPlus, Users } from "lucide-react";
import type { ClientStatCard } from "./clientTypes";

const iconMap = {
  total: Users,
  active: Users,
  new: UserPlus,
  followUp: CircleAlert,
  priority: AlertTriangle,
} as const;

type Props = {
  stats: ClientStatCard[];
};

export default function ClientStatsGrid({ stats }: Props) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = iconMap[item.id as keyof typeof iconMap] ?? Users;

        return (
          <article
            key={item.id}
            className="rounded-[12px] border border-[#E4E7EC] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(16,24,40,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[#667085]">{item.label}</p>
                <p className={`mt-2 text-[30px] font-semibold leading-none ${item.tone}`}>{item.value}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F6F7F8]">
                <Icon className={`h-4 w-4 ${item.tone}`} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
