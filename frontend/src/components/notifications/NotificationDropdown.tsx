"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import api from "@/services/api";
import type { LiveNotification } from "@/lib/liveNotifications";

interface NotificationItem {
  receipt_id: number;
  id: number;
  notification?: {
    id: number;
    title: string;
    body: string;
  };
  title?: string;
  body?: string;
  message?: string;
  action_url?: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

interface NotificationDropdownProps {
  onClose: () => void;
  liveNotifications?: LiveNotification[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationDropdown({ onClose, liveNotifications = [] }: NotificationDropdownProps) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/notifications/inbox/?limit=10")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setItems(list.slice(0, 10));
        api.post("/notifications/inbox/mark-all-read/").catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function openDestination(actionUrl?: string) {
    if (!actionUrl || !actionUrl.startsWith("/") || actionUrl.startsWith("//")) return;
    onClose();
    router.push(actionUrl);
  }

  async function deleteReceipt(receiptId: number) {
    try {
      await api.delete(`/notifications/inbox/${receiptId}/`);
      setItems((currentItems) => currentItems.filter((item) => item.receipt_id !== receiptId));
    } catch {
      // Keep the receipt visible if deletion failed.
    }
  }

  const persistedNotificationIds = new Set(items.map((item) => item.id));
  const seenLiveNotificationIds = new Set<number>();
  const uniqueLiveNotifications = liveNotifications.filter((item) => {
    const notificationId = Number(item.notification_id || item.id);
    if (!notificationId || persistedNotificationIds.has(notificationId) || seenLiveNotificationIds.has(notificationId)) {
      return false;
    }
    seenLiveNotificationIds.add(notificationId);
    return true;
  });

  return (
    <div
      ref={ref}
      className="fixed right-3 top-20 z-50 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:absolute sm:right-0 sm:top-10 sm:w-80"
    >
      <div className="px-4 py-3 border-b font-semibold text-sm text-gray-700">Notifications</div>
      <div className="max-h-80 overflow-y-auto">
        
        {/* Realtime Notifications UI Section */}
        {uniqueLiveNotifications.length > 0 && (
          <div className="flex flex-col">
            {uniqueLiveNotifications.map((item) => (
              <button
                type="button"
                key={`live-${item.notification_id || item.id}`}
                onClick={() => openDestination(item.action_url)}
                className="w-full border-b border-gray-100 bg-[#F9F6F1] p-4 text-left"
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  {item.message || item.body}
                </p>
                <p className="text-xs text-gray-400 mt-1">just now</p>
              </button>
            ))}
          </div>
        )}

        {/* Historical Database Notifications Section */}
        {loading ? (
          <p className="text-center text-sm text-gray-500 py-6">Loading...</p>
        ) : items.length === 0 && uniqueLiveNotifications.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">No notifications yet</p>
        ) : (
          items.map((item) => {
            const title = item.notification?.title || item.title || "Notification";
            const body = item.notification?.body || item.body || item.message || "";

            return (
              <div
                key={item.receipt_id}
                className={`flex items-start border-b last:border-0 ${item.is_read ? "bg-white" : "bg-green-50"}`}
              >
                <button
                  type="button"
                  onClick={() => openDestination(item.action_url)}
                  className="min-w-0 flex-1 px-4 py-3 text-left"
                >
                  <p className="text-sm font-medium text-gray-800">{title}</p>
                  {body ? <p className="text-xs text-gray-500 mt-0.5">{body}</p> : null}
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(item.created_at)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => void deleteReceipt(item.receipt_id)}
                  className="m-2 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${title}`}
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
