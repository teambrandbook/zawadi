"use client";

import NotificationHeader from "./NotificationHeader";
import NotificationListItem from "./NotificationListItem";
import NotificationTabs from "./NotificationTabs";
import type { NotificationCategory, NotificationItem } from "./notificationTypes";

const tabs: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "consultations", label: "Consultations" },
  { id: "admin-alerts", label: "Admin Alerts" },
];

type Props = {
  notifications: NotificationItem[];
  activeTab: NotificationCategory;
  onTabChange: (tab: NotificationCategory) => void;
  onMarkRead: (receiptId: string) => void;
  onMarkAllAsRead: () => void;
  onLoadMore: () => void;
};

export default function NotificationsPanel({
  notifications,
  activeTab,
  onTabChange,
  onMarkRead,
  onMarkAllAsRead,
  onLoadMore,
}: Props) {
  return (
    <section className="space-y-5">
      <NotificationHeader onMarkAllAsRead={onMarkAllAsRead} />

      <div className="overflow-hidden rounded-[14px] border border-[#DFDFDF] bg-white">
        <NotificationTabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

        <div>
          {notifications.map((item) => (
            <NotificationListItem key={item.id} item={item} onMarkRead={onMarkRead} />
          ))}
          {notifications.length === 0 ? (
            <div className="border-t border-[#DFDFDF] px-6 py-8 text-center text-sm text-[#6B7280]">
              No notifications found.
            </div>
          ) : null}
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

