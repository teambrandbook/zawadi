import { Bell, Clock3, Plus, Search, Send, TrendingUp } from "lucide-react";
import type { NotificationStat } from "../types";
import Link from "next/link";

type NotificationsHeaderAndStatsProps = {
  stats: NotificationStat[];
};

function statIcon(icon: NotificationStat["icon"]) {
  if (icon === "bell") return Bell;
  if (icon === "clock") return Clock3;
  if (icon === "send") return Send;
  return TrendingUp;
}

function statIconTone(icon: NotificationStat["icon"]) {
  if (icon === "bell") return "bg-[#E7EFED] text-[#0A4833]";
  if (icon === "clock") return "bg-[#F3EFE7] text-[#9F8151]";
  if (icon === "send") return "bg-[#E7F3EB] text-[#16A34A]";
  return "bg-[#EAF0FF] text-[#2563EB]";
}

function statValueTone(tone: NotificationStat["valueTone"]) {
  if (tone === "blue") return "text-[#2563EB]";
  if (tone === "green") return "text-[#16A34A]";
  if (tone === "gold") return "text-[#9F8151]";
  return "text-[#0A4833]";
}

export default function NotificationsHeaderAndStats({ stats }: NotificationsHeaderAndStatsProps) {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0A4833]">Notifications</h1>
          <div className="relative w-full min-w-[220px] md:w-[320px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#96A39D]" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] pl-9 pr-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="h-10 rounded-md border border-[#DFDFDF] bg-white px-4 text-sm text-[#111827]">Filter</button>
          <button className="h-10 rounded-md border border-[#DFDFDF] bg-white px-4 text-sm text-[#111827]">Export</button>
          <Link
            href="/admindashboard/notifications/create"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0A4833] px-4 text-sm text-white"
          >
            <Plus size={15} />
            Create Notification
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = statIcon(item.icon);
          return (
            <article key={item.id} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#5E7E72]">{item.label}</p>
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${statIconTone(item.icon)}`}>
                  <Icon size={15} />
                </div>
              </div>
              <p className={`mt-2 text-4xl font-semibold leading-none ${statValueTone(item.valueTone)}`}>{item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
