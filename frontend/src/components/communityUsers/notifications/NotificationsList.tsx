import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Megaphone,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { NotificationsPageData } from "./types";

type Props = {
  notifications: NotificationsPageData["notifications"];
};

const iconMap = {
  orders: ShoppingBag,
  events: CalendarDays,
  consultation: ClipboardList,
  recipes: UtensilsCrossed,
  diet: FileText,
  confirmed: CheckCircle2,
  announcement: Megaphone,
  blog: Bell,
};

export default function NotificationsList({ notifications }: Props) {
  return (
    <div className="space-y-4">
      {notifications.map((item) => {
        const Icon = iconMap[item.icon];
        const borderClass = item.tone === "gold" ? "border-l-[#B48745]" : "border-l-[#E5E7EB]";
        const iconShellClass =
          item.tone === "gold" ? "bg-[#F5EEDF] text-[#A67C3D]" : "bg-[#F3F4F6] text-[#6B7280]";

        return (
          <article
            key={item.id}
            className={`rounded-xl border border-[#DFDFDF] border-l-4 ${borderClass} bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconShellClass}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[#0A4833]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#4B5563]">{item.message}</p>
                <p className="mt-3 text-xs text-[#6B7280]">{item.time}</p>
              </div>

              {item.actions && item.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {item.actions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href ?? "#"}
                      className={`inline-flex h-8 items-center rounded-lg px-4 text-xs font-medium transition-colors ${
                        action.variant === "secondary"
                          ? "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                          : action.variant === "ghost"
                            ? "border border-[#DFDFDF] text-[#374151] hover:bg-[#F9FAFB]"
                            : "bg-[#0A4833] text-white hover:bg-[#083B2A]"
                      }`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}

      <div className="pt-2 text-center">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#0A4833] px-6 text-sm font-medium text-[#0A4833] hover:bg-[#F7F3EC]"
        >
          Load More Notifications
        </button>
      </div>
    </div>
  );
}
