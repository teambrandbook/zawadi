"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  CalendarDays,
  Clock3,
  Eye,
  Stethoscope,
} from "lucide-react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type Booking = {
  id: string;
  userName: string;
  userImage: string | null;
  userEmail: string;
  nutritionistName: string;
  nutritionistImage: string | null;
  bookingDateKey: string;
  dateLabel: string;
  timeLabel: string;
  healthGoal: string;
  sessionType: string;
  primaryGoal: string;
  focusArea: string;
  dietPreferences: string;
  lifestyleActivityLevel: string;
  buckwheatJourneyGoal: string;
  message: string;
  language: string;
  consultantRole: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

type ConsultationFilters = {
  status: string;
  sessionType: string;
  nutritionist: string;
  date: string;
};

function toImageUrl(image?: string | null) {
  if (!image) return null;
  return getImageUrl(image);
}

function detailValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function formatDateTime(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiBooking(item: Record<string, any>, index: number): Booking {
  const user = item.user ?? {};
  const consultant = item.consultant ?? item.nutritionist ?? {};
  const consultantUser = consultant.user ?? {};

  const dateStr = item.booked_date ?? item.scheduled_date ?? item.date ?? item.created_at ?? "";
  const bookingDateKey = String(dateStr).slice(0, 10);
  const timeStr = item.booked_slot ?? item.scheduled_time ?? item.time ?? "";
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return {
    id: String(item.id ?? `bk-${index}`),
    userName: String(item.user_name ?? user.full_name ?? user.name ?? "Unknown"),
    userImage: toImageUrl(
      typeof item.user_image === "string"
        ? item.user_image
        : typeof user.photo === "string"
        ? user.photo
        : null
    ),
    userEmail: String(item.user_email ?? user.email ?? ""),
    nutritionistName: String(
      item.consultant_name ??
      consultantUser.full_name ??
      consultantUser.name ??
      consultant.name ??
      item.nutritionist_name ??
      "—"
    ),
    nutritionistImage: toImageUrl(
      typeof item.consultant_image === "string"
        ? item.consultant_image
        : typeof consultantUser.photo === "string"
        ? consultantUser.photo
        : null
    ),
    bookingDateKey,
    dateLabel: formattedDate,
    timeLabel: String(timeStr || "â€”"),
    healthGoal: String(item.primary_wellness_goal ?? item.health_goal ?? item.reason ?? item.notes ?? "—"),
    sessionType: detailValue(item.session_type),
    primaryGoal: detailValue(item.primary_goal),
    focusArea: detailValue(item.focuses_area),
    dietPreferences: detailValue(item.diet_preferences),
    lifestyleActivityLevel: detailValue(item.lifestyle_activity_level),
    buckwheatJourneyGoal: detailValue(item.buckwheat_journey_goal),
    message: detailValue(item.message),
    language: detailValue(item.language),
    consultantRole: detailValue(item.consultant_role),
    createdAt: formatDateTime(item.created_at),
    updatedAt: formatDateTime(item.updated_at),
    status: String(item.status ?? "pending"),
  };
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "approved") return "text-[#0A7A44]";
  if (s === "pending") return "text-[#B45309]";
  if (s === "completed") return "text-[#1D4ED8]";
  if (s === "cancelled") return "text-[#DC2626]";
  return "text-[#374151]";
}

function ConsultationTopSection({
  bookings,
  filters,
  onFiltersChange,
}: {
  bookings: Booking[];
  filters: ConsultationFilters;
  onFiltersChange: (filters: ConsultationFilters) => void;
}) {
  const statuses = Array.from(new Set(bookings.map((booking) => booking.status).filter(Boolean)));
  const sessionTypes = Array.from(
    new Set(bookings.map((booking) => booking.sessionType).filter((value) => value && value !== "-"))
  );
  const nutritionists = Array.from(
    new Set(bookings.map((booking) => booking.nutritionistName).filter((value) => value && value !== "â€”"))
  );
  const hasActiveFilters = Boolean(filters.status || filters.sessionType || filters.nutritionist || filters.date);

  function updateFilter(key: keyof ConsultationFilters, value: string) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Consultations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFiltersChange({ status: "", sessionType: "", nutritionist: "", date: "" })}
            disabled={!hasActiveFilters}
            className="rounded-md border border-[#DADADA] bg-[#F1F3F5] px-4 py-2 text-sm font-medium text-[#4B5563] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear Filters
          </button>
          <button className="rounded-md border border-[#A68966] bg-[#A68966] px-4 py-2 text-sm font-medium text-white">
            Export
          </button>
          {/* <Link
            href="/admindashboard/consultation/assign-nutritionist"
            className="rounded-md border border-[#0A4833] bg-[#0A4833] px-4 py-2 text-sm font-medium text-white"
          >
            + Assign Nutritionist
          </Link> */}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Total Consultations</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">—</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <Stethoscope size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Pending Requests</p>
              <p className="mt-2 text-3xl font-semibold text-[#A16207]">—</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F3EEE6] text-[#A16207]">
              <Clock3 size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Today&apos;s Sessions</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">—</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <CalendarDays size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Active Diet Plans</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">—</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <Apple size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563] outline-none focus:border-[#0A4833]"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.sessionType}
          onChange={(event) => updateFilter("sessionType", event.target.value)}
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563] outline-none focus:border-[#0A4833]"
        >
          <option value="">Session Type</option>
          {sessionTypes.map((sessionType) => (
            <option key={sessionType} value={sessionType}>
              {sessionType}
            </option>
          ))}
        </select>

        <select
          value={filters.nutritionist}
          onChange={(event) => updateFilter("nutritionist", event.target.value)}
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563] outline-none focus:border-[#0A4833]"
        >
          <option value="">All Nutritionists</option>
          {nutritionists.map((nutritionist) => (
            <option key={nutritionist} value={nutritionist}>
              {nutritionist}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(event) => updateFilter("date", event.target.value)}
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563] outline-none focus:border-[#0A4833]"
        />
      </div>
    </div>
  );
}

function ConsultationRightPanel({
  bookings,
  isLoading,
}: {
  bookings: Booking[];
  isLoading: boolean;
}) {
  const todayBookings = bookings.filter((booking) => booking.bookingDateKey === getLocalDateKey());

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Today&apos;s Schedule</h3>
        <div className="mt-3 space-y-2">
          {isLoading && <p className="text-sm text-[#6B7280]">Loading today&apos;s schedules...</p>}
          {!isLoading && todayBookings.length === 0 && (
            <p className="text-sm text-[#6B7280]">No schedules today.</p>
          )}
          {!isLoading &&
            todayBookings.map((booking) => (
              <div key={booking.id} className="rounded-lg bg-[#F8F5ED] px-3 py-2">
                <p className="text-sm font-medium text-[#111827]">{booking.userName}</p>
                <p className="text-xs text-[#6B7280]">
                  {booking.timeLabel} - {booking.sessionType}
                </p>
                <p className="text-xs text-[#6B7280]">{booking.nutritionistName}</p>
                <p className={`mt-1 text-xs capitalize ${statusColor(booking.status)}`}>
                  {booking.status}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Quick Stats</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Completion Rate</span>
            <span className="font-medium text-[#0A4833]">94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Avg Session Duration</span>
            <span className="font-medium text-[#0A4833]">45 min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Most Booked Expert</span>
            <span className="font-medium text-[#A68966]">Dr. Sarah Wilson</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationDetailsModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const details = [
    ["Booking ID", booking.id],
    ["User Name", booking.userName],
    ["User Email", booking.userEmail],
    ["Consultant Name", booking.nutritionistName],
    ["Consultant Role", booking.consultantRole],
    ["Date", booking.dateLabel],
    ["Time", booking.timeLabel],
    ["Session Type", booking.sessionType],
    ["Status", booking.status],
    ["Primary Goal", booking.primaryGoal],
    ["Primary Wellness Goal", booking.healthGoal],
    ["Focus Area", booking.focusArea],
    ["Diet Preferences", booking.dietPreferences],
    ["Lifestyle Activity Level", booking.lifestyleActivityLevel],
    ["Buckwheat Journey Goal", booking.buckwheatJourneyGoal],
    ["Language", booking.language],
    ["Message", booking.message],
    ["created_at", booking.createdAt],
    ["updated_at", booking.updatedAt],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h3 className="text-lg font-semibold text-[#0A4833]">Consultation Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#D1D5DB] px-3 py-1 text-sm text-[#4B5563] hover:bg-[#F9FAFB]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="mb-3 text-sm font-semibold text-[#0A4833]">User</p>
            <div className="flex items-center gap-3">
              <img
                src={booking.userImage || "/logo/zawadi-logo.webp"}
                alt={booking.userName}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-[#111827]">{booking.userName}</p>
                <p className="text-sm text-[#6B7280]">{booking.userEmail}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="mb-3 text-sm font-semibold text-[#0A4833]">Consultant</p>
            <div className="flex items-center gap-3">
              <img
                src={booking.nutritionistImage || "/logo/zawadi-logo.webp"}
                alt={booking.nutritionistName}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-[#111827]">{booking.nutritionistName}</p>
                <p className="text-sm text-[#6B7280]">{booking.consultantRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
              <p className="text-xs font-medium text-[#6B7280]">{label}</p>
              <p className="mt-1 break-words text-sm text-[#111827]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminConsultationPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<ConsultationFilters>({
    status: "",
    sessionType: "",
    nutritionist: "",
    date: "",
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = !filters.status || booking.status === filters.status;
      const matchesSessionType = !filters.sessionType || booking.sessionType === filters.sessionType;
      const matchesNutritionist = !filters.nutritionist || booking.nutritionistName === filters.nutritionist;
      const matchesDate = !filters.date || booking.bookingDateKey === filters.date;

      return matchesStatus && matchesSessionType && matchesNutritionist && matchesDate;
    });
  }, [bookings, filters]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/consultant/admin/bookings/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setBookings(raw.map(mapApiBooking));
        console.log(res.data);
        
      } catch {
        setFetchError("Failed to load consultations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <ConsultationTopSection
          bookings={bookings}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="rounded-xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
              <h2 className="text-lg font-semibold text-[#0A4833]">Recent Consultations</h2>
              <button className="rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#4B5563]">
                Bulk Assign
              </button>
            </div>

            {isLoading && (
              <div className="p-6 text-center text-sm text-[#6B7280]">Loading consultations...</div>
            )}
            {fetchError && (
              <div className="p-6 text-center text-sm text-[#B91C1C]">{fetchError}</div>
            )}
            {!isLoading && !fetchError && bookings.length === 0 && (
              <div className="p-8 text-center text-sm text-[#6B7280]">No consultations found.</div>
            )}
            {!isLoading && !fetchError && bookings.length > 0 && filteredBookings.length === 0 && (
              <div className="p-8 text-center text-sm text-[#6B7280]">No consultations match the selected filters.</div>
            )}

            {!isLoading && filteredBookings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs text-[#6B7280]">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Nutritionist</th>
                      <th className="px-4 py-3">Date &amp; Time</th>
                      <th className="px-4 py-3">Health Goal</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.userImage || "/logo/zawadi-logo.webp"}
                              alt={booking.userName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-[#111827]">{booking.userName}</p>
                              <p className="text-xs text-[#6B7280]">{booking.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.nutritionistImage || "/logo/zawadi-logo.webp"}
                              alt={booking.nutritionistName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <p className="font-medium text-[#111827]">{booking.nutritionistName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[#374151]">
                          <span>{booking.dateLabel}</span>
                          <br />
                          <span className="text-xs text-[#6B7280]">{booking.timeLabel}</span>
                        </td>
                        <td className="px-4 py-4 text-[#374151]">{booking.healthGoal}</td>
                        <td className={`px-4 py-4 capitalize ${statusColor(booking.status)}`}>
                          {booking.status}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-[#0A4833]">
                            <button
                              type="button"
                              title="View"
                              onClick={() => setSelectedBooking(booking)}
                              className="hover:text-[#083927]"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ConsultationRightPanel bookings={bookings} isLoading={isLoading} />
        </div>
      </div>
      {selectedBooking && (
        <ConsultationDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </section>
  );
}
