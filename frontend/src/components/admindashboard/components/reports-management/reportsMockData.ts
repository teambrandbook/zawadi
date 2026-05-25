import type { AnalyticsCard, FilterOption, KpiCard, Point, ReportRow } from "./types";

export const filterOptions: FilterOption[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "last_3_months", label: "Last 3 Months" },
  { id: "custom", label: "Custom Range" },
  { id: "all", label: "All" },
];

export const kpiCards: KpiCard[] = [
  { id: "revenue", label: "Total Revenue", value: "$24,580", change: "+12.5%", icon: "revenue" },
  { id: "orders", label: "Total Orders", value: "1,245", change: "+8.2%", icon: "orders" },
  { id: "users", label: "Active Users", value: "3,892", change: "+15.3%", icon: "users" },
  { id: "bookings", label: "Consultation Bookings", value: "189", change: "+22.1%", icon: "bookings" },
];

export const revenueTrendData: Point[] = [
  { label: "Jan", value: 20 },
  { label: "Feb", value: 24 },
  { label: "Mar", value: 21 },
  { label: "Apr", value: 26 },
  { label: "May", value: 23 },
  { label: "Jun", value: 28 },
];

export const userGrowthData: Point[] = [
  { label: "Week 1", value: 240 },
  { label: "Week 2", value: 310 },
  { label: "Week 3", value: 200 },
  { label: "Week 4", value: 380 },
];

export const analyticsCards: AnalyticsCard[] = [
  {
    id: "consultation",
    title: "Consultation Analytics",
    rows: [
      { label: "Total Consultations", value: "189" },
      { label: "Completed", value: "156", tone: "green" },
      { label: "Canceled", value: "12", tone: "orange" },
      { label: "Completion Rate", value: "82.5%" },
    ],
  },
  {
    id: "events",
    title: "Events Analytics",
    rows: [
      { label: "Total Events", value: "24" },
      { label: "Registrations", value: "1,456", tone: "blue" },
      { label: "Attendance Rate", value: "78.2%", tone: "green" },
      { label: "Avg. per Event", value: "60.7" },
    ],
  },
  {
    id: "content",
    title: "Content Analytics",
    rows: [
      { label: "Recipes", value: "342" },
      { label: "Blogs", value: "128" },
      { label: "Approval Rate", value: "94.2%", tone: "green" },
    ],
    progress: { label: "Recipes", value: 76, tone: "green" },
  },
];

export const reportRows: ReportRow[] = [
  {
    id: "r-1",
    reportType: "Revenue Report",
    dateRange: "Jan 1 - Jan 31, 2024",
    records: "1,245",
    status: "Ready",
    updatedAt: "2 hours ago",
  },
  {
    id: "r-2",
    reportType: "User Analytics",
    dateRange: "Dec 1 - Dec 31, 2023",
    records: "3,892",
    status: "Processing",
    updatedAt: "1 day ago",
  },
  {
    id: "r-3",
    reportType: "Content Performance",
    dateRange: "Nov 1 - Nov 30, 2023",
    records: "470",
    status: "Ready",
    updatedAt: "3 days ago",
  },
];
