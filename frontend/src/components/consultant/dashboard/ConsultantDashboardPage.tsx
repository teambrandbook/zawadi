"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FilePlus2,
  MessageSquareMore,
  NotebookPen,
  Play,
  TriangleAlert,
  Users,
  UserRound,
  UtensilsCrossed,
  Video,
  X,
} from "lucide-react";

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
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
};

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  tone: string;
};

type ReminderItem = {
  id: string;
  title: string;
  subtitle: string;
  box: string;
  icon: ComponentType<{ className?: string }>;
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
  { label: "Today's Appointments", value: 8, icon: CalendarDays, iconColor: "text-[#B48A4A]" },
  { label: "Pending Consultations", value: 12, icon: Clock3, iconColor: "text-[#B48A4A]" },
  { label: "Active Clients", value: 45, icon: Users, iconColor: "text-[#B48A4A]" },
  { label: "Follow-ups Due", value: 6, icon: Bell, iconColor: "text-[#B48A4A]" },
  { label: "Diet Plans Shared", value: 23, icon: UtensilsCrossed, iconColor: "text-[#B48A4A]" },
  { label: "Unread Messages", value: 4, icon: MessageSquareMore, iconColor: "text-[#B48A4A]" },
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

const recentActivities: ActivityItem[] = [
  { id: "activity-1", title: "Consultation notes updated for Emma Thompson", time: "2 hours ago", tone: "bg-[#E9F8EF] text-[#0A7F56]" },
  { id: "activity-2", title: "New diet plan created for Michael Rodriguez", time: "4 hours ago", tone: "bg-[#FFF6D8] text-[#C78C00]" },
  { id: "activity-3", title: "Message received from Lisa Park", time: "6 hours ago", tone: "bg-[#E7F0FF] text-[#3B82F6]" },
];

const reminders: ReminderItem[] = [
  {
    id: "follow-up",
    title: "Follow-up due today",
    subtitle: "3 clients need follow-up calls",
    box: "border-[#F3D0D0] bg-[#FFF2F2]",
    icon: TriangleAlert,
  },
  {
    id: "appointment",
    title: "Appointment in 15 mins",
    subtitle: "Michael Rodriguez consultation",
    box: "border-[#F3E4A4] bg-[#FFFBEA]",
    icon: Clock3,
  },
  {
    id: "messages",
    title: "Unread messages",
    subtitle: "4 client messages pending",
    box: "border-[#CFE0FF] bg-[#EEF4FF]",
    icon: MessageSquareMore,
  },
];

const weekStats: WeekStat[] = [
  { label: "Sessions Completed", value: "32" },
  { label: "Diet Plans Created", value: "8" },
  { label: "Client Satisfaction", value: "4.9/5", valueColor: "text-[#A88751]" },
  { label: "Response Time", value: "<2hrs" },
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

export default function ConsultantDashboardPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="rounded-[14px] border border-[#D1D5DB] bg-white px-4 py-4 shadow-[0_4px_16px_rgba(10,72,51,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[32px] font-semibold leading-none text-[#0A4833]">{card.value}</p>
                    <p className="mt-2 text-xs leading-5 text-[#667085]">{card.label}</p>
                  </div>
                  <Icon className={`h-6 w-6 shrink-0 ${card.iconColor}`} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_320px]">
          <div className="space-y-5">
            <SectionCard title="Today's Schedule">
              <div className="space-y-3 p-4">
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

            <SectionCard title="Recent Activity">
              <div className="space-y-4 p-5">
                {recentActivities.map((activity) => (
                  <article key={activity.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${activity.tone}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-[#163229]">{activity.title}</p>
                      <p className="mt-1 text-xs text-[#98A2B3]">{activity.time}</p>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
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

            <SectionCard title="Reminders">
              <div className="space-y-3 p-4">
                {reminders.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.id} className={`rounded-xl border p-4 ${item.box}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#B48A4A]" />
                        <div>
                          <p className="text-sm font-medium text-[#1D2939]">{item.title}</p>
                          <p className="mt-1 text-xs text-[#667085]">{item.subtitle}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </SectionCard>

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
        </div>
      </div>
    </main>
  );
}
