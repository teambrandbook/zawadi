"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/redux/store";
import { getNotificationSocketUrl } from "@/lib/notificationsSocket";
import { emitLiveNotification, type LiveNotification } from "@/lib/liveNotifications";
import {
  canUsePushNotifications,
  enablePushNotifications,
  refreshPushRegistration,
  subscribeForegroundPush,
} from "@/lib/firebaseMessaging";

const PROMPT_DISMISSED_KEY = "zewadi_push_prompt_dismissed";

function payloadToNotification(payload: {
  notification?: { title?: string; body?: string };
  data?: Record<string, string>;
}): LiveNotification | null {
  const notificationId = Number(payload.data?.notification_id);
  if (!notificationId) return null;
  const body = payload.notification?.body || "";
  return {
    type: "notification",
    id: notificationId,
    notification_id: notificationId,
    title: payload.notification?.title || "Zewadi notification",
    body,
    message: body,
    notification_type: payload.data?.notification_type,
    created_at: new Date().toISOString(),
    action_url: payload.data?.action_url,
  };
}

export default function PushNotificationManager() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [showPrompt, setShowPrompt] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    void canUsePushNotifications().then((supported) => {
      if (!supported || cancelled) return;
      if (Notification.permission === "granted") {
        void refreshPushRegistration().catch(() => {});
      } else if (Notification.permission === "denied") {
        setPermissionDenied(true);
      } else if (!localStorage.getItem(PROMPT_DISMISSED_KEY)) {
        setShowPrompt(true);
      }
    });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let reconnectAttempt = 0;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      socket = new WebSocket(getNotificationSocketUrl());
      socket.onopen = () => { reconnectAttempt = 0; };
      socket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data) as LiveNotification;
          if (notification.type === "notification") emitLiveNotification(notification);
        } catch {
          // Ignore malformed websocket messages.
        }
      };
      socket.onclose = () => {
        if (cancelled) return;
        const delay = Math.min(30_000, 1_000 * 2 ** reconnectAttempt);
        reconnectAttempt += 1;
        reconnectTimer = window.setTimeout(connect, delay);
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let unsubscribe = () => {};
    let cancelled = false;
    void subscribeForegroundPush((payload) => {
      const notification = payloadToNotification(payload);
      if (notification && emitLiveNotification(notification)) {
        toast(notification.title, {
          description: notification.body,
          action: notification.action_url
            ? { label: "Open", onClick: () => window.location.assign(notification.action_url as string) }
            : undefined,
        });
      }
    }).then((cleanup) => {
      if (cancelled) cleanup();
      else unsubscribe = cleanup;
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAuthenticated]);

  async function handleEnable() {
    setIsEnabling(true);
    try {
      await enablePushNotifications();
      setShowPrompt(false);
      setPermissionDenied(false);
      toast.success("Browser notifications enabled.");
    } catch (error) {
      setPermissionDenied(typeof Notification !== "undefined" && Notification.permission === "denied");
      toast.error(error instanceof Error ? error.message : "Could not enable browser notifications.");
    } finally {
      setIsEnabling(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
    setShowPrompt(false);
    setPermissionDenied(false);
  }

  if (!isAuthenticated || (!showPrompt && !permissionDenied)) return null;

  return (
    <aside className="fixed bottom-4 left-4 z-[70] max-w-sm rounded-xl border border-[#D8C9AE] bg-white p-4 shadow-lg">
      <p className="text-sm font-semibold text-[#0A4833]">Enable browser notifications</p>
      <p className="mt-1 text-xs leading-5 text-[#6B7280]">
        {permissionDenied
          ? "Notifications are blocked in your browser settings. Allow them for this site, then enable them from Zewadi settings."
          : "Receive order, consultation, and important Zewadi alerts even when this page is not open. On iPhone, first add Zewadi to your Home Screen."}
      </p>
      <div className="mt-3 flex gap-2">
        {!permissionDenied ? (
          <button type="button" disabled={isEnabling} onClick={handleEnable} className="rounded-md bg-[#0A4833] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
            {isEnabling ? "Enabling..." : "Enable notifications"}
          </button>
        ) : null}
        <button type="button" onClick={handleDismiss} className="rounded-md border border-[#DFDFDF] px-3 py-2 text-xs font-semibold text-[#0A4833]">
          Dismiss
        </button>
      </div>
    </aside>
  );
}
