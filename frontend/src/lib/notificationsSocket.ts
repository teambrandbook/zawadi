import { API_BASE_URL } from "@/lib/config";
import { getAccessToken } from "@/services/api";

export function getNotificationSocketUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_WS_URL;
  const socketUrl = new URL(configuredUrl || API_BASE_URL);

  if (!configuredUrl) {
    socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
    socketUrl.pathname = "/ws/notifications/";
  }

  const token = getAccessToken();
  if (token) {
    socketUrl.searchParams.set("token", token);
  }

  socketUrl.hash = "";
  return socketUrl.toString();
}
