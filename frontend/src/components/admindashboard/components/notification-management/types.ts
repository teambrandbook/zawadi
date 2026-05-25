export type NotificationStat = {
  id: string;
  label: string;
  value: string;
  icon: "bell" | "clock" | "send" | "users";
  valueTone?: "default" | "blue" | "green" | "gold";
};

export type NotificationStatus = "Sent" | "Scheduled";
export type NotificationChannel = "In-App" | "Email";

export type NotificationRow = {
  id: string;
  title: string;
  description: string;
  type: string;
  typeValue: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTIONAL";
  audience: string;
  channels: NotificationChannel[];
  status: NotificationStatus;
  createdAt: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
};

export type NotificationFiltersState = {
  status: "all" | NotificationStatus;
  type: "all" | NotificationRow["typeValue"];
  audience: "all" | string;
  channel: "all" | NotificationChannel;
  sort: "newest" | "oldest";
};

