import { getApp, getApps, initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, isSupported, onMessage, type MessagePayload } from "firebase/messaging";
import api from "@/services/api";

const TOKEN_STORAGE_KEY = "zewadi_fcm_token";
const REGISTRATION_EVENT = "zewadi-push-registration-changed";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every(Boolean) && Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
}

function emitRegistrationChanged(registered: boolean) {
  window.dispatchEvent(new CustomEvent(REGISTRATION_EVENT, { detail: registered }));
}

async function getMessagingClient() {
  if (typeof window === "undefined" || !hasFirebaseConfig() || !(await isSupported())) {
    return null;
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getMessaging(app);
}

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  const params = new URLSearchParams();
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`, { scope: "/" });
  return navigator.serviceWorker.ready;
}

async function readBrowserToken() {
  const messaging = await getMessagingClient();
  const registration = await getServiceWorkerRegistration();
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!messaging || !registration || !vapidKey) return null;
  return getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
}

export function getStoredPushToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function isPushEnabledInThisBrowser() {
  return typeof Notification !== "undefined"
    && Notification.permission === "granted"
    && Boolean(getStoredPushToken());
}

export async function canUsePushNotifications() {
  return typeof window !== "undefined"
    && typeof Notification !== "undefined"
    && hasFirebaseConfig()
    && await isSupported();
}

export async function enablePushNotifications() {
  if (!(await canUsePushNotifications())) {
    throw new Error("Push notifications are not supported in this browser.");
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Browser notification permission was not granted.");
  }
  const token = await readBrowserToken();
  if (!token) {
    throw new Error("Firebase did not return a browser push token.");
  }
  await api.post("/notifications/push-devices/register/", { token });
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  emitRegistrationChanged(true);
  return token;
}

export async function refreshPushRegistration() {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return null;
  const token = await readBrowserToken();
  if (!token) return null;
  await api.post("/notifications/push-devices/register/", { token });
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  emitRegistrationChanged(true);
  return token;
}

export async function disablePushNotifications() {
  const messaging = await getMessagingClient();
  const token = getStoredPushToken() || await readBrowserToken();
  if (token) {
    await api.delete("/notifications/push-devices/unregister/", { data: { token } });
  }
  if (messaging) {
    await deleteToken(messaging).catch(() => false);
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  emitRegistrationChanged(false);
}

export async function unregisterPushBeforeLogout() {
  try {
    await disablePushNotifications();
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export async function subscribeForegroundPush(handler: (payload: MessagePayload) => void) {
  const messaging = await getMessagingClient();
  if (!messaging) return () => {};
  return onMessage(messaging, handler);
}

export function subscribePushRegistration(handler: (registered: boolean) => void) {
  const listener = (event: Event) => {
    handler(Boolean((event as CustomEvent<boolean>).detail));
  };
  window.addEventListener(REGISTRATION_EVENT, listener);
  return () => window.removeEventListener(REGISTRATION_EVENT, listener);
}
