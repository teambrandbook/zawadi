"use client";

import { useMemo, useState } from "react";
import { Bell, Clock3, Mail, MessageCircle, Users } from "lucide-react";
import NotificationsPanel from "@/components/consultant/notes/NotificationsPanel";
import type {
  NotificationCategory,
  NotificationItem,
  NotificationStatItem,
} from "@/components/consultant/notes/notificationTypes";

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
  const notificationsFromBackend = useMemo(() => backendNotifications, []);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [statusMessage, setStatusMessage] = useState("");

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
    setStatusMessage("Notification action is ready to connect to the backend mark-all-as-read endpoint.");
  }

  function handleLoadMore() {
    setStatusMessage("Load-more action is ready to connect to the backend pagination endpoint.");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotificationsPanel
          stats={backendNotificationStats}
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
