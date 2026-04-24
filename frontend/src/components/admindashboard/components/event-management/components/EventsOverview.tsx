import { CalendarDays, CheckCircle2, Clock3, FileText, PlayCircle, Search, TrendingUp, Users, XCircle } from "lucide-react";
import type { EventStat } from "../types";
import { useRouter } from "next/navigation";

type EventsOverviewProps = {
  stats: EventStat[];
};

function statIcon(icon: EventStat["icon"]) {
  if (icon === "calendar") return CalendarDays;
  if (icon === "clock") return Clock3;
  if (icon === "play") return PlayCircle;
  if (icon === "users") return Users;
  if (icon === "check") return CheckCircle2;
  if (icon === "draft") return FileText;
  if (icon === "cancel") return XCircle;
  return TrendingUp;
}

function statIconTone(id: EventStat["id"]) {
  if (id === "total") return "bg-[#E7EFED] text-[#0A4833]";
  if (id === "upcoming") return "bg-[#F3EFE7] text-[#9F8151]";
  if (id === "ongoing") return "bg-[#E7F3EB] text-[#16A34A]";
  if (id === "registrations") return "bg-[#F3EFE7] text-[#9F8151]";
  if (id === "completed") return "bg-[#EAF0FF] text-[#2563EB]";
  if (id === "draft") return "bg-[#F5EFE2] text-[#C98A00]";
  if (id === "cancelled") return "bg-[#FFF1F1] text-[#EF4444]";
  return "bg-[#F3EFE7] text-[#9F8151]";
}

function statBadgeTone(id: EventStat["id"]) {
  if (id === "upcoming" || id === "ongoing") return "text-[#15803D]";
  return "text-[#9F8151]";
}

export default function EventsOverview({ stats }: EventsOverviewProps) {
  const router = useRouter();

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0A4833]">Events Management</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full min-w-[220px] lg:w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96A39D]" />
            <input
              type="text"
              placeholder="Search events..."
              className="h-[38px] w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] pl-9 pr-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
          <button
            type="button"
            onClick={() => router.push("/admindashboard/events/create")}
            className="h-10 rounded-md bg-[#0A4833] px-4 text-sm font-medium text-white flex-shrink-0"
          >
            + Create Event
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = statIcon(item.icon);
          return (
            <article key={item.id} className="rounded-[10px] border border-[#DFDFDF] bg-white p-4">
              <div className="flex items-start justify-between">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${statIconTone(item.id)}`}>
                  <Icon size={16} />
                </div>
                {item.label && <p className={`text-xs ${statBadgeTone(item.id)}`}>{item.label}</p>}
              </div>

              <p className="mt-3 text-[36px] font-semibold leading-none text-[#0A4833]">{item.value}</p>
              <p className="mt-2 text-sm text-[#7F9A90]">{item.subText}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
