"use client";

import NotificationsFilters from "./components/NotificationsFilters";
import NotificationsHeaderAndStats from "./components/NotificationsHeaderAndStats";
import NotificationsTable from "./components/NotificationsTable";
import type { NotificationRow, NotificationStat } from "./types";

const stats: NotificationStat[] = [
  { id: "total", label: "Total Notifications", value: "2,847", icon: "bell" },
  { id: "scheduled", label: "Scheduled", value: "127", icon: "clock", valueTone: "gold" },
  { id: "sent", label: "Sent Today", value: "89", icon: "send", valueTone: "green" },
  { id: "open", label: "Open Rate", value: "78.5%", icon: "rate", valueTone: "blue" },
];

// Backend-ready data array.
const notificationRows: NotificationRow[] = [
  {
    id: "n-1",
    title: "New Buckwheat Recipe Collection",
    description: "Discover 15 new healthy recipes...",
    type: "Announcement",
    audience: "All Users (2,847)",
    channels: ["Email", "Push"],
    priority: "Medium",
    status: "Sent",
  },
  {
    id: "n-2",
    title: "Consultation Reminder",
    description: "Your session with Dr. Smith is tomorrow...",
    type: "Reminder",
    audience: "Consultation Users (342)",
    channels: ["In-app", "SMS"],
    priority: "High",
    status: "Scheduled",
  },
  {
    id: "n-3",
    title: "Weekly Wellness Event",
    description: "Join our community cooking session...",
    type: "Event",
    audience: "Event Participants (156)",
    channels: ["Email"],
    priority: "Low",
    status: "Draft",
  },
];

export default function NotificationsManagementPage() {
  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <NotificationsHeaderAndStats stats={stats} />
        <NotificationsFilters />
        <NotificationsTable rows={notificationRows} />
      </div>
    </section>
  );
}

