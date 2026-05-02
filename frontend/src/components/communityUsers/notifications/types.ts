// API response shape from GET /api/notifications/inbox/
export type ApiNotificationReceipt = {
  receipt_id: number;
  id: number;
  title: string;
  body: string;
  notification_type: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTIONAL";
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationSummaryStat = {
  label: string;
  value: string;
  icon:
    | "bell"
    | "unread"
    | "orders"
    | "consultation"
    | "events"
    | "community";
  accent?: "green" | "gold";
};

export type NotificationTab = {
  label: string;
  active?: boolean;
};

export type NotificationAction = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  icon:
    | "orders"
    | "events"
    | "consultation"
    | "recipes"
    | "diet"
    | "confirmed"
    | "announcement"
    | "blog";
  tone?: "gold" | "neutral";
  actions?: NotificationAction[];
};

export type PriorityAlert = {
  title: string;
  description: string;
  icon: "orders" | "events" | "consultation";
};

export type QuickAction = {
  label: string;
  variant?: "primary" | "outline" | "subtle";
  href?: string;
};

export type NotificationPreferenceCard = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
};

export type ActivitySummaryCard = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
};

export type NotificationsPageData = {
  title: string;
  subtitle: string;
  stats: NotificationSummaryStat[];
  tabs: NotificationTab[];
  notifications: NotificationItem[];
  priorityAlerts: PriorityAlert[];
  quickActions: QuickAction[];
  preferences: NotificationPreferenceCard;
  activitySummary: ActivitySummaryCard;
};
