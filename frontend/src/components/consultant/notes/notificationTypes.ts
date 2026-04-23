import type { LucideIcon } from "lucide-react";

export type NotificationStatTone = "sand" | "rose" | "green" | "blue" | "amber";

export type NotificationCategory = "all" | "unread" | "consultations" | "messages" | "events" | "admin-alerts";

export type NotificationKind = "alert" | "message" | "consultation" | "reminder" | "event" | "admin";

export type NotificationActionTone = "primary" | "secondary" | "muted";

export type NotificationAction = {
  id: string;
  label: string;
  tone: NotificationActionTone;
};

export type NotificationStatItem = {
  id: string;
  label: string;
  value: number;
  tone: NotificationStatTone;
  icon: LucideIcon;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: Exclude<NotificationCategory, "all" | "unread">;
  label: string;
  labelColor: string;
  kind: NotificationKind;
  unread: boolean;
  muted?: boolean;
  badgeText?: string;
  badgeColor?: string;
  actions: NotificationAction[];
};

