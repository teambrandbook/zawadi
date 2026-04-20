"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import EventsOverview from "./components/EventsOverview";
import EventsFiltersAndActions from "./components/EventsFiltersAndActions";
import EventsTable from "./components/EventsTable";
import type { EventRow, EventStat } from "./types";

const eventStats: EventStat[] = [
  { id: "total", label: "+12%", value: "—", subText: "Total Events", icon: "calendar" },
  { id: "upcoming", label: "—", value: "—", subText: "Upcoming Events", icon: "clock" },
  { id: "ongoing", label: "Live", value: "—", subText: "Ongoing Events", icon: "play" },
  { id: "registrations", label: "—", value: "—", subText: "Total Registrations", icon: "users" },
  { id: "completed", label: "—", value: "—", subText: "Completed Events", icon: "check" },
  { id: "draft", label: "—", value: "—", subText: "Draft Events", icon: "draft" },
  { id: "cancelled", label: "—", value: "—", subText: "Cancelled Events", icon: "cancel" },
  { id: "attendance", label: "—", value: "—", subText: "Avg Attendance Rate", icon: "chart" },
];

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

export default function EventsManagementPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  async function handleDeleteEvent(id: string) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      window.alert("Failed to delete event. Please try again.");
    }
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
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
          <EventsTable rows={events} onDelete={handleDeleteEvent} />
        )}
      </div>
    </section>
  );
}
