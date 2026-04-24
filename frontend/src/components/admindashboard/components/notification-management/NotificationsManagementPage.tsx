"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import NotificationsFilters from "./components/NotificationsFilters";
import NotificationsHeaderAndStats from "./components/NotificationsHeaderAndStats";
import NotificationsTable from "./components/NotificationsTable";
import type { NotificationRow, NotificationStat } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiNotification(item: Record<string, any>): NotificationRow {
  const typeMap: Record<string, string> = {
    SYSTEM: "System Notice",
    ALERT: "Alert",
    REMINDER: "Reminder",
    PROMOTIONAL: "Promotional",
  };
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? "Untitled"),
    description: String(item.body ?? ""),
    type: typeMap[String(item.notification_type ?? "SYSTEM")] ?? "Announcement",
    audience: String(item.target_role ?? "All Users"),
    channels: ["In-App"],
    priority: "Medium",
    status: item.status === "SENT" ? "Sent" : item.status === "SCHEDULED" ? "Scheduled" : "Draft",
  };
}

function buildStats(rows: NotificationRow[]): NotificationStat[] {
  const total = rows.length;
  const scheduled = rows.filter((r) => r.status === "Scheduled").length;
  const sent = rows.filter((r) => r.status === "Sent").length;

  return [
    { id: "total", label: "Total Notifications", value: String(total), icon: "bell" },
    { id: "scheduled", label: "Scheduled", value: String(scheduled), icon: "clock", valueTone: "gold" },
    { id: "sent", label: "Sent", value: String(sent), icon: "send", valueTone: "green" },
    { id: "open", label: "Open Rate", value: "—", icon: "rate", valueTone: "blue" },
  ];
}

export default function NotificationsManagementPage() {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/notifications/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRows(raw.map(mapApiNotification));
      } catch {
        setFetchError("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const stats = useMemo(() => buildStats(rows), [rows]);

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <NotificationsHeaderAndStats stats={stats} />
        <NotificationsFilters />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading notifications...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && rows.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No notifications found. Create the first one using the button above.
          </div>
        )}

        {!isLoading && rows.length > 0 && (
          <NotificationsTable rows={rows} />
        )}
      </div>
    </section>
  );
}
