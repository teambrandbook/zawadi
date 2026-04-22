"use client";

import NotificationHeader from "./NotificationHeader";
import NotificationListItem from "./NotificationListItem";
import NotificationStats from "./NotificationStats";
import NotificationTabs from "./NotificationTabs";
import type { NotificationCategory, NotificationItem, NotificationStatItem } from "./notificationTypes";

const tabs: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "consultations", label: "Consultations" },
  { id: "messages", label: "Messages" },
  { id: "events", label: "Events" },
  { id: "admin-alerts", label: "Admin Alerts" },
];

type Props = {
  stats: NotificationStatItem[];
  notifications: NotificationItem[];
  activeTab: NotificationCategory;
  onTabChange: (tab: NotificationCategory) => void;
  onMarkAllAsRead: () => void;
  onLoadMore: () => void;
};

export default function NotificationsPanel({
  stats,
  notifications,
  activeTab,
  onTabChange,
  onMarkAllAsRead,
  onLoadMore,
}: Props) {
  return (
    <section className="space-y-5">
      <NotificationHeader onMarkAllAsRead={onMarkAllAsRead} />
      <NotificationStats stats={stats} />

      <div className="overflow-hidden rounded-[14px] border border-[#DFDFDF] bg-white">
        <NotificationTabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

        <div>
          {notifications.map((item) => (
            <NotificationListItem key={item.id} item={item} />
          ))}
        </div>

        <div className="border-t border-[#DFDFDF] px-4 py-5 text-center">
          <button type="button" onClick={onLoadMore} className="text-sm font-medium text-[#0A4833] transition hover:opacity-80">
            Load More Notifications
          </button>
        </div>
      </div>
    </section>
  );
}

