"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

import type { RootState } from "@/redux/store";
import { useInternalStaffPermissions } from "@/components/admindashboard/shared/InternalStaffPermissionsBootstrap";
import { toast } from "sonner";
import api from "@/services/api";
import { subscribeLiveNotifications } from "@/lib/liveNotifications";
import NotificationsFilters from "./components/NotificationsFilters";
import NotificationsHeaderAndStats from "./components/NotificationsHeaderAndStats";
import NotificationsTable from "./components/NotificationsTable";
import type { NotificationChannel, NotificationFiltersState, NotificationRow, NotificationStat } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiNotification(item: Record<string, any>): NotificationRow {
  const typeMap: Record<string, string> = {
    SYSTEM: "System Notice",
    ALERT: "Alert",
    REMINDER: "Reminder",
    PROMOTIONAL: "Promotional",
  };
  const channels: NotificationChannel[] = Array.isArray(item.delivery_channels)
    ? item.delivery_channels
        .map((channel: string) => (channel === "email" ? "Email" : channel === "in_app" ? "In-App" : channel === "push" ? "Push" : null))
        .filter((channel: NotificationChannel | null): channel is NotificationChannel => channel !== null)
    : ["In-App"];
  const typeValue = String(item.notification_type ?? "SYSTEM") as NotificationRow["typeValue"];

  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? "Untitled"),
    description: String(item.body ?? ""),
    type: typeMap[typeValue] ?? "System Notice",
    typeValue,
    audience: String(item.target_role ?? "ALL"),
    channels,
    status: item.status === "SCHEDULED" ? "Scheduled" : "Sent",
    createdAt: String(item.created_at ?? ""),
    scheduledAt: item.scheduled_at ? String(item.scheduled_at) : null,
    sentAt: item.sent_at ? String(item.sent_at) : null,
  };
}

function buildStats(rows: NotificationRow[]): NotificationStat[] {
  const total = rows.length;
  const scheduled = rows.filter((row) => row.status === "Scheduled").length;
  const sent = rows.filter((row) => row.status === "Sent").length;
  const audiences = new Set(rows.map((row) => row.audience)).size;

  return [
    { id: "total", label: "Total Notifications", value: String(total), icon: "bell" },
    { id: "scheduled", label: "Scheduled", value: String(scheduled), icon: "clock", valueTone: "gold" },
    { id: "sent", label: "Sent", value: String(sent), icon: "send", valueTone: "green" },
    { id: "audiences", label: "Audiences", value: String(audiences), icon: "users", valueTone: "blue" },
  ];
}

export default function NotificationsManagementPage() {
  const role = useSelector((state: RootState) => state.user.role);
  const permissions = useInternalStaffPermissions();
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<NotificationFiltersState>({
    status: "all",
    type: "all",
    audience: "all",
    channel: "all",
    sort: "newest",
  });
  const notificationPermission = permissions.find(({ module }) => module === "notifications");
  const canCreateNotifications =
    role !== "internal_staff" || Boolean(notificationPermission?.full_access || notificationPermission?.can_create);

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

  useEffect(() => {
    return subscribeLiveNotifications((data) => {
      setRows((currentRows) => {
        const nextRow = mapApiNotification({
          id: data.notification_id ?? data.id,
          title: data.title,
          body: data.body ?? data.message,
          notification_type: data.notification_type,
          target_role: data.target_role,
          delivery_channels: ["in_app"],
          status: "SENT",
          created_at: data.created_at ?? new Date().toISOString(),
          sent_at: data.created_at ?? new Date().toISOString(),
        });

        if (currentRows.some((row) => row.id === nextRow.id)) return currentRows;
        return [nextRow, ...currentRows];
      });
    });
  }, []);

  const stats = useMemo(() => buildStats(rows), [rows]);
  const audienceOptions = useMemo(() => Array.from(new Set(rows.map((row) => row.audience))), [rows]);
  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const visible = rows.filter((row) => {
      const searchMatch =
        query.length === 0 ||
        row.title.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query) ||
        row.type.toLowerCase().includes(query) ||
        row.audience.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query);
      const statusMatch = filters.status === "all" || row.status === filters.status;
      const typeMatch = filters.type === "all" || row.typeValue === filters.type;
      const audienceMatch = filters.audience === "all" || row.audience === filters.audience;
      const channelMatch = filters.channel === "all" || row.channels.includes(filters.channel);
      return searchMatch && statusMatch && typeMatch && audienceMatch && channelMatch;
    });

    return visible.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return filters.sort === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [filters, rows, searchTerm]);

  async function handleDelete(row: NotificationRow) {
    if (!window.confirm(`Delete "${row.title}"? This removes it from recipient inboxes too.`)) return;
    setDeletingId(row.id);
    try {
      await api.delete(`/notifications/${row.id}/`);
      setRows((currentRows) => currentRows.filter((item) => item.id !== row.id));
      toast.success("Notification deleted.");
    } catch {
      toast.error("Failed to delete notification.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <NotificationsHeaderAndStats
          stats={stats}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          canCreateNotifications={canCreateNotifications}
        />
        <NotificationsFilters filters={filters} onChange={setFilters} audienceOptions={audienceOptions} />

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
        {!isLoading && !fetchError && rows.length > 0 && filteredRows.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No notifications match the current search and filters.
          </div>
        )}

        {!isLoading && filteredRows.length > 0 && (
          <NotificationsTable rows={filteredRows} deletingId={deletingId} onDelete={handleDelete} />
        )}
      </div>
    </section>
  );
}
