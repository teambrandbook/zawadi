export type FilterOption = {
  id: string;
  label: string;
};

export type ReportPeriod = "today" | "week" | "month" | "last_3_months" | "custom";

export type ReportModule = "all" | "orders" | "users" | "consultations" | "events" | "content";

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: "revenue" | "orders" | "users" | "bookings";
};

export type Point = {
  label: string;
  value: number;
};

export type AnalyticsCard = {
  id: string;
  title: string;
  rows: { label: string; value: string; tone?: "default" | "green" | "orange" | "blue" }[];
  progress?: { label: string; value: number; tone?: "green" | "gold" };
};

export type ReportRow = {
  id: string;
  reportType: string;
  dateRange: string;
  records: string;
  total?: number;
  status: "Ready" | "Processing";
  updatedAt: string;
};
