"use client";

import EventsOverview from "./components/EventsOverview";
import EventsFiltersAndActions from "./components/EventsFiltersAndActions";
import EventsTable from "./components/EventsTable";
import type { EventRow, EventStat } from "./types";

const eventStats: EventStat[] = [
  { id: "total", label: "+12%", value: "248", subText: "Total Events", icon: "calendar" },
  { id: "upcoming", label: "24", value: "36", subText: "Upcoming Events", icon: "clock" },
  { id: "ongoing", label: "Live", value: "8", subText: "Ongoing Events", icon: "play" },
  { id: "registrations", label: "89%", value: "3,842", subText: "Total Registrations", icon: "users" },
  { id: "completed", value: "184", subText: "Completed Events", icon: "check" },
  { id: "draft", value: "12", subText: "Draft Events", icon: "draft" },
  { id: "cancelled", value: "8", subText: "Cancelled Events", icon: "cancel" },
  { id: "attendance", value: "87%", subText: "Avg Attendance Rate", icon: "chart" },
];

// Backend-ready array: replace this with API response later.
const eventsTableRows: EventRow[] = [
  {
    id: "event-1",
    title: "Buckwheat Nutrition Workshop",
    subtitle: "Learn about buckwheat benefits",
    coverImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=160&q=80&auto=format&fit=crop",
    category: "Nutrition Session",
    hostName: "Dr. Emily Chen",
    hostRole: "Nutritionist",
    hostAvatar: "https://i.pravatar.cc/80?img=5",
    dateText: "Jan 28, 2025",
    timeText: "2:00 PM - 4:00 PM",
    type: "Online",
    registrations: "142/150",
    status: "Published",
    attendeeAvatars: [
      "https://i.pravatar.cc/60?img=32",
      "https://i.pravatar.cc/60?img=24",
      "https://i.pravatar.cc/60?img=11",
    ],
  },
  {
    id: "event-2",
    title: "Wellness Community Gathering",
    subtitle: "Monthly wellness meetup",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&q=80&auto=format&fit=crop",
    category: "Community Meetup",
    hostName: "Marcus Lee",
    hostRole: "Community Lead",
    hostAvatar: "https://i.pravatar.cc/80?img=15",
    dateText: "Jan 28, 2025",
    timeText: "2:00 PM - 4:00 PM",
    type: "Offline",
    registrations: "142/150",
    status: "Published",
    attendeeAvatars: [
      "https://i.pravatar.cc/60?img=27",
      "https://i.pravatar.cc/60?img=36",
      "https://i.pravatar.cc/60?img=21",
    ],
  },
];

export default function EventsManagementPage() {
  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <EventsOverview stats={eventStats} />
        <EventsFiltersAndActions />
        <EventsTable rows={eventsTableRows} />
      </div>
    </section>
  );
}

