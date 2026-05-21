"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";

interface NotificationItem {
  receipt_id: number;
  notification?: {
    id: number;
    title: string;
    body: string;
  };
  title?: string;
  body?: string;
  message?: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

interface Props {
  onClose: () => void;
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

export default function NotificationDropdown({ onClose }: Props) {
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

  return (
    <div
      ref={ref}
      className="fixed right-3 top-20 z-50 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:absolute sm:right-0 sm:top-10 sm:w-80"
    >
      <div className="px-4 py-3 border-b font-semibold text-sm text-gray-700">Notifications</div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-center text-sm text-gray-500 py-6">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">No notifications yet</p>
        ) : (
          items.map((item) => {
            const title = item.notification?.title || item.title || "Notification";
            const body = item.notification?.body || item.body || item.message || "";

            return (
              <div
                key={item.receipt_id}
                className={`px-4 py-3 border-b last:border-0 ${item.is_read ? "bg-white" : "bg-green-50"}`}
              >
                <p className="text-sm font-medium text-gray-800">{title}</p>
                {body ? <p className="text-xs text-gray-500 mt-0.5">{body}</p> : null}
                <p className="text-xs text-gray-400 mt-1">{timeAgo(item.created_at)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
