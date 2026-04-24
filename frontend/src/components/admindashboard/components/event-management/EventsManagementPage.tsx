"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import EventsOverview from "./components/EventsOverview";
import EventsFiltersAndActions from "./components/EventsFiltersAndActions";
import EventsTable from "./components/EventsTable";
import type { EventRow, EventStat } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiEvent(item: Record<string, any>, index: number): EventRow {
  const startDate = item.start_date ?? item.date ?? item.event_date ?? "";
  const endDate = item.end_date ?? "";
  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : String(item.dateText ?? "TBD");
  const formattedTime = startDate
    ? `${new Date(startDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}${endDate ? " - " + new Date(endDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}`
    : String(item.timeText ?? "");

  return {
    id: String(item.id ?? `event-${index}`),
    title: String(item.title ?? item.name ?? "Untitled Event"),
    subtitle: String(item.description ?? item.subtitle ?? ""),
    coverImage: String(item.banner ?? item.cover_image ?? item.image ?? "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=160&q=80&auto=format&fit=crop"),
    category: String(item.category ?? "—"),
    hostName: String(item.host_name ?? item.organizer ?? "—"),
    hostRole: String(item.host_role ?? item.organizer_role ?? "Host"),
    hostAvatar: String(item.host_avatar ?? "https://i.pravatar.cc/80?img=5"),
    dateText: formattedDate,
    timeText: formattedTime,
    type: item.event_type === "online" || item.event_type === "Online" ? "Online" : "Offline",
    registrations: item.registrations_count != null ? String(item.registrations_count) : "—",
    status: item.status === "published" ? "Published" : item.status === "cancelled" ? "Cancelled" : "Draft",
    attendeeAvatars: Array.isArray(item.attendee_avatars) ? item.attendee_avatars : [],
  };
}

function buildStats(events: EventRow[]): EventStat[] {
  const total = events.length;
  const upcoming = events.filter((e) => e.status === "Published").length;
  const ongoing = 0; // would need a date comparison; placeholder
  const totalRegs = events.reduce((sum, e) => sum + (e.registrations !== "—" ? parseInt(e.registrations) : 0), 0);
  const completed = events.filter((e) => e.status === "Cancelled").length; // approximate
  const draft = events.filter((e) => e.status === "Draft").length;
  const cancelled = events.filter((e) => e.status === "Cancelled").length;

  return [
    { id: "total", label: "+12%", value: String(total), subText: "Total Events", icon: "calendar" },
    { id: "upcoming", label: "Upcoming", value: String(upcoming), subText: "Upcoming Events", icon: "clock" },
    { id: "ongoing", label: "Live", value: String(ongoing), subText: "Ongoing Events", icon: "play" },
    { id: "registrations", label: "Total", value: String(totalRegs), subText: "Total Registrations", icon: "users" },
    { id: "completed", label: "Done", value: String(completed), subText: "Completed Events", icon: "check" },
    { id: "draft", label: "Draft", value: String(draft), subText: "Draft Events", icon: "draft" },
    { id: "cancelled", label: "Cancelled", value: String(cancelled), subText: "Cancelled Events", icon: "cancel" },
    { id: "attendance", label: "Avg", value: "—", subText: "Avg Attendance Rate", icon: "chart" },
  ];
}

// Inline delete confirm dialog
function DeleteConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-[#111827]">Delete Event</h3>
        <p className="mt-2 text-sm text-[#374151]">Are you sure you want to delete this event? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/events/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: Record<string, any>[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setEvents(raw.map(mapApiEvent));
    } catch {
      setFetchError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    try {
      await api.delete(`/events/${pendingDeleteId}/`);
      setEvents((prev) => prev.filter((e) => e.id !== pendingDeleteId));
      toast.success("Event deleted successfully.");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  const eventStats = buildStats(events);

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      {pendingDeleteId && (
        <DeleteConfirmDialog
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}

      <div className="mx-auto max-w-[1180px] space-y-4">
        <EventsOverview stats={eventStats} />
        <EventsFiltersAndActions />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading events...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && events.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No events found. Create the first event using the button above.
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <EventsTable rows={events} onDelete={(id) => setPendingDeleteId(id)} />
        )}
      </div>
    </section>
  );
}
