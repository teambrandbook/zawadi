"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  RefreshCw,
  Rows3,
  TriangleAlert,
} from "lucide-react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import AppointmentsHeader from "./AppointmentsHeader";
import AppointmentsStatsGrid from "./AppointmentsStatsGrid";
import NextAppointmentCard from "./NextAppointmentCard";
import type { AppointmentStat, ScheduleItem } from "./appointmentsData";
import QuickAvailabilityCard from "./QuickAvailabilityCard";
import TodaysScheduleCard from "./TodaysScheduleCard";
import api from "@/services/api";

type BookingItem = {
  id: number;
  user_name?: string;
  user_image?: string | null;
  primary_goal?: string;
  booked_date: string;
  booked_slot: string;
  status: string;
  session_type?: string;
  meeting_link?: string;
};

type ScheduleFilter = "daily" | "weekly" | "monthly";
type AvailabilityItem = {
  day: string;
  start_time: string;
  end_time: string;
};

function getApiOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return apiBase.replace(/\/api\/?$/, "");
}

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-3.webp";
  if (value.startsWith("http")) return value;
  return `${getApiOrigin()}${value.startsWith("/") ? "" : "/"}${value}`;
}

function formatTimeLabel(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (match) return `${match[1]}:${match[2]} ${match[3].toUpperCase()}`;
  return value;
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeStatus(status: string) {
  return String(status || "").trim().toLowerCase();
}

function isSameDay(dateValue: string, compareDate: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  return (
    date.getFullYear() === compareDate.getFullYear() &&
    date.getMonth() === compareDate.getMonth() &&
    date.getDate() === compareDate.getDate()
  );
}

function isInCurrentWeek(dateValue: string, compareDate: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  const start = new Date(compareDate);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return date >= start && date < end;
}

function isInCurrentMonth(dateValue: string, compareDate: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.getFullYear() === compareDate.getFullYear() && date.getMonth() === compareDate.getMonth();
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function mapBookingToScheduleItem(item: BookingItem): ScheduleItem {
  const status = normalizeStatus(item.status);
  const displayStatus =
    status === "confirmed"
      ? "Confirmed"
      : status === "pending"
        ? "Pending"
        : status === "completed"
          ? "Completed"
          : status === "cancelled"
            ? "Cancelled"
            : "Scheduled";

  return {
    id: String(item.id),
    time: formatTimeLabel(item.booked_slot),
    duration: "30 min",
    name: item.user_name || "Client",
    type: item.primary_goal || "Consultation Session",
    meta: item.primary_goal ? [item.primary_goal] : [],
    status: displayStatus,
    action: status === "pending" ? "Approve" : "Join",
    avatar: mediaUrl(item.user_image),
    date: formatDateLabel(item.booked_date),
    focus: item.primary_goal || "General consultation support",
    consultationMode: item.session_type || "Consultation Session",
    notes: "Client booking details loaded from the appointments API.",
    consultant: "You",
    meetingLink: item.meeting_link || "",
    rawDate: item.booked_date,
    sessionStatus:
      status === "confirmed" || status === "pending" || status === "completed" || status === "cancelled"
        ? status
        : undefined,
  };
}

export default function ConsultantAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleItem | null>(null);
  const [detailsAppointment, setDetailsAppointment] = useState<ScheduleItem | null>(null);
  const [appointments, setAppointments] = useState<ScheduleItem[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>("daily");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get<BookingItem[]>("/consultant/bookings/"),
      api.get<AvailabilityItem[]>("/consultant/availability/"),
    ]).then(([bookingsResponse, availabilityResponse]) => {
      if (!isMounted) return;

      if (bookingsResponse.status === "fulfilled") {
        const mappedAppointments = Array.isArray(bookingsResponse.value.data)
          ? bookingsResponse.value.data.map(mapBookingToScheduleItem)
          : [];
        setAppointments(mappedAppointments);
        setSelectedAppointment(mappedAppointments[0] ?? null);
      } else {
        setAppointments([]);
      }

      setAvailability(
        availabilityResponse.status === "fulfilled" && Array.isArray(availabilityResponse.value.data)
          ? availabilityResponse.value.data
          : [],
      );
      setLoadingAppointments(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleBookingDecision(appointment: ScheduleItem, isAccept: boolean) {
    setStatusMessage("");

    try {
      await api.post("/consultant/bookings/", {
        booking_id: Number(appointment.id),
        is_accept: isAccept,
      });
    } catch (error: unknown) {
      const responseData =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { detail?: unknown; error?: unknown } } }).response?.data
          : undefined;
      const detail =
        typeof responseData?.detail === "string"
          ? responseData.detail
          : typeof responseData?.error === "string"
            ? responseData.error
            : "Unable to update this booking right now.";
      setStatusMessage(detail);
      return;
    }

    if (isAccept) {
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointment.id
            ? { ...item, status: "Confirmed", action: "Join", sessionStatus: "confirmed" }
            : item,
        ),
      );

      setSelectedAppointment((current) =>
        current?.id === appointment.id
          ? { ...current, status: "Confirmed", action: "Join", sessionStatus: "confirmed" }
          : current,
      );
      setStatusMessage("Booking approved successfully.");
      return;
    }

    setAppointments((current) => current.filter((item) => item.id !== appointment.id));
    setSelectedAppointment((current) => (current?.id === appointment.id ? null : current));
    setStatusMessage("Booking rejected successfully.");
  }

  async function handleShareMeetingLink(appointment: ScheduleItem, meetingLink: string) {
    setStatusMessage("");

    let data: BookingItem;
    try {
      const response = await api.patch<BookingItem>(`/consultant/bookings/${appointment.id}/meeting-link/`, {
        meeting_link: meetingLink,
      });
      data = response.data;
    } catch (error: unknown) {
      const responseData =
        typeof error === "object" && error !== null && "response" in error
          ? (error as {
              response?: { data?: { meeting_link?: unknown; detail?: unknown; error?: unknown } };
            }).response?.data
          : undefined;
      const detail =
        Array.isArray(responseData?.meeting_link)
          ? responseData.meeting_link.join(", ")
          : typeof responseData?.detail === "string"
            ? responseData.detail
            : typeof responseData?.error === "string"
              ? responseData.error
              : "Unable to share meeting link right now.";
      setStatusMessage(detail);
      return;
    }
    const updatedAppointment = mapBookingToScheduleItem(data);

    setAppointments((current) =>
      current.map((item) => (item.id === appointment.id ? updatedAppointment : item)),
    );
    setSelectedAppointment((current) => (current?.id === appointment.id ? updatedAppointment : current));
    setStatusMessage("Meeting link shared successfully.");
  }

  const selectedDateLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [selectedDate],
  );

  const scheduleHeading = useMemo(() => {
    if (scheduleFilter === "weekly") return "Weekly Schedule";
    if (scheduleFilter === "monthly") return "Monthly Schedule";
    return "Today's Schedule";
  }, [scheduleFilter]);

  const scheduleSubLabel = useMemo(() => {
    if (scheduleFilter === "weekly") {
      return `Week of ${selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    if (scheduleFilter === "monthly") {
      return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [scheduleFilter, selectedDate]);

  const stats = useMemo<AppointmentStat[]>(() => {
    const pendingCount = appointments.filter((item) => item.sessionStatus === "pending").length;
    const confirmedCount = appointments.filter((item) => item.sessionStatus === "confirmed").length;
    const completedCount = appointments.filter((item) => item.sessionStatus === "completed").length;
    const cancelledCount = appointments.filter((item) => item.sessionStatus === "cancelled").length;

    return [
      { title: "Today's Appointments", value: String(appointments.length), icon: CalendarDays, tone: "text-[#0A4833]" },
      { title: "Upcoming This Week", value: String(confirmedCount + pendingCount), icon: CalendarRange, tone: "text-[#B67B1B]" },
      { title: "Completed Sessions", value: String(completedCount), icon: CheckCircle2, tone: "text-[#16A34A]" },
      { title: "Pending Confirmations", value: String(pendingCount), icon: TriangleAlert, tone: "text-[#EA580C]" },
      { title: "Rescheduled Sessions", value: String(cancelledCount), icon: RefreshCw, tone: "text-[#2563EB]" },
      { title: "Available Slots", value: "0", icon: Rows3, tone: "text-[#475467]" },
    ];
  }, [appointments]);

  const nextAppointment = useMemo(
    () => appointments.find((item) => item.sessionStatus === "confirmed" || item.sessionStatus === "pending") ?? null,
    [appointments],
  );

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesDate =
        !item.rawDate ||
        (scheduleFilter === "daily"
          ? isSameDay(item.rawDate, selectedDate)
          : scheduleFilter === "weekly"
            ? isInCurrentWeek(item.rawDate, selectedDate)
            : isInCurrentMonth(item.rawDate, selectedDate));

      if (!matchesDate) return false;
      if (!normalizedSearch) return true;

      return [
        item.name,
        item.type,
        item.status,
        item.focus,
        item.consultationMode,
        item.date,
        item.time,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [appointments, scheduleFilter, searchQuery, selectedDate]);

  function handleNextDate() {
    setSelectedDate((current) => {
      if (scheduleFilter === "daily") return addDays(current, 1);
      if (scheduleFilter === "weekly") return addDays(current, 7);
      return addMonths(current, 1);
    });
  }

  return (
    <>
      <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
        <div className="mx-auto max-w-[1220px] space-y-5">
          <AppointmentsHeader
            dateLabel={selectedDateLabel}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onTodayClick={() => setSelectedDate(new Date())}
            onNextDateClick={handleNextDate}
          />
          <AppointmentsStatsGrid stats={stats} />
          {statusMessage ? (
            <div className="rounded-[10px] border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm text-[#0A4833]">
              {statusMessage}
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_320px]">
            {loadingAppointments ? (
              <section className="order-2 rounded-[16px] border border-[#E4E7EC] bg-white p-6 text-sm text-[#667085] xl:order-1">
                Loading appointments...
              </section>
            ) : (
              <div className="order-2 space-y-4 xl:order-1">
                <div className="inline-flex w-full max-w-[360px] items-center rounded-[16px] border border-[#D0D5DD] bg-white p-1">
                  {[
                    { id: "daily", label: "Daily" },
                    { id: "weekly", label: "Weekly" },
                    { id: "monthly", label: "Monthly" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setScheduleFilter(filter.id as ScheduleFilter)}
                      className={`flex-1 rounded-[12px] px-5 py-3 text-[14px] font-medium transition ${
                        scheduleFilter === filter.id
                          ? "bg-[#0A4833] text-white"
                          : "text-[#475467] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <TodaysScheduleCard
                  schedule={filteredAppointments}
                  title={scheduleHeading}
                  dateLabel={scheduleSubLabel}
                  onSelectAppointment={setSelectedAppointment}
                  onOpenDetails={setDetailsAppointment}
                  onBookingDecision={handleBookingDecision}
                />
              </div>
            )}

            <div className="order-1 grid gap-5 md:grid-cols-2 xl:order-2 xl:flex xl:flex-col">
              <NextAppointmentCard
                appointment={selectedAppointment ?? nextAppointment}
                onJoin={(appointment) => setSelectedAppointment(appointment)}
                onShareLink={handleShareMeetingLink}
              />
              <QuickAvailabilityCard availability={availability} />
            </div>
          </div>
        </div>
      </main>

      <AppointmentDetailsModal appointment={detailsAppointment} onClose={() => setDetailsAppointment(null)} />
    </>
  );
}
