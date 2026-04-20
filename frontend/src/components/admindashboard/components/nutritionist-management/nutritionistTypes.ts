export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type NutritionistStatCard = {
  id: string;
  label: string;
  value: string;
  subText: string;
  accentText?: string;
  icon: "users" | "check" | "calendar" | "star" | "clock" | "pause" | "list" | "done";
  iconTone: "green" | "gold" | "teal" | "gray";
};

export type NutritionistRow = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  availability: string;
  qualification: string;
  email: string;
  phone: string;
  expertiseTags: string[];
  sessions: number;
  rating: number;
  supportChannels: Array<"video" | "audio" | "chat">;
};

export type NutritionistPageData = {
  stats: NutritionistStatCard[];
  rows: NutritionistRow[];
};
