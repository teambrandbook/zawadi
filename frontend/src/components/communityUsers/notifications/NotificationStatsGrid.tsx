import {
  Bell,
  BellDot,
  CalendarDays,
  ClipboardList,
  ShoppingBag,
  Users,
} from "lucide-react";
import { NotificationsPageData } from "./types";

type Props = {
  stats: NotificationsPageData["stats"];
};

const iconMap = {
  bell: Bell,
  unread: BellDot,
  orders: ShoppingBag,
  consultation: ClipboardList,
  events: CalendarDays,
  community: Users,
};

export default function NotificationStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const valueClass = stat.accent === "gold" ? "text-[#9F8151]" : "text-[#0A4833]";

        return (
          <article
            key={stat.label}
            className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Icon className="h-5 w-5 text-[#0A4833]" />
            <p className={`mt-4 text-[34px] font-bold leading-none ${valueClass}`}>{stat.value}</p>
            <p className="mt-2 text-sm text-[#4B5563]">{stat.label}</p>
          </article>
        );
      })}
    </div>
  );
}
