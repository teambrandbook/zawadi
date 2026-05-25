"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  Clock3,
  Eye,
  FilePlus2,
  NotebookPen,
  Play,
  Users,
  UserRound,
  UtensilsCrossed,
  Video,
  X,
} from "lucide-react";
import api from "@/services/api";

type ConsultationRequestData = {
  choose_section: string;
  primary_goal: string;
  language: string;
  date: string;
  time: string;
  primary_wellness_goal: string;
  focus_area: string;
  allergies: string;
  diet_restriction: string;
  lifestyle_activity: string;
  journey_goal: string;
  additional_message: string;
};

type ConsultationScheduleItem = {
  id: string;
  client: string;
  concern: string;
  time: string;
  status: "In Progress" | "Upcoming";
  mode: "Video" | "In Person" | "Phone";
  date: string;
  location: string;
  notes: string;
  avatar: string;
  consultantName: string;
  backendData: ConsultationRequestData;
};

type SummaryCard = {
  label: string;
  value: number | string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
};

type WeekStat = {
  label: string;
  value: string;
  valueColor?: string;
};

type ActionItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  className: string;
};

type ApiBooking = {
  id: number;
  user_name?: string | null;
  primary_goal?: string;
  primary_wellness_goal?: string;
  focuses_area?: string;
  diet_preferences?: string;
  lifestyle_activity_level?: string;
  buckwheat_journey_goal?: string;
  message?: string;
  language?: string;
  booked_date: string;
  booked_slot: string;
  status: string;
  session_type?: string;
  created_at?: string;
  updated_at?: string;
};

type ApiClient = { id: number };
type ApiDietPlan = { id: number; created_at?: string };

const fieldLabels: Record<keyof ConsultationRequestData, string> = {
  choose_section: "Choose Section",
  primary_goal: "Primary Goal",
  language: "Language",
  date: "Date",
  time: "Time",
  primary_wellness_goal: "Primary Wellness Goal",
  focus_area: "Focus Area",
  allergies: "Allergies",
  diet_restriction: "Diet Restriction",
  lifestyle_activity: "Lifestyle Activity",
  journey_goal: "Journey Goal",
  additional_message: "Additional Message",
};

const backendConsultationData: ConsultationRequestData = {
  choose_section: "weight_loss",
  primary_goal: "lose fat",
  language: "english",
  date: "2026-04-20",
  time: "10:30:00",
  primary_wellness_goal: "fitness",
  focus_area: "belly",
  allergies: "peanuts",
  diet_restriction: "vegetarian",
  lifestyle_activity: "moderate",
  journey_goal: "lose 5kg",
  additional_message: "Need help",
};

const summaryCards: SummaryCard[] = [
  { label: "Today's Appointments", value: 8, href: "/consultant/appointments", icon: CalendarDays, iconColor: "text-[#B48A4A]" },
  { label: "Pending Consultations", value: 12, href: "/consultant/consultation", icon: Clock3, iconColor: "text-[#B48A4A]" },
  { label: "Active Clients", value: 45, href: "/consultant/clients", icon: Users, iconColor: "text-[#B48A4A]" },
  { label: "Follow-ups Due", value: 6, href: "/consultant/notes", icon: Bell, iconColor: "text-[#B48A4A]" },
  { label: "Diet Plans Shared", value: 23, href: "/consultant/diet-plans", icon: UtensilsCrossed, iconColor: "text-[#B48A4A]" },
];

const scheduleItems: ConsultationScheduleItem[] = [
  {
    id: "emma-thompson",
    client: "Emma Thompson",
    concern: "Weight Management",
    time: "9:00 AM",
    status: "In Progress",
    mode: "Video",
    date: "April 21, 2026",
    location: "Video room A",
    notes: "Reviewing weekly progress, nutrition adherence, and a gentle calorie adjustment for the next plan cycle.",
    avatar: "ET",
    consultantName: "Dr. Chen",
    backendData: backendConsultationData,
  },
  {
    id: "michael-rodriguez",
    client: "Michael Rodriguez",
    concern: "Diabetes Management",
    time: "10:30 AM",
    status: "Upcoming",
    mode: "Video",
    date: "April 21, 2026",
    location: "Video room B",
    notes: "Discuss glucose tracking updates, carb balance, and hydration recommendations before finalizing the revised diet chart.",
    avatar: "MR",
    consultantName: "Dr. Chen",
    backendData: backendConsultationData,
  },
  {
    id: "lisa-park",
    client: "Lisa Park",
    concern: "Buckwheat Diet Plan",
    time: "2:00 PM",
    status: "Upcoming",
    mode: "Phone",
    date: "April 21, 2026",
    location: "Phone consultation",
    notes: "Share a buckwheat-focused meal rhythm and evaluate food preferences before preparing a detailed weekly diet plan.",
    avatar: "LP",
    consultantName: "Dr. Chen",
    backendData: backendConsultationData,
  },
];

const quickActions: ActionItem[] = [
  {
    label: "Start Consultation",
    href: "/consultant/consultation",
    icon: Play,
    className: "bg-[#0A4833] text-white hover:bg-[#083727]",
  },
  {
    label: "Create Diet Plan",
    href: "/consultant/diet-plans",
    icon: UtensilsCrossed,
    className: "bg-[#B48A4A] text-white hover:bg-[#9D753B]",
  },
  {
    label: "View Schedule",
    href: "/consultant/appointments",
    icon: CalendarDays,
    className: "bg-[#F5F5F5] text-[#344054] hover:bg-[#EBEBEB]",
  },
  {
    label: "Add Notes",
    href: "/consultant/notes",
    icon: NotebookPen,
    className: "bg-[#F5F5F5] text-[#344054] hover:bg-[#EBEBEB]",
  },
];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F7F4] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#1D2939]">{value}</p>
    </div>
  );
}

function ConsultationDetailsButton({ item }: { item: ConsultationScheduleItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0A4833] ring-1 ring-[#D1D5DB] transition hover:bg-[#F8F5EF]"
        aria-label={`View more info for ${item.client}`}
      >
        <Eye className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#101828]/50 px-4 py-8"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#D1D5DB] bg-white shadow-[0_28px_90px_rgba(16,24,40,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0A4833,#B48A4A)] text-base font-semibold text-white">
                  {item.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#163229]">{item.client}</h3>
                  <p className="mt-1 text-sm text-[#667085]">{item.concern}</p>
                  <p className="mt-1 text-xs font-medium text-[#0A4833]">{`Consultant: ${item.consultantName}`}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#344054] transition hover:bg-[#EFECE6]"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-2xl border border-[#D1D5DB] bg-[#FCFBF8] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4EF] text-[#0A4833]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Consultation Status</p>
                    <p className="mt-1 text-sm font-medium text-[#1D2939]">{item.status}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DetailRow label="Display Date" value={item.date} />
                  <DetailRow label="Display Time" value={item.time} />
                  <DetailRow label="Session Mode" value={item.mode} />
                  <DetailRow label="Location" value={item.location} />
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Consultation Notes</p>
                  <p className="mt-2 text-sm leading-6 text-[#475467]">{item.notes}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D1D5DB] bg-white p-5">
                <p className="text-sm font-semibold text-[#163229]">Backend Consultation Data</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(item.backendData).map(([key, value]) => (
                    <DetailRow
                      key={key}
                      label={fieldLabels[key as keyof ConsultationRequestData]}
                      value={String(value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E5E7EB] px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D1D5DB] bg-white px-5 text-sm font-medium text-[#344054] transition hover:bg-[#F8F5EF]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#D1D5DB] bg-white shadow-[0_8px_24px_rgba(10,72,51,0.04)]">
      <div className="border-b border-[#E5E7EB] px-5 py-4">
        <h2 className="text-lg font-semibold text-[#0A4833]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "C";
}

function formatStatus(value: string): "In Progress" | "Upcoming" {
  return value === "confirmed" ? "In Progress" : "Upcoming";
}

function formatMode(value?: string): "Video" | "In Person" | "Phone" {
  if (value === "audio") return "Phone";
  return "Video";
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isDateInCurrentWeek(value?: string) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  const start = new Date(today);
  const day = start.getDay();
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return date >= start && date < end;
}

function formatDuration(totalMs: number) {
  if (totalMs <= 0) return "0hrs";

  const totalMinutes = Math.round(totalMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}hrs`;
  return `${hours}hrs ${minutes}min`;
}

function mapBookingToSchedule(item: ApiBooking): ConsultationScheduleItem {
  const client = item.user_name || "Client";
  return {
    id: String(item.id),
    client,
    concern: item.primary_goal || item.primary_wellness_goal || "General Consultation",
    time: item.booked_slot,
    status: formatStatus(item.status),
    mode: formatMode(item.session_type),
    date: formatDate(item.booked_date),
    location: item.session_type === "audio" ? "Phone consultation" : "Video room",
    notes: item.message || "Review client consultation details and prepare guidance.",
    avatar: initials(client),
    consultantName: "You",
    backendData: {
      choose_section: item.primary_goal || "-",
      primary_goal: item.primary_goal || "-",
      language: item.language || "-",
      date: item.booked_date,
      time: item.booked_slot,
      primary_wellness_goal: item.primary_wellness_goal || "-",
      focus_area: item.focuses_area || "-",
      allergies: "-",
      diet_restriction: item.diet_preferences || "-",
      lifestyle_activity: item.lifestyle_activity_level || "-",
      journey_goal: item.buckwheat_journey_goal || "-",
      additional_message: item.message || "-",
    },
  };
}

export default function ConsultantDashboardPage() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [dietPlanCount, setDietPlanCount] = useState(0);
  const [dietPlans, setDietPlans] = useState<ApiDietPlan[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get<ApiBooking[]>("/consultant/bookings/"),
      api.get<ApiClient[]>("/consultant/clients/"),
      api.get<ApiDietPlan[]>("/consultant/diet-plans/"),
    ]).then(([bookingsResponse, clientsResponse, dietPlansResponse]) => {
      if (!isMounted) return;
      setBookings(bookingsResponse.status === "fulfilled" && Array.isArray(bookingsResponse.value.data) ? bookingsResponse.value.data : []);
      setClientCount(clientsResponse.status === "fulfilled" && Array.isArray(clientsResponse.value.data) ? clientsResponse.value.data.length : 0);
      const nextDietPlans = dietPlansResponse.status === "fulfilled" && Array.isArray(dietPlansResponse.value.data) ? dietPlansResponse.value.data : [];
      setDietPlanCount(nextDietPlans.length);
      setDietPlans(nextDietPlans);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const scheduleItems = useMemo(() => bookings.slice(0, 4).map(mapBookingToSchedule), [bookings]);
  const pendingCount = bookings.filter((item) => item.status === "pending").length;
  const confirmedCount = bookings.filter((item) => item.status === "confirmed").length;
  const completedThisWeek = bookings.filter((item) => item.status === "completed" && isDateInCurrentWeek(item.updated_at));
  const responseTimeMs = completedThisWeek.reduce((total, item) => {
    const start = item.created_at ? new Date(item.created_at).getTime() : Number.NaN;
    const end = item.updated_at ? new Date(item.updated_at).getTime() : Number.NaN;
    return Number.isFinite(start) && Number.isFinite(end) && end > start ? total + (end - start) : total;
  }, 0);
  const weekStats: WeekStat[] = [
    { label: "Sessions Completed", value: String(completedThisWeek.length) },
    { label: "Diet Plans Created", value: String(dietPlans.filter((item) => isDateInCurrentWeek(item.created_at)).length) },
    { label: "Response Time", value: formatDuration(responseTimeMs) },
  ];
  const summaryCards: SummaryCard[] = [
    { label: "Today's Appointments", value: confirmedCount + pendingCount, href: "/consultant/appointments", icon: CalendarDays, iconColor: "text-[#B48A4A]" },
    { label: "Pending Consultations", value: pendingCount, href: "/consultant/consultation", icon: Clock3, iconColor: "text-[#B48A4A]" },
    { label: "Active Clients", value: clientCount, href: "/consultant/clients", icon: Users, iconColor: "text-[#B48A4A]" },
    { label: "Follow-ups Due", value: 0, href: "/consultant/notes", icon: Bell, iconColor: "text-[#B48A4A]" },
    { label: "Diet Plans Shared", value: dietPlanCount, href: "/consultant/diet-plans", icon: UtensilsCrossed, iconColor: "text-[#B48A4A]" },
  ];

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-[14px] border border-[#D1D5DB] bg-white px-4 py-4 shadow-[0_4px_16px_rgba(10,72,51,0.03)] transition hover:border-[#B48A4A] hover:shadow-[0_8px_22px_rgba(10,72,51,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B48A4A]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[32px] font-semibold leading-none text-[#0A4833]">{card.value}</p>
                    <p className="mt-2 text-xs leading-5 text-[#667085]">{card.label}</p>
                  </div>
                  <Icon className={`h-6 w-6 shrink-0 ${card.iconColor}`} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.55fr)_320px] xl:gap-y-2">
          <div className="order-1 xl:order-3 xl:col-start-1">
            <SectionCard title="This Week">
              <div className="space-y-4 p-5">
                {weekStats.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#667085]">{item.label}</span>
                    <span className={`font-semibold text-[#0A4833] ${item.valueColor ?? ""}`}>{item.value}</span>
                  </div>
                ))}

                <Link
                  href="/consultant/consultation"
                  className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#D1D5DB] bg-[#FBF8F3] text-sm font-medium text-[#0A4833] transition hover:bg-[#F3EEE4]"
                >
                  <FilePlus2 className="h-4 w-4" />
                  <span>Open Consultation</span>
                </Link>
              </div>
            </SectionCard>
          </div>

          <div className="order-2 xl:col-start-2 xl:row-span-2 xl:row-start-1">
            <SectionCard title="Quick Actions">
              <div className="space-y-3 p-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${action.className}`}
                    >
                      <Icon className="h-5 w-5 text-[#B48A4A]" />
                      <span>{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="order-3 sm:col-span-2 xl:order-1 xl:col-span-1 xl:col-start-1 xl:row-start-1">
            <SectionCard title="Today's Schedule">
              <div className="space-y-3 p-4">
                {scheduleItems.length === 0 ? (
                  <p className="px-1 py-3 text-sm text-[#667085]">No upcoming consultations yet.</p>
                ) : null}

                {scheduleItems.map((item) => (
                  <article
                    key={item.id}
                    className={`flex flex-col gap-3 rounded-[14px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                      item.status === "In Progress"
                        ? "border-[#D1D5DB] bg-[linear-gradient(90deg,#EDF8F2_0%,#F7FCF9_100%)]"
                        : "border-[#D1D5DB] bg-[#FAFAF8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0A4833,#B48A4A)] text-xs font-semibold text-white">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#163229]">{item.client}</p>
                        <p className="text-xs text-[#667085]">{`${item.concern} • ${item.time}`}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "In Progress" ? "bg-[#E8F7EF] text-[#0A7F56]" : "bg-[#F4F4F5] text-[#475467]"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.status === "In Progress" ? (
                        <div className="inline-flex items-center justify-center text-[#B48A4A]">
                          <Video className="h-5 w-5" />
                        </div>
                      ) : (
                        <ConsultationDetailsButton item={item} />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
