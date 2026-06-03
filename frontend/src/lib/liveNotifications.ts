export type LiveNotification = {
  type: "notification";
  id: number;
  notification_id: number;
  title: string;
  body: string;
  message: string;
  notification_type?: string;
  target_role?: string;
  created_at: string;
  action_url?: string;
};

const EVENT_NAME = "zewadi-live-notification";
const seenNotificationIds = new Set<number>();

export function emitLiveNotification(notification: LiveNotification): boolean {
  const notificationId = Number(notification.notification_id || notification.id);
  if (!notificationId || seenNotificationIds.has(notificationId)) {
    return false;
  }

  seenNotificationIds.add(notificationId);
  window.dispatchEvent(new CustomEvent<LiveNotification>(EVENT_NAME, { detail: notification }));
  return true;
}

export function subscribeLiveNotifications(handler: (notification: LiveNotification) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<LiveNotification>).detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
