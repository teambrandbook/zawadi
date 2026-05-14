"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Clock3, Mail, MessageCircle, Users } from "lucide-react";
import NotificationsPanel from "@/components/consultant/notes/NotificationsPanel";
import api from "@/services/api";
import type {
  NotificationCategory,
  NotificationItem,
  NotificationStatItem,
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
  const category: NotificationItem["category"] = type.includes("event")
    ? "events"
    : type.includes("message")
      ? "messages"
      : type.includes("consult")
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

const backendNotificationStats: NotificationStatItem[] = [
  { id: "total", label: "Total Notifications", value: 47, tone: "sand", icon: Bell },
  { id: "unread", label: "Unread", value: 12, tone: "rose", icon: Mail },
  { id: "consultations", label: "Consultations", value: 8, tone: "green", icon: Users },
  { id: "messages", label: "Messages", value: 15, tone: "blue", icon: MessageCircle },
  { id: "reminders", label: "Reminders", value: 6, tone: "amber", icon: Clock3 },
];

const backendNotifications: NotificationItem[] = [
  {
    id: "urgent-consultation-reminder",
    title: "Urgent Consultation Reminder",
    description: "Consultation with Sarah Johnson scheduled in 30 minutes. Please review her buckwheat allergy history.",
    time: "2 minutes ago",
    category: "consultations",
    label: "High Priority",
    labelColor: "text-[#EF4444]",
    kind: "alert",
    unread: true,
    actions: [
      { id: "view-client", label: "View Client", tone: "primary" },
      { id: "mark-read-1", label: "Mark Read", tone: "secondary" },
    ],
  },
  {
    id: "message-from-michael",
    title: "New Message from Michael Chen",
    description: "Thank you for the buckwheat meal plan. I have a question about the preparation methods you recommended.",
    time: "15 minutes ago",
    category: "messages",
    label: "Message",
    labelColor: "text-[#2563EB]",
    kind: "message",
    unread: true,
    actions: [
      { id: "reply", label: "Reply", tone: "primary" },
      { id: "mark-read-2", label: "Mark Read", tone: "secondary" },
    ],
  },
  {
    id: "follow-up-completed",
    title: "Follow-up Appointment Completed",
    description: "Follow-up session with Emma Rodriguez has been completed successfully. Client showed great improvement.",
    time: "1 hour ago",
    category: "consultations",
    label: "Consultation",
    labelColor: "text-[#16A34A]",
    kind: "consultation",
    unread: false,
    muted: true,
    actions: [{ id: "view-notes", label: "View Notes", tone: "muted" }],
  },
  {
    id: "weekly-report-reminder",
    title: "Weekly Report Due Tomorrow",
    description: "Your weekly consultation report is due tomorrow. Please submit your client progress summaries.",
    time: "3 hours ago",
    category: "admin-alerts",
    label: "Reminder",
    labelColor: "text-[#A16207]",
    kind: "reminder",
    unread: true,
    actions: [
      { id: "start-report", label: "Start Report", tone: "primary" },
      { id: "dismiss", label: "Dismiss", tone: "secondary" },
    ],
  },
  {
    id: "buckwheat-workshop",
    title: "Buckwheat Workshop Next Week",
    description: "Advanced Buckwheat Nutrition Workshop scheduled for next Tuesday. Registration closes in 2 days.",
    time: "6 hours ago",
    category: "events",
    label: "Event",
    labelColor: "text-[#7E22CE]",
    kind: "event",
    unread: true,
    actions: [
      { id: "register", label: "Register", tone: "primary" },
      { id: "mark-read-3", label: "Mark Read", tone: "secondary" },
    ],
  },
  {
    id: "maintenance-complete",
    title: "System Maintenance Complete",
    description: "Scheduled system maintenance has been completed. All services are now fully operational.",
    time: "Yesterday",
    category: "admin-alerts",
    label: "Admin Alert",
    labelColor: "text-[#374151]",
    kind: "admin",
    unread: false,
    muted: true,
    actions: [],
  },
];

export default function ConsultantNotificationPage() {
  const [notificationsFromBackend, setNotificationsFromBackend] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiNotification[]>("/notifications/inbox/")
      .then(({ data }) => {
        if (isMounted) setNotificationsFromBackend(Array.isArray(data) ? data.map(mapNotification) : []);
      })
      .catch(() => {
        if (isMounted) setNotificationsFromBackend([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const notificationStats: NotificationStatItem[] = useMemo(() => [
    { id: "total", label: "Total Notifications", value: notificationsFromBackend.length, tone: "sand", icon: Bell },
    { id: "unread", label: "Unread", value: notificationsFromBackend.filter((item) => item.unread).length, tone: "rose", icon: Mail },
    { id: "consultations", label: "Consultations", value: notificationsFromBackend.filter((item) => item.category === "consultations").length, tone: "green", icon: Users },
    { id: "messages", label: "Messages", value: notificationsFromBackend.filter((item) => item.category === "messages").length, tone: "blue", icon: MessageCircle },
    { id: "reminders", label: "Reminders", value: notificationsFromBackend.filter((item) => item.kind === "reminder").length, tone: "amber", icon: Clock3 },
  ], [notificationsFromBackend]);

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

  function handleLoadMore() {
    setStatusMessage("All available notifications are loaded.");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotificationsPanel
          stats={notificationStats}
          notifications={visibleNotifications}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
