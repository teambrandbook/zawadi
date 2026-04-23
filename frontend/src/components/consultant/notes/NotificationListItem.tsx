"use client";

import {
  AlertTriangle,
  Bell,
  CalendarCheck2,
  Clock3,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import type { NotificationAction, NotificationItem, NotificationKind } from "./notificationTypes";

const kindStyles: Record<NotificationKind, { icon: typeof Bell; wrapper: string }> = {
  alert: { icon: AlertTriangle, wrapper: "bg-[#FEF2F2] text-[#EF4444]" },
  message: { icon: MessageCircle, wrapper: "bg-[#EFF6FF] text-[#3B82F6]" },
  consultation: { icon: CalendarCheck2, wrapper: "bg-[#F0FDF4] text-[#22C55E]" },
  reminder: { icon: Clock3, wrapper: "bg-[#FEFCE8] text-[#EAB308]" },
  event: { icon: Users, wrapper: "bg-[#FAF5FF] text-[#A855F7]" },
  admin: { icon: Shield, wrapper: "bg-[#F3F4F6] text-[#6B7280]" },
};

const actionClasses: Record<NotificationAction["tone"], string> = {
  primary: "text-[#0A4833]",
  secondary: "text-[#A88751]",
  muted: "text-[#9CA3AF]",
};

type Props = {
  item: NotificationItem;
};

export default function NotificationListItem({ item }: Props) {
  const Icon = kindStyles[item.kind].icon;

  return (
    <article className="border-t border-[#DFDFDF] px-4 py-5 first:border-t-0 lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] ${kindStyles[item.kind].wrapper}`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className={`text-base font-semibold ${item.muted ? "text-[#6B7280]" : "text-[#0A4833]"}`}>{item.title}</h3>
              <span className={`text-xs font-medium ${item.labelColor}`}>{item.label}</span>
              {item.badgeText ? <span className={`text-xs font-medium ${item.badgeColor}`}>{item.badgeText}</span> : null}
              {item.unread ? <span className="h-2 w-2 rounded-full bg-[#3B82F6]" /> : null}
            </div>

            <p className={`mt-1 text-sm ${item.muted ? "text-[#9CA3AF]" : "text-[#4B5563]"}`}>{item.description}</p>
            <p className={`mt-2 text-xs font-medium ${item.muted ? "text-[#9CA3AF]" : "text-[#A88751]"}`}>{item.time}</p>
          </div>
        </div>

        {item.actions.length ? (
          <div className="flex flex-wrap items-center gap-5 pl-14 lg:justify-end lg:pl-4">
            {item.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`text-sm font-medium transition hover:opacity-80 ${actionClasses[action.tone]}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

