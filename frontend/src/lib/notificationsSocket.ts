import { API_BASE_URL } from "@/lib/config";

export function getNotificationSocketUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_WS_URL;
  const socketUrl = new URL(configuredUrl || API_BASE_URL);

  if (!configuredUrl) {
    socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
    socketUrl.pathname = "/ws/notifications/";
  }

  socketUrl.hash = "";
  return socketUrl.toString();
}
