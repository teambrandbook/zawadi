import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  ChartLine,
  Settings2,
  ShoppingBag,
} from "lucide-react";
import { NotificationsPageData } from "./types";

type Props = {
  priorityAlerts: NotificationsPageData["priorityAlerts"];
  quickActions: NotificationsPageData["quickActions"];
  preferences: NotificationsPageData["preferences"];
  activitySummary: NotificationsPageData["activitySummary"];
};

const alertIconMap = {
  orders: ShoppingBag,
  events: CalendarClock,
  consultation: BellRing,
};

export default function NotificationsSidebar({
  priorityAlerts,
  quickActions,
  preferences,
  activitySummary,
}: Props) {
  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#B48745]" />
          <h2 className="text-lg font-semibold text-[#0A4833]">Priority Alerts</h2>
        </div>
        <div className="mt-4 space-y-3">
          {priorityAlerts.map((alert) => {
            const Icon = alertIconMap[alert.icon];

            return (
              <article
                key={alert.title}
                className="rounded-lg border border-[rgba(180,135,69,0.28)] bg-[rgba(244,236,219,0.65)] p-3"
              >
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 text-[#B48745]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#0A4833]">{alert.title}</h3>
                    <p className="mt-1 text-xs text-[#4B5563]">{alert.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-lg font-semibold text-[#0A4833]">Quick Actions</h2>
        <div className="mt-4 space-y-2.5">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href ?? "#"}
              className={`flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors ${
                action.variant === "primary"
                  ? "border-[#0A4833] bg-[#0A4833] text-white hover:bg-[#083B2A]"
                  : action.variant === "outline"
                    ? "border-[#0A4833] text-[#0A4833] hover:bg-[#F7F3EC]"
                    : "border-[#DFDFDF] text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-lg font-semibold text-[#0A4833]">{preferences.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#4B5563]">{preferences.description}</p>
        <Link
          href={preferences.ctaHref ?? "#"}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#E5E7EB] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#D8DDE2]"
        >
          <Settings2 className="h-4 w-4" />
          {preferences.ctaLabel}
        </Link>
      </section>

      <section className="rounded-xl bg-[#0A4833] p-5 text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <ChartLine className="h-7 w-7 text-white" />
        <h2 className="mt-4 text-xl font-semibold">{activitySummary.title}</h2>
        <p className="mt-2 text-sm text-white/85">{activitySummary.description}</p>
        <Link
          href={activitySummary.ctaHref ?? "#"}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-[#0A4833] hover:bg-[#F3F4F6]"
        >
          {activitySummary.ctaLabel}
        </Link>
      </section>
    </aside>
  );
}
