"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarCheck2,
  Eye,
  Pencil,
  Play,
  Search,
  UsersRound,
  XCircle,
} from "lucide-react";
import api from "@/services/api";

type ConsultationStatus = "Upcoming" | "Confirmed" | "Follow-up Due" | "Scheduled" | "Cancelled";
type SessionType = "Video Call" | "Audio Call" | "Chat";
type StatusFilter = "all" | ConsultationStatus;
type TypeFilter = "all" | SessionType;
type SortFilter = "newest" | "oldest";

type BackendConsultationUser = {
  id: string;
  consultationId: string;
  fullName: string;
  avatarUrl: string;
  sessionType: SessionType;
  sessionDate: string;
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

function getApiOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return apiBase.replace(/\/api\/?$/, "");
}

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-3.webp";
  if (value.startsWith("http")) return value;
  return `${getApiOrigin()}${value.startsWith("/") ? "" : "/"}${value}`;
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
    sessionDate: booking.booked_date,
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
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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

type ConsultationToolbarProps = {
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  dateFilter: string;
  sortFilter: SortFilter;
  onStatusChange: (value: StatusFilter) => void;
  onTypeChange: (value: TypeFilter) => void;
  onDateChange: (value: string) => void;
  onSortChange: (value: SortFilter) => void;
  onViewSchedule: () => void;
};

function ConsultationToolbar({
  statusFilter,
  typeFilter,
  dateFilter,
  sortFilter,
  onStatusChange,
  onTypeChange,
  onDateChange,
  onSortChange,
  onViewSchedule,
}: ConsultationToolbarProps) {
  const controlClass =
    "h-12 rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-normal text-[#111827] outline-none transition focus:border-[#0A4833] focus:ring-2 focus:ring-[#0A4833]/10";

  return (
    <section className="rounded-[14px] border border-[#DFDFDF] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="hide-scrollbar -mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max items-center gap-3">
        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
          className={`${controlClass} w-[148px]`}
        >
          <option value="all">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Follow-up Due">Follow-up Due</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) => onTypeChange(event.target.value as TypeFilter)}
          className={`${controlClass} w-[148px]`}
        >
          <option value="all">All Types</option>
          <option value="Video Call">Video Call</option>
          <option value="Audio Call">Audio Call</option>
          <option value="Chat">Chat</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(event) => onDateChange(event.target.value)}
          className={`${controlClass} w-[158px]`}
        />

        <select
          value={sortFilter}
          onChange={(event) => onSortChange(event.target.value as SortFilter)}
          className={`${controlClass} w-[186px]`}
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>

        <button
          type="button"
          onClick={onViewSchedule}
          className="inline-flex h-12 w-[184px] items-center justify-center gap-2 rounded-[6px] bg-[#0A4833] px-5 text-[14px] font-semibold text-white transition hover:bg-[#083B2A]"
        >
          <Calendar className="h-4 w-4" />
          <span>View Schedule</span>
        </button>
        </div>
      </div>
    </section>
  );
}

function ActiveConsultationsTable({ users }: { users: BackendConsultationUser[] }) {
  const [selectedUser, setSelectedUser] = useState<BackendConsultationUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / rowsPerPage));
  const visibleUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

            {visibleUsers.map((user) => (
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
          <p className="text-sm text-[#4B5563]">
            Showing {visibleUsers.length} of {users.length} consultations
          </p>

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button type="button" className="rounded bg-[#0A4833] px-3 py-1.5 text-white">
              {currentPage}
            </button>
            <span className="text-[#6B7280]">of {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-[#DFDFDF] bg-white px-3 py-1.5 text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            >
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
  const [usersFromBackend, setUsersFromBackend] = useState<BackendConsultationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter>("newest");

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

  const filteredUsers = useMemo(() => {
    return usersFromBackend
      .filter((user) => statusFilter === "all" || user.status === statusFilter)
      .filter((user) => typeFilter === "all" || user.sessionType === typeFilter)
      .filter((user) => !dateFilter || user.sessionDate === dateFilter)
      .sort((a, b) => {
        const first = new Date(`${a.sessionDate}T00:00:00`).getTime();
        const second = new Date(`${b.sessionDate}T00:00:00`).getTime();
        return sortFilter === "newest" ? second - first : first - second;
      });
  }, [dateFilter, sortFilter, statusFilter, typeFilter, usersFromBackend]);

  function viewTodaySchedule() {
    setDateFilter(new Date().toISOString().slice(0, 10));
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-4">
        <SummaryCards users={usersFromBackend} />
        <ConsultationToolbar
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          dateFilter={dateFilter}
          sortFilter={sortFilter}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
          onDateChange={setDateFilter}
          onSortChange={setSortFilter}
          onViewSchedule={viewTodaySchedule}
        />
        {isLoading ? (
          <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280]">
            Loading consultations...
          </section>
        ) : null}
        <ActiveConsultationsTable users={filteredUsers} />
      </div>
    </main>
  );
}
