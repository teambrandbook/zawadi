export type NotificationStat = {
  id: string;
  label: string;
  value: string;
  icon: "bell" | "clock" | "send" | "rate";
  valueTone?: "default" | "blue" | "green" | "gold";
};

export type NotificationRow = {
  id: string;
  title: string;
  description: string;
  type: string;
  audience: string;
  channels: string[];
  priority: "High" | "Medium" | "Low";
  status: "Sent" | "Scheduled" | "Draft";
};

