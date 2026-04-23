"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarCheck2,
  ChevronDown,
  Eye,
  Pencil,
  Play,
  Search,
  UsersRound,
  XCircle,
} from "lucide-react";

type ConsultationStatus = "Upcoming" | "Confirmed" | "Follow-up Due" | "Scheduled" | "Cancelled";
type SessionType = "Video Call" | "Audio Call" | "Chat";

type BackendConsultationUser = {
  id: string;
  consultationId: string;
  fullName: string;
  avatarUrl: string;
  sessionType: SessionType;
  sessionDateLabel: string;
  sessionSubLabel: string;
  wellnessGoal: string;
  wellnessNote: string;
  status: ConsultationStatus;
  actions: {
    canStart: boolean;
    canSchedule: boolean;
    canView: boolean;
    canEdit: boolean;
  };
  backendDetails: {
    email: string;
    phone: string;
    age: string;
    gender: string;
    language: string;
    location: string;
    primaryGoal: string;
    focusArea: string;
    allergies: string;
    dietRestriction: string;
    activityLevel: string;
    preferredTime: string;
    additionalMessage: string;
  };
};

const backendConsultationUsers: BackendConsultationUser[] = [
  {
    id: "john-smith",
    consultationId: "#CS-001",
    fullName: "John Smith",
    avatarUrl: "/recipe/recipe-2.webp",
    sessionType: "Video Call",
    sessionDateLabel: "Today, 2:30 PM",
    sessionSubLabel: "Jan 15, 2024",
    wellnessGoal: "Weight Management",
    wellnessNote: "Buckwheat diet plan",
    status: "Upcoming",
    actions: { canStart: true, canSchedule: false, canView: true, canEdit: true },
    backendDetails: {
      email: "john.smith@example.com",
      phone: "+91 98765 12345",
      age: "34",
      gender: "Male",
      language: "English",
      location: "Chennai",
      primaryGoal: "Weight loss",
      focusArea: "Meal consistency",
      allergies: "None",
      dietRestriction: "Vegetarian",
      activityLevel: "Moderate",
      preferredTime: "Afternoon",
      additionalMessage: "Need a practical diet plan that works with office hours.",
    },
  },
  {
    id: "emma-wilson",
    consultationId: "#CS-002",
    fullName: "Emma Wilson",
    avatarUrl: "/recipe/recipe-3.webp",
    sessionType: "Audio Call",
    sessionDateLabel: "Tomorrow, 10:00 AM",
    sessionSubLabel: "Jan 16, 2024",
    wellnessGoal: "Digestive Health",
    wellnessNote: "Gluten-free alternatives",
    status: "Confirmed",
    actions: { canStart: false, canSchedule: true, canView: true, canEdit: true },
    backendDetails: {
      email: "emma.wilson@example.com",
      phone: "+91 99887 11223",
      age: "29",
      gender: "Female",
      language: "English",
      location: "Bengaluru",
      primaryGoal: "Improve digestion",
      focusArea: "Bloating and food sensitivity",
      allergies: "Dairy",
      dietRestriction: "Gluten-free",
      activityLevel: "Light",
      preferredTime: "Morning",
      additionalMessage: "Looking for lighter meals and better ingredient swaps.",
    },
  },
  {
    id: "michael-brown",
    consultationId: "#CS-003",
    fullName: "Michael Brown",
    avatarUrl: "/recipe/recipe-1.webp",
    sessionType: "Chat",
    sessionDateLabel: "Jan 14, 3:15 PM",
    sessionSubLabel: "Completed",
    wellnessGoal: "Athletic Performance",
    wellnessNote: "Pre-workout nutrition",
    status: "Follow-up Due",
    actions: { canStart: false, canSchedule: false, canView: true, canEdit: true },
    backendDetails: {
      email: "michael.brown@example.com",
      phone: "+91 93456 98765",
      age: "31",
      gender: "Male",
      language: "English",
      location: "Hyderabad",
      primaryGoal: "Build endurance",
      focusArea: "Pre/post workout meals",
      allergies: "Peanuts",
      dietRestriction: "High protein",
      activityLevel: "High",
      preferredTime: "Evening",
      additionalMessage: "Need support around sports nutrition and recovery meals.",
    },
  },
  {
    id: "lisa-davis",
    consultationId: "#CS-004",
    fullName: "Lisa Davis",
    avatarUrl: "/recipe/recipe-4.webp",
    sessionType: "Video Call",
    sessionDateLabel: "Jan 18, 1:00 PM",
    sessionSubLabel: "Friday",
    wellnessGoal: "Diabetes Management",
    wellnessNote: "Blood sugar control",
    status: "Scheduled",
    actions: { canStart: false, canSchedule: true, canView: true, canEdit: true },
    backendDetails: {
      email: "lisa.davis@example.com",
      phone: "+91 90909 45454",
      age: "42",
      gender: "Female",
      language: "English",
      location: "Kochi",
      primaryGoal: "Stable glucose management",
      focusArea: "Meal timing and carbs",
      allergies: "Shellfish",
      dietRestriction: "Low sugar",
      activityLevel: "Moderate",
      preferredTime: "Afternoon",
      additionalMessage: "Would like a realistic plan for family meals too.",
    },
  },
];

const statCards = [
  { label: "Total Consultations", value: "127", icon: Search, iconClassName: "text-[#0A6A4F]" },
  { label: "Upcoming Sessions", value: "8", icon: Calendar, iconClassName: "text-[#A88751]" },
  { label: "Completed", value: "112", icon: CalendarCheck2, iconClassName: "text-[#16A34A]" },
  { label: "Follow-ups Due", value: "5", icon: UsersRound, iconClassName: "text-[#F97316]" },
  { label: "Rescheduled", value: "3", icon: Calendar, iconClassName: "text-[#3B82F6]" },
  { label: "Cancelled", value: "2", icon: XCircle, iconClassName: "text-[#EF4444]" },
];

function getSessionBadgeTone(sessionType: SessionType) {
  if (sessionType === "Video Call") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (sessionType === "Audio Call") return "bg-[#DCFCE7] text-[#15803D]";
  return "bg-[#F3E8FF] text-[#9333EA]";
}

function getStatusBadgeTone(status: ConsultationStatus) {
  if (status === "Upcoming") return "bg-[#F8EEDB] text-[#B07A17]";
  if (status === "Confirmed") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Follow-up Due") return "bg-[#FFEDD5] text-[#EA580C]";
  if (status === "Scheduled") return "bg-[#DBEAFE] text-[#2563EB]";
  return "bg-[#FEE2E2] text-[#DC2626]";
}

function SummaryCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-[14px] border border-[#DFDFDF] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm leading-5 text-[#4B5563]">{card.label}</p>
                <p className="mt-2 text-[34px] font-bold leading-none text-[#0A4833]">{card.value}</p>
              </div>
              <div className="rounded-full p-1.5">
                <Icon className={`h-5 w-5 ${card.iconClassName}`} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ConsultationToolbar() {
  return (
    <section className="rounded-[14px] border border-[#DFDFDF] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center xl:flex-nowrap">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827] lg:w-[118px]"
        >
          <span>All Status</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827] lg:w-[118px]"
        >
          <span>All Types</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <div className="flex h-10 items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827] lg:w-[126px]">
          <span>mm/dd/yyyy</span>
          <Calendar className="h-4 w-4 text-[#111827]" />
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827] lg:w-[148px]"
        >
          <span>Sort by Newest</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#0A4833] px-4 text-[14px] font-medium text-white hover:bg-[#083B2A] lg:w-[148px]"
        >
          <Calendar className="h-[13px] w-[13px]" />
          <span>View Schedule</span>
        </button>
      </div>
    </section>
  );
}

function ActiveConsultationsTable({ users }: { users: BackendConsultationUser[] }) {
  const [selectedUser, setSelectedUser] = useState<BackendConsultationUser | null>(null);

  return (
    <>
      <section className="overflow-hidden rounded-[14px] border border-[#DFDFDF] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="border-b border-[#E5E7EB] px-5 py-5">
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0A4833] sm:text-xl">Active Consultations</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.9fr_0.9fr] border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4 text-xs font-medium text-[#4B5563]">
              <span className="px-3">Client</span>
              <span className="px-3">Session Type</span>
              <span className="px-3">Date & Time</span>
              <span className="px-3">Wellness Goal</span>
              <span className="px-3">Status</span>
              <span className="px-3">Actions</span>
            </div>

            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.9fr_0.9fr] border-b border-[#E5E7EB] px-4 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3 px-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <Image src={user.avatarUrl} alt={user.fullName} width={44} height={44} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#111827]">{user.fullName}</p>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{user.consultationId}</p>
                  </div>
                </div>

                <div className="flex items-center px-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${getSessionBadgeTone(user.sessionType)}`}>
                    {user.sessionType}
                  </span>
                </div>

                <div className="px-3">
                  <p className="text-sm font-medium text-[#111827]">{user.sessionDateLabel}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{user.sessionSubLabel}</p>
                </div>

                <div className="px-3">
                  <p className="text-sm font-medium text-[#111827]">{user.wellnessGoal}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{user.wellnessNote}</p>
                </div>

                <div className="flex items-center px-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeTone(user.status)}`}>
                    {user.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 px-3 text-[#0A4833]">
                  {user.actions.canStart ? (
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                      <Play className="h-4 w-4 fill-current" />
                    </button>
                  ) : null}

                  {user.actions.canSchedule ? (
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                      <Calendar className="h-4 w-4" />
                    </button>
                  ) : null}

                  {user.actions.canView ? (
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  ) : null}

                  {user.actions.canEdit ? (
                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                      <Pencil className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#4B5563]">Showing 4 of 127 consultations</p>

          <div className="flex items-center gap-2 text-sm">
            <button type="button" className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827]">
              Previous
            </button>
            <button type="button" className="rounded bg-[#0A4833] px-3 py-1.5 text-white">
              1
            </button>
            <button type="button" className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827]">
              2
            </button>
            <button type="button" className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827]">
              3
            </button>
            <button type="button" className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827]">
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedUser ? (
        <div
          className="fixed inset-0 z-[90] overflow-y-auto bg-[#101828]/55 px-4 py-5 sm:py-8"
          onClick={() => setSelectedUser(null)}
        >
          <div className="flex min-h-full items-start justify-center sm:items-center">
            <div
              className="my-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#D1D5DB] bg-white shadow-[0_28px_90px_rgba(16,24,40,0.22)] sm:max-h-[90vh]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <Image
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.fullName}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#163229]">{selectedUser.fullName}</h3>
                    <p className="mt-1 text-sm text-[#667085]">{selectedUser.consultationId}</p>
                    <p className="mt-1 text-xs font-medium text-[#0A4833]">{selectedUser.wellnessGoal}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#344054] hover:bg-[#EFECE6]"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#F8F7F4] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Session Type</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D2939]">{selectedUser.sessionType}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F7F4] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Session Date</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D2939]">{selectedUser.sessionDateLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F7F4] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Status</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D2939]">{selectedUser.status}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#D1D5DB] bg-[#FCFBF8] p-5">
                  <h4 className="text-base font-semibold text-[#163229]">Backend User Info</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(selectedUser.backendDetails).map(([key, value]) => (
                      <div key={key} className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="mt-1 break-words text-sm font-medium text-[#1D2939]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D1D5DB] bg-white px-5 text-sm font-medium text-[#344054] hover:bg-[#F8F5EF]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function ConsultantConsultationPage() {
  const usersFromBackend = useMemo(() => backendConsultationUsers, []);

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-4">
        <SummaryCards />
        <ConsultationToolbar />
        <ActiveConsultationsTable users={usersFromBackend} />
      </div>
    </main>
  );
}
