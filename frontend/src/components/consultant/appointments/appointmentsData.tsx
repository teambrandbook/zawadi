import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  RefreshCw,
  Rows3,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppointmentStat = {
  title: string;
  value: string;
  icon: LucideIcon;
  tone: string;
};

export type ScheduleItem = {
  id: string;
  time: string;
  duration: string;
  name: string;
  type: string;
  meta: string[];
  status: string;
  action: string;
  avatar: string;
  date: string;
  focus: string;
  consultationMode: string;
  notes: string;
  consultant: string;
  meetingLink?: string;
  sessionStatus?: "pending" | "confirmed" | "completed" | "cancelled";
  rawDate?: string;
  isEmpty?: boolean;
};

export type AvailabilityItem = {
  day: string;
  time: string;
};

export type ActivityItem = {
  title: string;
  time: string;
  dot: string;
};

export const appointmentStats: AppointmentStat[] = [
  { title: "Today's Appointments", value: "8", icon: CalendarDays, tone: "text-[#0A4833]" },
  { title: "Upcoming This Week", value: "24", icon: CalendarRange, tone: "text-[#B67B1B]" },
  { title: "Completed Sessions", value: "156", icon: CheckCircle2, tone: "text-[#16A34A]" },
  { title: "Pending Confirmations", value: "3", icon: TriangleAlert, tone: "text-[#EA580C]" },
  { title: "Rescheduled Sessions", value: "2", icon: RefreshCw, tone: "text-[#2563EB]" },
  { title: "Available Slots", value: "12", icon: Rows3, tone: "text-[#475467]" },
];

export const todaySchedule: ScheduleItem[] = [
  {
    id: "appointment-michael-thompson",
    time: "09:00",
    duration: "30 min",
    name: "Michael Thompson",
    type: "Weight Management Consultation",
    meta: ["Lose 15 lbs", "buckwheat diet"],
    status: "Confirmed",
    action: "Join",
    avatar: "/recipe/recipe-3.webp",
    date: "Friday, March 15, 2024",
    focus: "Weight loss and buckwheat meal adherence",
    consultationMode: "Video Session",
    notes: "Review progress from the previous 2 weeks, validate meal consistency, and adjust the next phase of the plan.",
    consultant: "Dr. Chen",
  },
  {
    id: "appointment-open-slot",
    time: "10:30",
    duration: "60 min",
    name: "Available slot",
    type: "Open consultation slot",
    meta: [],
    status: "Available",
    action: "Book Slot",
    avatar: "",
    date: "Friday, March 15, 2024",
    focus: "Unassigned time block",
    consultationMode: "Open Slot",
    notes: "This slot is currently open and can be booked for a new or follow-up client consultation.",
    consultant: "Dr. Chen",
    isEmpty: true,
  },
  {
    id: "appointment-emma-rodriguez",
    time: "14:00",
    duration: "45 min",
    name: "Emma Rodriguez",
    type: "Nutrition Planning Session",
    meta: ["Heart Health", "Plant-based"],
    status: "Pending",
    action: "Approve",
    avatar: "/recipe/recipe-2.webp",
    date: "Friday, March 15, 2024",
    focus: "Heart-healthy plant-based meal planning",
    consultationMode: "Video Session",
    notes: "Finalize nutrient targets, discuss supplement guidance, and confirm weekly meal structure before approval.",
    consultant: "Dr. Chen",
  },
  {
    id: "appointment-david-kim",
    time: "16:30",
    duration: "60 min",
    name: "David Kim",
    type: "Follow-up Consultation",
    meta: ["Muscle gain", "High protein"],
    status: "Confirmed",
    action: "Join",
    avatar: "/recipe/recipe-4.webp",
    date: "Friday, March 15, 2024",
    focus: "Protein timing and muscle gain support",
    consultationMode: "In-person Session",
    notes: "Evaluate recovery meals, training-day fueling, and adherence to the high-protein buckwheat meal structure.",
    consultant: "Dr. Chen",
  },
];

export const quickAvailability: AvailabilityItem[] = [
  { day: "Monday", time: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", time: "8:00 AM - 5:00 PM" },
  { day: "Thursday", time: "9:00 AM - 5:00 PM" },
  { day: "Friday", time: "9:00 AM - 3:00 PM" },
];

export const recentActivities: ActivityItem[] = [
  { title: "Emma Rodriguez rescheduled appointment", time: "2 hours ago", dot: "bg-[#F59E0B]" },
  { title: "New appointment booked by James Wilson", time: "4 hours ago", dot: "bg-[#22C55E]" },
  { title: "Completed session with Sarah Miller", time: "Yesterday", dot: "bg-[#16A34A]" },
];
