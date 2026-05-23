"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import EventsOverview from "./components/EventsOverview";
import EventsFiltersAndActions, { type EventFilters } from "./components/EventsFiltersAndActions";
import EventsTable from "./components/EventsTable";
import EventDetailsModal from "./components/EventDetailsModal";
import type { EventDetail, EventRow, EventStat } from "./types";

const eventCategoryLabels: Record<string, string> = {
  webinar: "Nutrition Session",
  workshop: "Wellness Workshop",
  community: "Community Meetup",
  seminar: "Healthy Eating",
  other: "Buckwheat Awareness",
};

const defaultFilters: EventFilters = {
  status: "All Status",
  type: "All Types",
  category: "All Categories",
  sortBy: "Newest First",
  featuredOnly: false,
};

function toMediaUrl(value: unknown) {
  const path = String(value ?? "");
  if (!path) return "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=160&q=80&auto=format&fit=crop";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value: unknown) {
  if (!value) return "";
  const time = String(value).slice(0, 5);
  const date = new Date(`2000-01-01T${time}`);
  if (Number.isNaN(date.getTime())) return time;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiEvent(item: Record<string, any>, index: number): EventRow {
  const eventDate = item.event_date ?? item.date ?? "";
  const startTime = item.start_time ?? "";
  const endTime = item.end_time ?? "";
  const eventType = String(item.event_type ?? "");
  const category = String(item.category ?? eventCategoryLabels[eventType] ?? (eventType || "Not set"));
  const hostName = String(item.host_speaker_name ?? item.host_name ?? item.organizer ?? "Not set");
  const formattedDate = formatDate(eventDate) || String(item.dateText ?? "TBD");
  const formattedTime = [formatTime(startTime), formatTime(endTime)].filter(Boolean).join(" - ") || String(item.timeText ?? "TBD");
  const type = item.is_online ? "Online" : "Offline";
  const registrations =
    item.registration_count != null
      ? String(item.registration_count)
      : item.registrations_count != null
        ? String(item.registrations_count)
        : "0";

  return {
    id: String(item.id ?? `event-${index}`),
    title: String(item.title ?? item.name ?? "Untitled Event"),
    subtitle: String(item.short_subtitle ?? item.subtitle ?? ""),
    coverImage: toMediaUrl(item.cover_image ?? item.banner ?? item.image),
    category,
    hostName,
    hostRole: String(item.host_role ?? item.organizer_role ?? "Host"),
    hostAvatar: String(item.host_avatar ?? "https://i.pravatar.cc/80?img=5"),
    dateText: formattedDate,
    timeText: formattedTime,
    eventDate: String(eventDate ?? ""),
    type,
    registrations,
    status: item.status === "published" ? "Published" : item.status === "cancelled" ? "Cancelled" : "Draft",
    isFeatured: Boolean(item.is_featured),
    attendeeAvatars: Array.isArray(item.attendee_avatars) ? item.attendee_avatars : [],
  };
}

function applyEventFilters(events: EventRow[], filters: EventFilters) {
  const filtered = events.filter((event) => {
    const statusMatch = filters.status === "All Status" || event.status === filters.status;
    const typeMatch = filters.type === "All Types" || event.type === filters.type;
    const categoryMatch = filters.category === "All Categories" || event.category === filters.category;
    const featuredMatch = !filters.featuredOnly || event.isFeatured;
    return statusMatch && typeMatch && categoryMatch && featuredMatch;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sortBy === "Title A-Z") return a.title.localeCompare(b.title);
    if (filters.sortBy === "Title Z-A") return b.title.localeCompare(a.title);

    const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
    const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
    return filters.sortBy === "Oldest First" ? dateA - dateB : dateB - dateA;
  });
}

function buildStats(events: EventRow[]): EventStat[] {
  const total = events.length;
  const upcoming = events.filter((e) => e.status === "Published").length;
  const ongoing = 0;
  const totalRegs = events.reduce((sum, e) => sum + parseInt(e.registrations, 10), 0);
  const completed = events.filter((e) => e.status === "Cancelled").length;
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
    { id: "attendance", label: "Avg", value: "-", subText: "Avg Attendance Rate", icon: "chart" },
  ];
}

function DeleteConfirmDialog({
  eventTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  eventTitle?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-[#111827]">Delete Event</h3>
        <p className="mt-2 text-sm text-[#374151]">
          Are you sure you want to delete {eventTitle ? <span className="font-semibold text-[#0A4833]">{eventTitle}</span> : "this event"}? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C] disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState<EventRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);

  const fetchEvents = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/events/");
      const raw: Record<string, unknown>[] = Array.isArray(res.data)
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
    if (!pendingDeleteEvent) return;
    setIsDeleting(true);
    try {
      await api.delete(`/events/${pendingDeleteEvent.id}/`);
      setEvents((prev) => prev.filter((event) => event.id !== pendingDeleteEvent.id));
      toast.success("Event deleted successfully.");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
      setPendingDeleteEvent(null);
    }
  }

  function selectedEvents() {
    return events.filter((event) => selectedIds.includes(event.id));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function toggleSelectAllFiltered() {
    const visibleIds = filteredEvents.map((event) => event.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) => {
      if (allSelected) return prev.filter((id) => !visibleIds.includes(id));
      return [...new Set([...prev, ...visibleIds])];
    });
  }

  async function updateSelectedStatus(status: "published" | "cancelled" | "draft") {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one event.");
      return;
    }

    const nextStatus = status === "published" ? "Published" : status === "cancelled" ? "Cancelled" : "Draft";
    setEvents((prev) => prev.map((event) => (selectedIds.includes(event.id) ? { ...event, status: nextStatus } : event)));

    try {
      await Promise.all(selectedIds.map((id) => api.patch(`/events/${id}/`, { status })));
      toast.success(
        status === "published"
          ? "Selected events published."
          : status === "cancelled"
            ? "Selected events cancelled."
            : "Selected events moved to draft."
      );
      setSelectedIds([]);
    } catch {
      toast.error("Failed to update selected events. Please try again.");
      fetchEvents();
    }
  }

  function sendReminders() {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one event.");
      return;
    }
    toast.success(`Reminder queued for ${selectedIds.length} selected event(s).`);
  }

  function exportSelected() {
    const rows = selectedEvents();
    if (rows.length === 0) {
      toast.warning("Select at least one event.");
      return;
    }

    const header = ["ID", "Title", "Category", "Host", "Date", "Time", "Type", "Registrations", "Status"];
    const csv = [header, ...rows.map((event) => [
      event.id,
      event.title,
      event.category,
      event.hostName,
      event.dateText,
      event.timeText,
      event.type,
      event.registrations,
      event.status,
    ])].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "events-selected.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function deleteSelected() {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one event.");
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected event(s)? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/events/${id}/`)));
      setEvents((prev) => prev.filter((event) => !selectedIds.includes(event.id)));
      setSelectedIds([]);
      toast.success("Selected events deleted.");
    } catch {
      toast.error("Failed to delete selected events. Please try again.");
      fetchEvents();
    }
  }

  async function viewEvent(id: string) {
    setSelectedEvent(null);
    setDetailsError(null);
    setIsDetailsLoading(true);
    try {
      const res = await api.get(`/events/${id}/`);
      setSelectedEvent(res.data);
    } catch {
      setDetailsError("Failed to load event details.");
    } finally {
      setIsDetailsLoading(false);
    }
  }

  function closeDetails() {
    setSelectedEvent(null);
    setDetailsError(null);
    setIsDetailsLoading(false);
  }

  const filteredEvents = applyEventFilters(events, filters);
  const eventStats = buildStats(events);
  const categories = Array.from(new Set(events.map((event) => event.category).filter(Boolean))).sort();

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      {pendingDeleteEvent && (
        <DeleteConfirmDialog
          eventTitle={pendingDeleteEvent.title}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteEvent(null)}
        />
      )}
      {(selectedEvent || isDetailsLoading || detailsError) && (
        <EventDetailsModal event={selectedEvent} isLoading={isDetailsLoading} error={detailsError} onClose={closeDetails} />
      )}

      <div className="mx-auto max-w-[1180px] space-y-4">
        <EventsOverview stats={eventStats} />
        <EventsFiltersAndActions
          filters={filters}
          categories={categories}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters(defaultFilters)}
          selectedCount={selectedIds.length}
          onPublishSelected={() => updateSelectedStatus("published")}
          onDraftSelected={() => updateSelectedStatus("draft")}
          onCancelSelected={() => updateSelectedStatus("cancelled")}
          onDeleteSelected={deleteSelected}
          onSendReminders={sendReminders}
          onExportSelected={exportSelected}
        />

        {isLoading && <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">Loading events...</div>}
        {fetchError && <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">{fetchError}</div>}
        {!isLoading && !fetchError && events.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No events found. Create the first event using the button above.
          </div>
        )}
        {!isLoading && !fetchError && events.length > 0 && filteredEvents.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No events match the selected filters.
          </div>
        )}

        {!isLoading && filteredEvents.length > 0 && (
          <EventsTable
            rows={filteredEvents}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllFiltered}
            onView={viewEvent}
            onEdit={(id) => router.push(`/admindashboard/events/create?eventId=${id}`)}
            onDelete={(id) => setPendingDeleteEvent(events.find((event) => event.id === id) ?? null)}
          />
        )}
      </div>
    </section>
  );
}
