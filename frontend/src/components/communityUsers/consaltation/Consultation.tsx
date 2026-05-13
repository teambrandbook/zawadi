"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ClipboardCheck,
  HeartPulse,
  Lightbulb,
  Plus,
} from "lucide-react";
import StatCard from "../commen/StatCard";
import UpcomingSessions from "./components/UpcomingSessions";
import ActiveDietPlan from "./components/ActiveDietPlan";
import DietPlanModal from "./components/DietPlanModal";
import FindNutritionist from "./components/FindNutritionist";
import ExpertRecommendations from "./components/ExpertRecommendations";
import ConsultationHistory from "./components/ConsultationHistory";
import api from "@/services/api";
import { toast } from "sonner";

type ApiBooking = {
  id: number;
  consultant_name: string;
  consultant_role: string;
  session_type: string;
  booked_date: string;
  booked_slot: string;
  status: string;
  meeting_link?: string;
  created_at: string;
};

type Session = {
  id: string;
  doctor: string;
  specialty: string;
  dateLabel: string;
  timeLabel: string;
  mode: "Video Call" | "Phone Call";
  status: "scheduled" | "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink?: string;
};

function formatSessionDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === todayStart.getTime()) return "Today";
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function mapBookingToSession(booking: ApiBooking): Session {
  const modeMap: Record<string, "Video Call" | "Phone Call"> = {
    video: "Video Call",
    audio: "Phone Call",
    chat: "Phone Call",
    VIDEO: "Video Call",
    AUDIO: "Phone Call",
    CHAT: "Phone Call",
  };
  const statusMap: Record<string, Session["status"]> = {
    pending: "pending",
    confirmed: "confirmed",
    completed: "completed",
    cancelled: "cancelled",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  return {
    id: String(booking.id),
    doctor: booking.consultant_name || "Consultant",
    specialty: booking.consultant_role || "Consultant",
    dateLabel: formatSessionDate(booking.booked_date),
    timeLabel: booking.booked_slot,
    mode: modeMap[booking.session_type] ?? "Video Call",
    status: statusMap[booking.status] ?? "scheduled",
    meetingLink: booking.meeting_link || "",
  };
}

const statCards = [
  {
    Icon: CalendarClock,
    value: 0,
    label: "Upcoming Sessions",
    trend: "Next session soon",
    trendColor: "text-[#6B7280]",
    iconBgColor: "bg-[#E8F2ED]",
    iconColor: "text-[#0A4833]",
  },
  {
    Icon: ClipboardCheck,
    value: 0,
    label: "Completed Sessions",
    trend: "This month",
    trendColor: "text-[#6B7280]",
    iconBgColor: "bg-[#F8F3E9]",
    iconColor: "text-[#A88751]",
  },
  {
    Icon: HeartPulse,
    value: 1,
    label: "Active Diet Plans",
    trend: "Buckwheat wellness plan",
    trendColor: "text-[#6B7280]",
    iconBgColor: "bg-[#E8F2ED]",
    iconColor: "text-[#0A4833]",
  },
  {
    Icon: Lightbulb,
    value: 5,
    label: "Expert Tips",
    trend: "New recommendations",
    trendColor: "text-[#6B7280]",
    iconBgColor: "bg-[#F8F3E9]",
    iconColor: "text-[#A88751]",
  },
];

const nutritionists = [
  {
    id: "n-1",
    name: "Dr. Emma Rodriguez",
    role: "Holistic Nutrition Expert",
    blurb: "Specializes in buckwheat-based diets and natural wellness approaches.",
    rating: 5.0,
    reviews: 124,
  },
  {
    id: "n-2",
    name: "Dr. James Thompson",
    role: "Weight Management Specialist",
    blurb: "Expert in sustainable weight-loss and metabolic health optimization.",
    rating: 4.8,
    reviews: 98,
  },
];

const recommendations = [
  {
    id: "r-1",
    text: "Start your day with buckwheat porridge for sustained energy and better blood sugar control.",
    author: "Dr. Sarah Wilson",
  },
  {
    id: "r-2",
    text: "Combine buckwheat with leafy greens for maximum nutrient absorption.",
    author: "Dr. Emma Rodriguez",
  },
  {
    id: "r-3",
    text: "Remember to stay hydrated and practice mindful eating during your wellness journey.",
    author: "Dr. Michael Chen",
  },
];

const historyRows = [
  {
    id: "h-1",
    nutritionist: "Dr. Sarah Wilson",
    profileImage: "/recipe/recipe-2.webp",
    date: "Dec 15, 2024",
    type: "Video Call",
    status: "Completed",
  },
  {
    id: "h-2",
    nutritionist: "Dr. Emma Rodriguez",
    profileImage: "/recipe/recipe-3.webp",
    date: "Dec 10, 2024",
    type: "Phone Call",
    status: "Completed",
  },
];

export default function Consultation() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isDietPlanOpen, setIsDietPlanOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const hasLoadedSessionsRef = useRef(false);
  const knownMeetingLinksRef = useRef<Record<string, string>>({});

  const fetchSessions = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent) setLoadingSessions(true);

    try {
      const { data } = await api.get<ApiBooking[]>("/consultant/community/create-booking/");
      const nextSessions = Array.isArray(data) ? data.map(mapBookingToSession) : [];

      const newLinkedSession = nextSessions.find((session) => {
        const previousLink = knownMeetingLinksRef.current[session.id];
        return session.meetingLink && session.meetingLink !== previousLink;
      });

      const nextKnownLinks = nextSessions.reduce<Record<string, string>>((acc, session) => {
        if (session.meetingLink) acc[session.id] = session.meetingLink;
        return acc;
      }, {});

      setSessions(nextSessions);

      if (hasLoadedSessionsRef.current && newLinkedSession) {
        toast.success("Session link is ready.");
        setMessage(`Join link shared for ${newLinkedSession.doctor}.`);
      }

      knownMeetingLinksRef.current = nextKnownLinks;
      hasLoadedSessionsRef.current = true;
    } catch {
      if (!silent) setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        fetchSessions({ silent: true });
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchSessions({ silent: true });
      }
    }, 10000);

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [fetchSessions]);

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4833]">Consultation</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Connect with nutrition experts and manage your personalized wellness guidance.
            </p>
          </div>
          <button
            onClick={() => router.push("/communityDashBorde/addconsaltation")}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0A4833] px-4 text-xs font-medium text-white hover:bg-[#083B2A]"
          >
            <Plus className="h-3.5 w-3.5" />
            Book Consultation
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          {loadingSessions ? (
            <div className="rounded-xl border border-[#DFDFDF] bg-white p-6 text-sm text-[#6B7280]">
              Loading sessions...
            </div>
          ) : (
            <UpcomingSessions
              sessions={sessions}
              onJoin={(id) => {
                const session = sessions.find((item) => item.id === id);
                if (session?.meetingLink) {
                  window.open(session.meetingLink, "_blank", "noopener,noreferrer");
                  return;
                }
                setMessage(`Joining session: ${id}`);
              }}
              onReschedule={(id) => setMessage(`Reschedule requested for: ${id}`)}
            />
          )}
          <ActiveDietPlan progress={65} onViewPlan={() => setIsDietPlanOpen(true)} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <FindNutritionist nutritionists={nutritionists} onBook={(id) => setMessage(`Booking nutritionist: ${id}`)} />
          <ExpertRecommendations items={recommendations} />
        </div>

        <ConsultationHistory rows={historyRows} />

        {message && (
          <div className="rounded-lg border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-2 text-sm text-[#0A4833]">
            {message}
          </div>
        )}
      </div>

      <DietPlanModal open={isDietPlanOpen} onClose={() => setIsDietPlanOpen(false)} />
    </section>
  );
}
