"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import NotificationHeader from "./NotificationHeader";
import NotificationStatsGrid from "./NotificationStatsGrid";
import NotificationsList from "./NotificationsList";
import NotificationsSidebar from "./NotificationsSidebar";
import { ApiNotificationReceipt, NotificationItem, NotificationsPageData } from "./types";

// ─── helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function typeToIcon(t: ApiNotificationReceipt["notification_type"]): NotificationItem["icon"] {
  switch (t) {
    case "ALERT":      return "announcement";
    case "REMINDER":   return "consultation";
    case "PROMOTIONAL": return "events";
    default:           return "blog";
  }
}

function receiptToItem(r: ApiNotificationReceipt): NotificationItem {
  return {
    id: String(r.receipt_id),
    title: r.title,
    message: r.body,
    time: timeAgo(r.created_at),
    icon: typeToIcon(r.notification_type),
    tone: r.is_read ? "neutral" : "gold",
  };
}

// ─── static sidebar data (unchanged from original) ───────────────────────────

const SIDEBAR_DATA: Pick<
  NotificationsPageData,
  "priorityAlerts" | "quickActions" | "preferences" | "activitySummary"
> = {
  priorityAlerts: [],
  quickActions: [],
  preferences: {
    title: "Notification Preferences",
    description: "Manage how you receive notifications and stay updated",
    ctaLabel: "Manage Preferences",
    ctaHref: "/communityDashBoard/settings",
  },
  activitySummary: {
    title: "Activity Summary",
    description: "View your recent activity on the platform",
    ctaLabel: "View Dashboard",
    ctaHref: "/communityDashBoard",
  },
};

// ─── component ───────────────────────────────────────────────────────────────

type ActiveTab = "All" | "Unread";

export default function NotificationsPage() {
  const [receipts, setReceipts] = useState<ApiNotificationReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("All");
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch notifications from the real API
  const fetchReceipts = useCallback(async (unreadOnly = false) => {
    try {
      const url = unreadOnly
        ? "/notifications/inbox/?unread=true"
        : "/notifications/inbox/";
      const { data } = await api.get<ApiNotificationReceipt[]>(url);
      setReceipts(data);
    } catch {
      // silently keep whatever we already have
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts(activeTab === "Unread");
  }, [fetchReceipts, activeTab]);

  // Mark a single notification as read
  const handleMarkRead = useCallback(
    async (notificationId: number) => {
      try {
        await api.patch(`/notifications/inbox/${notificationId}/read/`);
        setReceipts((prev) =>
          prev.map((r) =>
            r.id === notificationId ? { ...r, is_read: true } : r
          )
        );
      } catch {
        // ignore
      }
    },
    []
  );

  // Mark all as read
  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true);
    try {
      await api.post("/notifications/inbox/mark-all-read/");
      setReceipts((prev) => prev.map((r) => ({ ...r, is_read: true })));
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  }, []);

  const handleDelete = useCallback(async (receiptId: number) => {
    try {
      await api.delete(`/notifications/inbox/${receiptId}/`);
      setReceipts((prev) => prev.filter((receipt) => receipt.receipt_id !== receiptId));
    } catch {
      // Keep the receipt visible if deletion failed.
    }
  }, []);

  // Derived counts
  const total = receipts.length;
  const unread = receipts.filter((r) => !r.is_read).length;

  // Map receipts to the UI NotificationItem shape
  const displayedReceipts =
    activeTab === "Unread" ? receipts.filter((r) => !r.is_read) : receipts;
  const notificationItems = displayedReceipts.map(receiptToItem);

  // Stats grid
  const stats: NotificationsPageData["stats"] = [
    { label: "Total Notifications", value: String(total), icon: "bell" },
    { label: "Unread", value: String(unread), icon: "unread", accent: "gold" },
  ];

  // Tabs
  const tabs: NotificationsPageData["tabs"] = [
    { label: "All", active: activeTab === "All" },
    { label: "Unread", active: activeTab === "Unread" },
  ];

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        <NotificationHeader
          title="Notifications"
          subtitle="Stay updated with your orders, consultations, events, approvals, and community activity."
        />
        <NotificationStatsGrid stats={stats} />

        {/* Tab bar + mark-all button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <section className="rounded-xl border border-[#DFDFDF] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label as ActiveTab)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                    tab.active
                      ? "bg-[#0A4833] text-white"
                      : "text-[#374151] hover:bg-[#F7F3EC]"
                  }`}
                >
                  {tab.label}
                  {tab.label === "Unread" && unread > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B48745] px-1 text-[10px] font-semibold text-white">
                      {unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {unread > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex h-9 items-center rounded-lg bg-[#0A4833] px-4 text-xs font-medium text-white hover:bg-[#083B2A] disabled:opacity-60"
            >
              {markingAll ? "Marking…" : "Mark all as read"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {loading ? (
              <p className="py-8 text-center text-sm text-[#6B7280]">Loading notifications…</p>
            ) : notificationItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#6B7280]">
                {activeTab === "Unread" ? "No unread notifications." : "No notifications yet."}
              </p>
            ) : (
              <NotificationsList
                notifications={notificationItems}
                onMarkRead={(id) => {
                  // Find the API notification id from receipt_id
                  const receipt = receipts.find((r) => String(r.receipt_id) === id);
                  if (receipt && !receipt.is_read) {
                    handleMarkRead(receipt.id);
                  }
                }}
                onDelete={(id) => {
                  void handleDelete(Number(id));
                }}
              />
            )}
          </div>

          <NotificationsSidebar
            priorityAlerts={SIDEBAR_DATA.priorityAlerts}
            quickActions={SIDEBAR_DATA.quickActions}
            preferences={SIDEBAR_DATA.preferences}
            activitySummary={SIDEBAR_DATA.activitySummary}
          />
        </div>
      </div>
    </section>
  );
}
