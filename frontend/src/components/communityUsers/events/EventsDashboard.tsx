"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle2,
  Mail,
  Apple,
  Heart,
  Video,
  MapPin,
  Search,
  ChevronDown,
  Bell,
  ExternalLink,
  RefreshCw,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "@/services/api";

type EventListItem = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  event_type: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_online: boolean;
  location: string;
  registration_count: number;
  status: string;
};

type RegistrationItem = {
  id: number;
  event: number;
  status: string;
  event_detail?: {
    id: number;
    title: string;
    event_date: string | null;
    start_time: string | null;
    end_time: string | null;
    is_online: boolean;
    location: string;
    status: string;
  };
};

type NotificationReceipt = {
  receipt_id: number;
  id: number;
  title: string;
  body: string;
  notification_type: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTIONAL";
  is_read: boolean;
  created_at: string;
};

type TabKey = "All Events" | "Upcoming" | "Joined" | "Invitations";

const tabs: TabKey[] = ["All Events", "Upcoming", "Joined", "Invitations"];
const EVENT_CALENDAR_STORAGE_KEY = "zewadiCommunityCalendarEventIds";

function eventTypeLabel(type: string): string {
  const map: Record<string, string> = {
    webinar: "Webinar",
    workshop: "Workshop",
    seminar: "Seminar",
    community: "Community Meetup",
    other: "Wellness Session",
  };
  return map[type] || "Wellness Session";
}

function eventTypeColor(type: string): string {
  const map: Record<string, string> = {
    webinar: "bg-blue-100 text-blue-800",
    workshop: "bg-orange-100 text-orange-800",
    seminar: "bg-purple-100 text-purple-800",
    community: "bg-green-100 text-green-800",
    other: "bg-gray-100 text-gray-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
}

function eventTypeIcon(type: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    workshop: Apple,
    webinar: Video,
    seminar: Heart,
    community: Users,
    other: Calendar,
  };
  return map[type] || Calendar;
}

function formatDayAndTime(dateStr: string | null, timeStr?: string | null): { day: string; time: string; full: string } {
  if (!dateStr) return { day: "-", time: "-", full: "-" };
  const dateObj = timeStr ? new Date(`${dateStr}T${timeStr}`) : new Date(dateStr);
  if (Number.isNaN(dateObj.getTime())) return { day: "-", time: "-", full: "-" };
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();
  const day = isTomorrow
    ? "Tomorrow"
    : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = timeStr ? dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "-";
  const full = dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(timeStr ? { hour: "numeric", minute: "2-digit" } : {}),
  });
  return { day, time, full };
}

function getEventStartTime(event: Pick<EventListItem, "event_date" | "start_time">): number {
  if (!event.event_date) return NaN;
  const dateTimeStr = event.start_time ? `${event.event_date}T${event.start_time}` : event.event_date;
  return new Date(dateTimeStr).getTime();
}

function isUpcomingEvent(event: Pick<EventListItem, "event_date" | "start_time" | "status">): boolean {
  const status = event.status.toLowerCase();
  if (status === "completed" || status === "cancelled") return false;

  const startsAt = getEventStartTime(event);
  return !Number.isNaN(startsAt) && startsAt >= Date.now();
}

function isEventNotification(item: NotificationReceipt): boolean {
  const text = `${item.title} ${item.body}`.toLowerCase();
  return (
    item.notification_type === "PROMOTIONAL" ||
    text.includes("event") ||
    text.includes("workshop") ||
    text.includes("webinar") ||
    text.includes("wellness session")
  );
}

function notificationTimeAgo(value: string): string {
  const createdAt = new Date(value).getTime();
  if (Number.isNaN(createdAt)) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function EventsDashboard() {
  const eventListRef = useRef<HTMLDivElement | null>(null);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [calendarEventIds, setCalendarEventIds] = useState<number[]>([]);
  const [eventNotifications, setEventNotifications] = useState<NotificationReceipt[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("All Events");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingEventId, setPendingEventId] = useState<number | null>(null);

  function getErrorDetail(errorValue: unknown, fallback: string): string {
    if (
      typeof errorValue === "object" &&
      errorValue !== null &&
      "response" in errorValue &&
      typeof (errorValue as { response?: { data?: { detail?: unknown } } }).response?.data?.detail ===
        "string"
    ) {
      return (errorValue as { response?: { data?: { detail?: string } } }).response?.data?.detail || fallback;
    }
    return fallback;
  }

  async function loadData() {
    setIsLoading(true);
    setError("");
    try {
      const [eventsResponse, registrationsResponse] = await Promise.allSettled([
        api.get<EventListItem[]>("/events/"),
        api.get<RegistrationItem[]>("/events/my-registrations/"),
      ]);

      if (eventsResponse.status === "fulfilled") {
        setEvents(eventsResponse.value.data);
      } else {
        setEvents([]);
      }

      if (registrationsResponse.status === "fulfilled") {
        setRegistrations(registrationsResponse.value.data);
      } else {
        setRegistrations([]);
      }

      if (eventsResponse.status === "rejected") {
        setError("Unable to load events right now.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadEventNotifications() {
    try {
      const response = await api.get<NotificationReceipt[] | { results?: NotificationReceipt[] }>("/notifications/inbox/");
      const data = Array.isArray(response.data) ? response.data : response.data.results ?? [];
      const latestEventNotifications = data
        .filter(isEventNotification)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      setEventNotifications(latestEventNotifications);
    } catch {
      setEventNotifications([]);
    }
  }

  useEffect(() => {
    void loadData();
    void loadEventNotifications();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(EVENT_CALENDAR_STORAGE_KEY) || "[]");
      setCalendarEventIds(Array.isArray(saved) ? saved.filter((id): id is number => typeof id === "number") : []);
    } catch {
      setCalendarEventIds([]);
    }
  }, []);

  const activeRegistrations = useMemo(
    () => registrations.filter((item) => item.status !== "cancelled"),
    [registrations]
  );

  const registeredEventIds = useMemo(() => {
    return new Set(activeRegistrations.map((item) => item.event));
  }, [activeRegistrations]);

  const completedRegistrationsCount = useMemo(
    () => registrations.filter((item) => item.status === "attended").length,
    [registrations]
  );

  const upcomingEvents = useMemo(() => {
    return events.filter(isUpcomingEvent);
  }, [events]);

  const calendarEvents = useMemo(() => {
    const savedIds = new Set(calendarEventIds);
    return upcomingEvents
      .filter((event) => savedIds.has(event.id))
      .sort((a, b) => getEventStartTime(a) - getEventStartTime(b));
  }, [calendarEventIds, upcomingEvents]);

  useEffect(() => {
    if (isLoading) return;
    const validIds = new Set(upcomingEvents.map((event) => event.id));
    const nextIds = calendarEventIds.filter((id) => validIds.has(id));
    if (nextIds.length === calendarEventIds.length) return;
    setCalendarEventIds(nextIds);
    localStorage.setItem(EVENT_CALENDAR_STORAGE_KEY, JSON.stringify(nextIds));
  }, [calendarEventIds, isLoading, upcomingEvents]);

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => {
      const searchMatch =
        searchTerm.trim().length === 0 ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.short_description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = activeType === "all" || event.event_type === activeType;
      const joined = registeredEventIds.has(event.id);

      if (activeTab === "Joined") return joined && searchMatch && typeMatch;
      if (activeTab === "Upcoming") return !joined && searchMatch && typeMatch;
      if (activeTab === "Invitations") return false;
      return searchMatch && typeMatch;
    });
  }, [activeTab, activeType, registeredEventIds, searchTerm, upcomingEvents]);

  const joinedEvents = useMemo(() => {
    return activeRegistrations
      .filter((item) => item.event_detail && isUpcomingEvent(item.event_detail))
      .map((item) => ({
        registrationId: item.id,
        eventId: item.event,
        status: item.status,
        event: item.event_detail!,
      }))
      .sort((a, b) => {
        const aStr = a.event.start_time ? `${a.event.event_date}T${a.event.start_time}` : a.event.event_date || "";
        const bStr = b.event.start_time ? `${b.event.event_date}T${b.event.start_time}` : b.event.event_date || "";
        return new Date(aStr).getTime() - new Date(bStr).getTime();
      });
  }, [activeRegistrations]);

  const eventTypeOptions = useMemo(() => {
    const types = Array.from(new Set(upcomingEvents.map((item) => item.event_type)));
    return ["all", ...types];
  }, [upcomingEvents]);

  async function handleJoin(eventId: number) {
    setPendingEventId(eventId);
    setError("");
    try {
      await api.post(`/events/${eventId}/register/`);
      await loadData();
    } catch (errorValue: unknown) {
      setError(getErrorDetail(errorValue, "Could not join the event. Please try again."));
    } finally {
      setPendingEventId(null);
    }
  }

  async function handleCancel(eventId: number) {
    setPendingEventId(eventId);
    setError("");
    try {
      await api.delete(`/events/${eventId}/register/`);
      await loadData();
    } catch (errorValue: unknown) {
      setError(getErrorDetail(errorValue, "Could not cancel registration. Please try again."));
    } finally {
      setPendingEventId(null);
    }
  }

  function handleExploreEvents() {
    setActiveTab("All Events");
    setActiveType("all");
    setSearchTerm("");
    eventListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen flex-1 overflow-x-hidden bg-white px-4 py-5 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="mb-1 text-2xl font-bold text-[#06402B] sm:text-3xl">My Events</h1>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Stay connected with wellness sessions, community meetups, and expert-led events.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExploreEvents}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#06402B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#053020] sm:w-auto"
        >
          <Search size={16} />
          <span>Explore Events</span>
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mb-8 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="flex min-h-28 flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-md bg-green-100 p-2">
              <Calendar size={20} className="text-[#06402B]" />
            </div>
            <span className="text-2xl font-bold text-[#06402B]">{upcomingEvents.length}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Upcoming Events</h3>
            <p className="mt-1 text-xs text-gray-500">Next wellness sessions</p>
          </div>
        </div>

        <div className="flex min-h-28 flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-md bg-orange-100 p-2">
              <Users size={20} className="text-orange-700" />
            </div>
            <span className="text-2xl font-bold text-orange-700">{joinedEvents.length}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Joined Events</h3>
            <p className="mt-1 text-xs text-gray-500">Active registrations</p>
          </div>
        </div>

        <div className="flex min-h-28 flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-md bg-green-100 p-2">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{completedRegistrationsCount}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Completed</h3>
            <p className="mt-1 text-xs text-gray-500">Events attended</p>
          </div>
        </div>

        <div className="flex min-h-28 flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-md bg-orange-100 p-2">
              <Mail size={20} className="text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">0</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Invitations</h3>
            <p className="mt-1 text-xs text-gray-500">Pending responses</p>
          </div>
        </div>
      </div>

      <div ref={eventListRef} className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-4 sm:mb-8 xl:flex-row xl:items-center xl:justify-between">
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 shrink-0 rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "bg-[#06402B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(220px,1fr)_180px] xl:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search events..."
              className="min-h-11 w-full rounded-md border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#06402B] xl:w-[220px]"
            />
          </div>
          <div className="relative w-full">
            <button className="flex min-h-11 w-full items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              <span>{activeType === "all" ? "All Types" : eventTypeLabel(activeType)}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            <select
              value={activeType}
              onChange={(event) => setActiveType(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              {eventTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : eventTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">Loading events...</div>
      ) : (
        <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
          <div className="flex-1 space-y-8">
            <section>
              <h2 className="mb-4 text-lg font-bold text-[#06402B]">
                {activeTab === "Upcoming" ? "Upcoming Events" : "Events"}
              </h2>
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const Icon = eventTypeIcon(event.event_type);
                  const joined = registeredEventIds.has(event.id);
                  const formatted = formatDayAndTime(event.event_date, event.start_time);
                  return (
                    <div
                      key={event.id}
                      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-0 text-left shadow-sm md:flex-row"
                    >
                      <div className="flex h-14 flex-shrink-0 items-center justify-center bg-[#06402B] md:h-auto md:w-20 lg:w-24">
                        <Icon size={28} className="text-white" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 lg:max-w-[70%] lg:pr-4">
                          <div className="mb-2 flex min-w-0 items-center gap-3">
                            <h3 className="min-w-0 break-words text-[15px] font-bold text-gray-800">{event.title}</h3>
                          </div>
                          <span
                            className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${eventTypeColor(event.event_type)}`}
                          >
                            {eventTypeLabel(event.event_type)}
                          </span>
                          <p className="mb-4 break-words text-sm leading-6 text-gray-600">{event.short_description}</p>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500">
                            <div className="flex min-w-0 items-center gap-1.5">
                              {event.is_online ? <Video size={14} /> : <MapPin size={14} />}
                              <span className="break-words">{event.is_online ? "Online" : event.location || "Onsite"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users size={14} />
                              <span>{event.registration_count} joined</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 text-left lg:min-w-[260px] lg:text-right">
                          <span className="text-xs text-gray-500 sm:whitespace-nowrap">{formatted.full}</span>
                          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
                            <Link
                              href={`/communityDashBoard/events/${event.id}`}
                              className="inline-flex h-10 min-w-[112px] items-center justify-center rounded-md bg-[#06402B] px-4 text-xs font-semibold text-white hover:bg-[#053020]"
                            >
                              View Details
                            </Link>
                            {joined ? (
                              <button
                                onClick={() => handleCancel(event.id)}
                                disabled={pendingEventId === event.id}
                                className="inline-flex h-10 min-w-[112px] items-center justify-center rounded-md border border-gray-300 px-4 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                              >
                                {pendingEventId === event.id ? "Cancelling..." : "Cancel"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleJoin(event.id)}
                                disabled={pendingEventId === event.id}
                                className="inline-flex h-10 min-w-[112px] items-center justify-center rounded-md bg-[#06402B] px-4 text-xs font-semibold text-white hover:bg-[#053020] disabled:opacity-60"
                              >
                                {pendingEventId === event.id ? "Joining..." : "Join Event"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-600">
                    No events found for current filters.
                  </div>
                ) : null}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-bold text-[#06402B]">My Joined Events</h2>
              <div className="space-y-4">
                {joinedEvents.map(({ eventId, event, status }) => {
                  const when = formatDayAndTime(event.event_date, event.start_time);
                  const statusClass =
                    status === "confirmed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800";
                  return (
                    <div
                      key={eventId}
                      className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="mb-2 break-words text-[15px] font-bold text-gray-800">{event.title}</h3>
                        <span className={`mb-4 inline-block rounded-xl px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}>
                          {status === "confirmed" ? "Confirmed" : "Registered"}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                          <div className="flex min-w-0 items-center gap-1.5">
                            {event.is_online ? <Video size={14} /> : <MapPin size={14} />}
                            <span className="break-words">{event.is_online ? "Online Event" : event.location || "Onsite Event"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bell size={14} />
                            <span>Registered</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-gray-800">{when.day}</p>
                          <p className="text-xs text-gray-500">{when.time}</p>
                        </div>
                        <Link
                          href={`/communityDashBoard/events/${eventId}`}
                          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#06402B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#053020] sm:w-auto"
                        >
                          <ExternalLink size={14} />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {joinedEvents.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-600">
                    You have not joined any events yet.
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <div className="w-full space-y-5 xl:w-80 xl:space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[15px] font-bold text-[#06402B]">Event Calendar</h3>
              <div className="relative space-y-4 before:absolute before:inset-0 before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent before:translate-x-0">
                {calendarEvents.slice(0, 3).map((event, index) => {
                  const when = formatDayAndTime(event.event_date, event.start_time);
                  const dotClass =
                    index === 0 ? "bg-[#06402B]" : index === 1 ? "bg-purple-500" : "bg-blue-500";
                  return (
                    <Link
                      key={event.id}
                      href={`/communityDashBoard/events/${event.id}`}
                      className="relative flex items-center justify-between"
                    >
                      <div className={`flex w-full items-center rounded-md p-2 ${index === 0 ? "bg-[#f3ecd9]" : "hover:bg-gray-50"}`}>
                        <div className={`mr-3 h-2 w-2 flex-shrink-0 rounded-full ${dotClass}`} />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-800">{when.day}</h4>
                          <p className="break-words text-[11px] text-gray-600">{event.title}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {calendarEvents.length === 0 ? (
                  <p className="relative rounded-md bg-gray-50 p-3 text-xs text-gray-500">
                    No events added to calendar yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[15px] font-bold text-[#06402B]">Event Alerts</h3>
              <div className="space-y-3">
                {eventNotifications.map((notification, index) => {
                  const toneClass =
                    index === 0
                      ? "border-orange-100 bg-orange-50 text-orange-900"
                      : "border-blue-100 bg-blue-50 text-blue-900";
                  const iconClass = index === 0 ? "text-orange-600" : "text-blue-600";
                  return (
                    <Link
                      key={notification.receipt_id}
                      href="/communityDashBoard/notifications"
                      className={`block rounded-lg border p-3 transition hover:shadow-sm ${toneClass}`}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <Bell size={14} className={`shrink-0 ${iconClass}`} />
                          <span className="truncate text-xs font-bold">{notification.title}</span>
                        </span>
                        <span className="shrink-0 text-[10px] opacity-70">{notificationTimeAgo(notification.created_at)}</span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed">{notification.body}</p>
                    </Link>
                  );
                })}

                {eventNotifications.length === 0 ? (
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
                    No event notifications yet.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[15px] font-bold text-[#06402B]">Quick Actions</h3>
              <div className="space-y-1">
                <button className="flex w-full items-center space-x-3 rounded-md p-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <RefreshCw size={16} className="text-[#06402B]" />
                  <span>Refresh Events</span>
                </button>
                <button className="flex w-full items-center space-x-3 rounded-md p-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <Share2 size={16} className="text-[#06402B]" />
                  <span>Invite Friends</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
