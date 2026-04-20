export type EventStat = {
  id: string;
  label: string;
  value: string;
  subText: string;
  badge?: string;
  icon: "calendar" | "clock" | "play" | "users" | "check" | "draft" | "cancel" | "chart";
};

export type EventRow = {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  category: string;
  hostName: string;
  hostRole: string;
  hostAvatar: string;
  dateText: string;
  timeText: string;
  type: "Online" | "Offline";
  registrations: string;
  status: "Published" | "Draft" | "Cancelled";
  attendeeAvatars: string[];
};

