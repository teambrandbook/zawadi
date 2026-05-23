"use client";

import { useEffect, useState } from "react";
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
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

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

type BookingItem = {
  id: number;
  user_name?: string | null;
  user_image?: string | null;
  user_email?: string | null;
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
  session_type?: "video" | "audio" | "chat" | string;
};

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

function mediaUrl(value?: string | null) {
  return value ? getImageUrl(value) : "";
}

function sessionTypeLabel(value?: string): SessionType {
  if (value === "audio") return "Audio Call";
  if (value === "chat") return "Chat";
  return "Video Call";
}

function statusLabel(value?: string): ConsultationStatus {
  if (value === "pending") return "Scheduled";
  if (value === "confirmed") return "Confirmed";
  if (value === "cancelled") return "Cancelled";
  if (value === "completed") return "Follow-up Due";
  return "Upcoming";
}

function formatBookingDate(dateValue: string, timeValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { sessionDateLabel: `${dateValue}, ${timeValue}`, sessionSubLabel: dateValue };
  }
  return {
    sessionDateLabel: `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${timeValue}`,
    sessionSubLabel: date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric" }),
  };
}

function mapBookingToConsultation(booking: BookingItem): BackendConsultationUser {
  const dateLabels = formatBookingDate(booking.booked_date, booking.booked_slot);
  const status = statusLabel(booking.status);

  return {
    id: String(booking.id),
    consultationId: `#CS-${String(booking.id).padStart(3, "0")}`,
    fullName: booking.user_name || "Client",
    avatarUrl: mediaUrl(booking.user_image),
    sessionType: sessionTypeLabel(booking.session_type),
    ...dateLabels,
    wellnessGoal: booking.primary_goal || booking.primary_wellness_goal || "General Wellness",
    wellnessNote: booking.buckwheat_journey_goal || booking.focuses_area || "Consultation booking",
    status,
    actions: {
      canStart: status === "Confirmed",
      canSchedule: status === "Scheduled",
      canView: true,
      canEdit: false,
    },
    backendDetails: {
      email: booking.user_email || "-",
      phone: "-",
      age: "-",
      gender: "-",
      language: booking.language || "-",
      location: "-",
      primaryGoal: booking.primary_goal || "-",
      focusArea: booking.focuses_area || "-",
      allergies: "-",
      dietRestriction: booking.diet_preferences || "-",
      activityLevel: booking.lifestyle_activity_level || "-",
      preferredTime: booking.booked_slot,
      additionalMessage: booking.message || "-",
    },
  };
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function ClientAvatar({ src, name, size = 44 }: { src: string; name: string; size?: number }) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7F0EC] text-sm font-semibold text-[#0A4833]"
      style={{ width: size, height: size }}
      aria-label={`${name} profile image`}
    >
      {src && !hasImageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setHasImageError(true)} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function SummaryCards({ users }: { users: BackendConsultationUser[] }) {
  const statCards = [
    { label: "Total Consultations", value: String(users.length), icon: Search, iconClassName: "text-[#0A6A4F]" },
    { label: "Upcoming Sessions", value: String(users.filter((item) => item.status === "Confirmed" || item.status === "Scheduled").length), icon: Calendar, iconClassName: "text-[#A88751]" },
    { label: "Completed", value: String(users.filter((item) => item.status === "Follow-up Due").length), icon: CalendarCheck2, iconClassName: "text-[#16A34A]" },
    { label: "Follow-ups Due", value: String(users.filter((item) => item.status === "Follow-up Due").length), icon: UsersRound, iconClassName: "text-[#F97316]" },
    { label: "Rescheduled", value: "0", icon: Calendar, iconClassName: "text-[#3B82F6]" },
    { label: "Cancelled", value: String(users.filter((item) => item.status === "Cancelled").length), icon: XCircle, iconClassName: "text-[#EF4444]" },
  ];

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
  const filterButtonClass =
    "inline-flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827]";

  return (
    <section className="rounded-[14px] border border-[#DFDFDF] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(118px,0.75fr)_minmax(118px,0.75fr)_minmax(150px,0.95fr)_minmax(160px,1fr)_minmax(172px,auto)] lg:items-center">
        <button
          type="button"
          className={filterButtonClass}
        >
          <span className="truncate">All Status</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <button
          type="button"
          className={filterButtonClass}
        >
          <span className="truncate">All Types</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <div className={filterButtonClass}>
          <span className="truncate">mm/dd/yyyy</span>
          <Calendar className="h-4 w-4 text-[#111827]" />
        </div>

        <button
          type="button"
          className={filterButtonClass}
        >
          <span className="truncate">Sort by Newest</span>
          <ChevronDown className="h-4 w-4 text-[#374151]" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-full min-w-[172px] items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[#0A4833] px-5 text-[14px] font-medium text-white hover:bg-[#083B2A] sm:col-span-2 lg:col-span-1 lg:justify-self-end lg:w-[172px]"
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

            {users.length === 0 ? (
              <div className="px-7 py-8 text-sm text-[#6B7280]">No consultation bookings found.</div>
            ) : null}

            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.9fr_0.9fr] border-b border-[#E5E7EB] px-4 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3 px-3">
                  <ClientAvatar src={user.avatarUrl} name={user.fullName} />
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
          <p className="text-sm text-[#4B5563]">Showing {users.length} consultations</p>

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
                  <ClientAvatar src={selectedUser.avatarUrl} name={selectedUser.fullName} size={56} />
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
  const [usersFromBackend, setUsersFromBackend] = useState<BackendConsultationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .get<BookingItem[]>("/consultant/bookings/")
      .then(({ data }) => {
        if (!isMounted) return;
        setUsersFromBackend(Array.isArray(data) ? data.map(mapBookingToConsultation) : []);
      })
      .catch(() => {
        if (isMounted) setUsersFromBackend([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-4">
        <SummaryCards users={usersFromBackend} />
        <ConsultationToolbar />
        {isLoading ? (
          <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280]">
            Loading consultations...
          </section>
        ) : null}
        <ActiveConsultationsTable users={usersFromBackend} />
      </div>
    </main>
  );
}
