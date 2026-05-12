"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import EventReviewPage from "@/components/communityUsers/events/details/EventReviewPage";
import type { EventReviewData } from "@/components/communityUsers/events/details/types";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type ApiEventDetail = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  event_type: string;
  status: string;
  cover_image?: string | null;
  start_datetime: string;
  end_datetime: string;
  is_online: boolean;
  location: string;
  meeting_link: string;
  registration_count: number;
};

type RegistrationItem = {
  event: number;
  status: string;
};

function toUtcIcsDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildIcsDataUri(event: ApiEventDetail): string {
  const start = toUtcIcsDateTime(event.start_datetime);
  const end = toUtcIcsDateTime(event.end_datetime);
  const now = toUtcIcsDateTime(new Date().toISOString());
  const location = event.is_online ? event.meeting_link || "Online" : event.location || "TBD";
  const description = (event.full_description || event.short_description || "")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,");
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZEWADI//Events//EN",
    "BEGIN:VEVENT",
    `UID:zewadi-event-${event.id}@zewadi.local`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

function toImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "/events/event-1.webp";
  return getImageUrl(imagePath);
}

function toCategory(type: string): string {
  const map: Record<string, string> = {
    webinar: "Webinar",
    workshop: "Workshop",
    seminar: "Seminar",
    community: "Community Meetup",
    other: "Wellness Session",
  };
  return map[type] || "Wellness Session";
}

function toStatusLabel(status: string): string {
  if (status === "published") return "Upcoming";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Upcoming";
}

function toDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toTimeLabel(start: string, end: string): string {
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return "-";
  const startText = from.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const endText = to.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${startText} - ${endText}`;
}

function toDuration(start: string, end: string): string {
  const from = new Date(start).getTime();
  const to = new Date(end).getTime();
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) return "-";
  const minutes = Math.round((to - from) / (1000 * 60));
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes % 60 === 0) return `${minutes / 60} hours`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function toCountdown(start: string): string {
  const startsAt = new Date(start).getTime();
  if (Number.isNaN(startsAt)) return "Schedule will be shared soon";
  const now = Date.now();
  const diff = startsAt - now;
  if (diff <= 0) return "Event is live or already started";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `Event starts in ${days} day${days > 1 ? "s" : ""}`;
  const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
  return `Event starts in ${hours} hour${hours > 1 ? "s" : ""}`;
}

function toEventViewModel(event: ApiEventDetail, isRegistered: boolean): EventReviewData {
  const duration = toDuration(event.start_datetime, event.end_datetime);
  const calendarHref = buildIcsDataUri(event);
  return {
    eventId: event.id,
    slug: event.slug,
    isRegistered,
    category: toCategory(event.event_type),
    status: toStatusLabel(event.status),
    registrationLabel: isRegistered ? "You are Registered" : "You are not registered yet",
    countdown: toCountdown(event.start_datetime),
    title: event.title,
    summary: event.short_description,
    date: toDateLabel(event.start_datetime),
    time: toTimeLabel(event.start_datetime, event.end_datetime),
    mode: event.is_online ? "Online Event" : "In-person Event",
    heroImage: toImageUrl(event.cover_image),
    about: [event.full_description || event.short_description],
    agenda: [
      {
        title: event.title,
        duration,
        description: event.short_description,
      },
    ],
    host: {
      name: "ZEWADI Team",
      role: "Community Wellness Host",
      bio: "This session is hosted by our wellness team and invited experts.",
      image: "/community/community-2.webp",
    },
    joinInfo: {
      title: event.is_online ? "Online Session" : "In-person Session",
      description: event.is_online
        ? "Use the event link shared before start time to join the session."
        : `Venue: ${event.location || "Location will be shared soon"}`,
      platform: event.is_online ? "Online Meeting" : "Onsite Venue",
      duration,
      recording: event.is_online ? "Available if enabled by host" : "Not applicable",
    },
    details: {
      attendees: `${event.registration_count} joined`,
      duration,
      language: "English",
      level: "All Levels",
    },
    sidebarActions: isRegistered
      ? [
          { label: "Add to Calendar", href: calendarHref, variant: "primary" },
          { label: "Share Event", variant: "outline" },
          { label: "Cancel Registration", variant: "danger" },
        ]
      : [
          { label: "Join Event", variant: "primary" },
          { label: "Add to Calendar", href: calendarHref, variant: "gold" },
          { label: "Share Event", variant: "outline" },
        ],
    communityCard: {
      title: "Join Our Community",
      description: "Connect with fellow members and continue the discussion after the event.",
      ctaLabel: "Join Discussion",
      ctaHref: "/communityDashBoard",
    },
  };
}

export default function CommunityEventReviewRoute() {
  const params = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<ApiEventDetail | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const eventId = Number(params.eventId);
    if (Number.isNaN(eventId)) {
      setError("Invalid event id.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadEvent() {
      try {
        const [eventResponse, registrationsResponse] = await Promise.allSettled([
          api.get<ApiEventDetail>(`/events/${eventId}/`),
          api.get<RegistrationItem[]>("/events/my-registrations/"),
        ]);

        if (!isMounted) return;

        if (eventResponse.status === "fulfilled") {
          setEvent(eventResponse.value.data);
        } else {
          setError("Unable to load event details.");
          return;
        }

        if (registrationsResponse.status === "fulfilled") {
          const active = registrationsResponse.value.data.some(
            (item) => item.event === eventId && item.status !== "cancelled"
          );
          setIsRegistered(active);
        } else {
          setIsRegistered(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadEvent();
    return () => {
      isMounted = false;
    };
  }, [params.eventId]);

  const viewModel = useMemo(() => {
    if (!event) return null;
    return toEventViewModel(event, isRegistered);
  }, [event, isRegistered]);

  if (isLoading) {
    return (
      <section className="w-full bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-[1120px] rounded-xl border border-[#DFDFDF] bg-white p-6 text-sm text-[#6B7280]">
          Loading event details...
        </div>
      </section>
    );
  }

  if (error || !viewModel) {
    return (
      <section className="w-full bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-[1120px] rounded-xl border border-[#F3D7D7] bg-[#FFF7F7] p-6 text-sm text-[#9B1C1C]">
          {error || "Event not found."}
        </div>
      </section>
    );
  }

  return <EventReviewPage event={viewModel} />;
}
