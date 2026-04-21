"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Apple,
  CalendarDays,
  Clock3,
  Eye,
  FilePlus,
  Pencil,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import api from "@/services/api";

type Booking = {
  id: string;
  userName: string;
  userEmail: string;
  nutritionistName: string;
  dateTime: string;
  healthGoal: string;
  status: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiBooking(item: Record<string, any>, index: number): Booking {
  const user = item.user ?? {};
  const consultant = item.consultant ?? item.nutritionist ?? {};
  const consultantUser = consultant.user ?? {};

  const dateStr = item.scheduled_date ?? item.date ?? item.created_at ?? "";
  const timeStr = item.scheduled_time ?? item.time ?? "";
  const formatted = dateStr
    ? `${new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${timeStr ? " " + timeStr : ""}`
    : "—";

  return {
    id: String(item.id ?? `bk-${index}`),
    userName: String(user.full_name ?? user.name ?? item.user_name ?? "Unknown"),
    userEmail: String(user.email ?? item.user_email ?? ""),
    nutritionistName: String(
      consultantUser.full_name ??
      consultantUser.name ??
      consultant.name ??
      item.nutritionist_name ??
      "—"
    ),
    dateTime: formatted,
    healthGoal: String(item.health_goal ?? item.reason ?? item.notes ?? "—"),
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

function ConsultationTopSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Consultations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-md border border-[#DADADA] bg-[#F1F3F5] px-4 py-2 text-sm font-medium text-[#4B5563]">
            Filter
          </button>
          <button className="rounded-md border border-[#A68966] bg-[#A68966] px-4 py-2 text-sm font-medium text-white">
            Export
          </button>
          <Link
            href="/admindashboard/consultation/assign-nutritionist"
            className="rounded-md border border-[#0A4833] bg-[#0A4833] px-4 py-2 text-sm font-medium text-white"
          >
            + Assign Nutritionist
          </Link>
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
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">All Status</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">Session Type</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">All Nutritionists</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">mm/dd/yyyy</div>
      </div>
    </div>
  );
}

function ConsultationRightPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Today&apos;s Schedule</h3>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg bg-[#F8F5ED] px-3 py-2">
            <p className="text-sm font-medium text-[#111827]">Emily Johnson</p>
            <p className="text-xs text-[#6B7280]">2:00 PM - Video Call</p>
            <p className="mt-1 text-xs text-[#0A7A44]">Confirmed</p>
          </div>
          <div className="rounded-lg bg-[#FFF7ED] px-3 py-2">
            <p className="text-sm font-medium text-[#111827]">John Smith</p>
            <p className="text-xs text-[#6B7280]">4:30 PM - Audio Call</p>
            <p className="mt-1 text-xs text-[#B45309]">Pending</p>
          </div>
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

export default function AdminConsultationPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      } catch {
        setFetchError("Failed to load consultations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.patch(`/consultant/admin/bookings/${id}/status/`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    } catch {
      window.alert("Failed to update booking status. Please try again.");
    }
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <ConsultationTopSection />

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

            {!isLoading && bookings.length > 0 && (
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
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#111827]">{booking.userName}</p>
                          <p className="text-xs text-[#6B7280]">{booking.userEmail}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#111827]">{booking.nutritionistName}</p>
                        </td>
                        <td className="px-4 py-4 text-[#374151]">{booking.dateTime}</td>
                        <td className="px-4 py-4 text-[#374151]">{booking.healthGoal}</td>
                        <td className={`px-4 py-4 capitalize ${statusColor(booking.status)}`}>
                          {booking.status}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-[#0A4833]">
                            {(booking.status === "pending") && (
                              <button
                                onClick={() => handleStatusChange(booking.id, "confirmed")}
                                title="Assign / Confirm"
                                className="text-[#A16207] hover:text-[#0A4833]"
                              >
                                <UserPlus size={15} />
                              </button>
                            )}
                            <button title="View" className="hover:text-[#083927]">
                              <Eye size={15} />
                            </button>
                            <button title="Edit" className="hover:text-[#083927]">
                              <Pencil size={15} />
                            </button>
                            {booking.status === "completed" && (
                              <>
                                <button title="Add Report" className="text-[#1D4ED8]">
                                  <FilePlus size={15} />
                                </button>
                                <button title="Activity" className="text-[#1D4ED8]">
                                  <Activity size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ConsultationRightPanel />
        </div>
      </div>
    </section>
  );
}
