"use client";

import { useEffect, useMemo, useState } from "react";
import NotificationsPanel from "@/components/consultant/notes/NotificationsPanel";
import api from "@/services/api";
import type {
  NotificationCategory,
  NotificationItem,
} from "@/components/consultant/notes/notificationTypes";

type ApiNotification = {
  receipt_id: number;
  id: number;
  title: string;
  body: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
};

type ApiBooking = {
  id: number;
  user_name?: string | null;
  booked_date?: string;
  booked_slot?: string;
  status?: string;
};

function timeAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function mapNotification(item: ApiNotification): NotificationItem {
  const type = item.notification_type.toLowerCase();
  const searchableText = `${item.title} ${item.body} ${type}`.toLowerCase();
  const category: NotificationItem["category"] = searchableText.includes("event")
    ? "events"
    : searchableText.includes("message")
      ? "messages"
      : searchableText.includes("consult") || searchableText.includes("booking") || searchableText.includes("request")
        ? "consultations"
        : "admin-alerts";

  return {
    id: String(item.receipt_id),
    title: item.title,
    description: item.body,
    time: timeAgo(item.created_at),
    category,
    label: item.notification_type || "Notification",
    labelColor: item.is_read ? "text-[#6B7280]" : "text-[#0A4833]",
    kind: category === "events" ? "event" : category === "messages" ? "message" : category === "consultations" ? "consultation" : "admin",
    unread: !item.is_read,
    actions: item.is_read ? [] : [{ id: "mark-read", label: "Mark Read", tone: "secondary" }],
  };
}

function formatBookingDate(value?: string) {
  if (!value) return "the selected date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function mapPendingBooking(item: ApiBooking): NotificationItem {
  const clientName = item.user_name || "A community user";

  return {
    id: `booking-${item.id}`,
    title: "New consultation request",
    description: `${clientName} requested a consultation on ${formatBookingDate(item.booked_date)} at ${item.booked_slot || "the selected time"}.`,
    time: "Pending approval",
    category: "consultations",
    label: "Consultation",
    labelColor: "text-[#0A4833]",
    kind: "consultation",
    unread: true,
    actions: [],
  };
}

export default function ConsultantNotificationPage() {
  const [notificationsFromBackend, setNotificationsFromBackend] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get<ApiNotification[]>("/notifications/inbox/"),
      api.get<ApiBooking[]>("/consultant/bookings/"),
    ])
      .then(([notificationsResponse, bookingsResponse]) => {
        if (!isMounted) return;

        const notifications =
          notificationsResponse.status === "fulfilled" && Array.isArray(notificationsResponse.value.data)
            ? notificationsResponse.value.data.map(mapNotification)
            : [];
        const pendingBookingNotifications =
          bookingsResponse.status === "fulfilled" && Array.isArray(bookingsResponse.value.data)
            ? bookingsResponse.value.data
                .filter((booking) => String(booking.status ?? "").toLowerCase() === "pending")
                .map(mapPendingBooking)
            : [];

        setNotificationsFromBackend([...pendingBookingNotifications, ...notifications]);
      })
      .catch(() => {
        if (isMounted) setNotificationsFromBackend([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notificationsFromBackend;
    }

    if (activeTab === "unread") {
      return notificationsFromBackend.filter((item) => item.unread);
    }

    return notificationsFromBackend.filter((item) => item.category === activeTab);
  }, [activeTab, notificationsFromBackend]);

  function handleMarkAllAsRead() {
    api.post("/notifications/inbox/mark-all-read/")
      .then(() => {
        setNotificationsFromBackend((current) => current.map((item) => ({ ...item, unread: false, actions: [] })));
        setStatusMessage("All notifications marked as read.");
      })
      .catch(() => setStatusMessage("Unable to mark notifications as read."));
  }

  function handleMarkRead(receiptId: string) {
    api.patch(`/notifications/inbox/${receiptId}/read/`)
      .then(() => {
        setNotificationsFromBackend((current) =>
          current.map((item) => item.id === receiptId ? { ...item, unread: false, actions: [] } : item)
        );
      })
      .catch(() => setStatusMessage("Unable to mark notification as read."));
  }

  function handleLoadMore() {
    setStatusMessage("All available notifications are loaded.");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotificationsPanel
          notifications={visibleNotifications}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMarkRead={handleMarkRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onLoadMore={handleLoadMore}
        />

        {statusMessage ? (
          <div className="rounded-[10px] border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm text-[#0A4833]">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </main>
  );
}
