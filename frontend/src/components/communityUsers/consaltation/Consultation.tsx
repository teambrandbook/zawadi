"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ClipboardCheck,
  HeartPulse,
  Plus,
  Star,
  Video,
} from "lucide-react";
import UpcomingSessions from "./components/UpcomingSessions";
import ConsultationHistory from "./components/ConsultationHistory";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

type ApiBooking = {
  id: number;
  consultant_name: string;
  consultant_role: string;
  consultant_image?: string | null;
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
  status: "scheduled" | "pending" | "confirmed" | "completed" | "cancelled" | "needs_reschedule";
  meetingLink?: string;
  image: string;
};

type ApiDietPlan = {
  id: number;
  title: string;
  goal: string;
  description?: string | null;
  daily_calories: number;
  start_date: string;
  end_date?: string | null;
  duration_days: number;
};

type SummaryCard = {
  label: string;
  value: number;
  helper: string;
  Icon: typeof CalendarClock;
  iconBg: string;
  iconColor: string;
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
    needs_reschedule: "needs_reschedule",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NEEDS_RESCHEDULE: "needs_reschedule",
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
    image: booking.consultant_image ? getImageUrl(booking.consultant_image) : "",
  };
}

function avatarFor(session: Pick<Session, "image">, index: number) {
  return session.image || `/recipe/recipe-${(index % 4) + 1}.webp`;
}

function formatDietPlanGoal(goal: string) {
  return goal
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function calculateDietPlanProgress(plan: ApiDietPlan) {
  const startDate = new Date(`${plan.start_date}T00:00:00`);
  const endDate = plan.end_date
    ? new Date(`${plan.end_date}T00:00:00`)
    : new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;

  const duration = endDate.getTime() - startDate.getTime();
  if (duration <= 0) return 100;

  const elapsed = Date.now() - startDate.getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
}

function SummaryCard({ card }: { card: SummaryCard }) {
  const Icon = card.Icon;

  return (
    <article className="rounded-[10px] border border-[#E1E4E8] bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[6px] ${card.iconBg}`}>
          <Icon className={`h-4 w-4 ${card.iconColor}`} strokeWidth={2.4} />
        </div>
        <p className="text-[22px] font-bold leading-none text-[#0A4833]">{card.value}</p>
      </div>
      <p className="mt-5 text-[14px] font-semibold text-[#111827]">{card.label}</p>
      <p className="mt-4 text-[13px] text-[#6B7280]">{card.helper}</p>
    </article>
  );
}

function SessionJoinCard({ session, onJoin }: { session?: Session; onJoin: (id: string) => void }) {
  if (!session) {
    return (
      <aside className="rounded-[10px] border border-[#E1E4E8] bg-white p-5">
        <p className="text-[14px] font-semibold text-[#0A4833]">No upcoming session</p>
        <p className="mt-2 text-[13px] text-[#6B7280]">Your next consultation details will appear here.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[10px] border border-[#E1E4E8] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E5E7EB]">
          <Image src={session.image || "/recipe/recipe-2.webp"} alt={session.doctor} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[14px] font-bold leading-tight text-[#0A4833]">{session.doctor}</p>
          <p className="text-[12px] text-[#4B5563]">{session.specialty}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[6px] bg-[#E9DFC9] p-4">
        <div className="flex justify-between gap-4 text-[12px] text-[#0A4833]">
          <span>Starting in</span>
          <span className="font-medium">25 minutes</span>
        </div>
        <p className="mt-4 text-[16px] font-bold text-[#0A4833]">{session.timeLabel}</p>
      </div>

      {session.meetingLink ? (
        <button
          type="button"
          onClick={() => onJoin(session.id)}
          title={session.meetingLink}
          className="mt-4 w-full truncate rounded-[6px] bg-[#F3F4F6] px-4 py-3 text-center text-[12px] text-[#4B5563] hover:bg-[#E8EAEE]"
        >
          {session.meetingLink}
        </button>
      ) : (
        <div className="mt-4 rounded-[6px] bg-[#F3F4F6] px-4 py-3 text-center text-[12px] text-[#6B7280]">
          Consultant has not shared the meeting link yet
        </div>
      )}

      <button
        type="button"
        onClick={() => onJoin(session.id)}
        disabled={!session.meetingLink}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#07533D] text-[13px] font-semibold text-white hover:bg-[#063F2F] disabled:cursor-not-allowed disabled:bg-[#D1D5DB] disabled:text-[#6B7280]"
      >
        <Video className="h-4 w-4 fill-current" />
        Join Session
      </button>
    </aside>
  );
}

function ActiveDietPlanCard({
  plan,
  loading,
  onBookConsultation,
  onViewPlan,
}: {
  plan?: ApiDietPlan;
  loading: boolean;
  onBookConsultation: () => void;
  onViewPlan: () => void;
}) {
  if (loading) {
    return (
      <aside className="rounded-[12px] border border-[#E1E4E8] bg-white px-6 py-8 text-[14px] text-[#6B7280]">
        Loading diet plan...
      </aside>
    );
  }

  if (!plan) {
    return (
      <aside className="overflow-hidden rounded-[12px] border border-[#E1E4E8] bg-white">
        <div className="border-b border-[#E8EAEE] px-6 py-8">
          <h3 className="text-[22px] font-bold text-[#0A4833]">Active Diet Plan</h3>
        </div>
        <div className="px-6 py-8">
          <h4 className="text-[18px] font-bold text-[#111827]">No active diet plan yet</h4>
          <p className="mt-4 text-[16px] leading-6 text-[#4B5563]">
            Book a consultation so your nutritionist can create a personalised diet plan for you.
          </p>
          <button
            type="button"
            onClick={onBookConsultation}
            className="mt-7 inline-flex h-[50px] w-full items-center justify-center rounded-[7px] bg-[#07533D] text-[16px] font-semibold text-white hover:bg-[#063F2F]"
          >
            Book Consultation
          </button>
        </div>
      </aside>
    );
  }

  const progress = calculateDietPlanProgress(plan);

  return (
    <aside className="overflow-hidden rounded-[12px] border border-[#E1E4E8] bg-white">
      <div className="border-b border-[#E8EAEE] px-6 py-8">
        <h3 className="text-[22px] font-bold text-[#0A4833]">Active Diet Plan</h3>
      </div>

      <div className="px-6 py-8">
        <h4 className="text-[18px] font-bold text-[#111827]">{plan.title}</h4>
        <p className="mt-4 text-[16px] leading-6 text-[#4B5563]">
          {plan.description || "Your nutritionist has assigned this personalised diet plan."}
        </p>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between text-[16px]">
            <span className="text-[#6B7280]">Progress</span>
            <span className="text-[#A88751]">{progress}%</span>
          </div>
          <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div className="h-full rounded-full bg-[#A88751]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-5 space-y-4 text-[16px]">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Goal</span>
            <span className="font-medium text-[#111827]">{formatDietPlanGoal(plan.goal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Daily Calories</span>
            <span className="font-medium text-[#111827]">
              {plan.daily_calories ? `${plan.daily_calories.toLocaleString()} kcal` : "Not added"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewPlan}
          className="mt-7 inline-flex h-[50px] w-full items-center justify-center rounded-[7px] bg-[#A88751] text-[16px] font-semibold text-white hover:bg-[#8E7346]"
        >
          View Full Plan
        </button>
      </div>
    </aside>
  );
}

export default function Consultation() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [dietPlans, setDietPlans] = useState<ApiDietPlan[]>([]);
  const [loadingDietPlans, setLoadingDietPlans] = useState(true);
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

  useEffect(() => {
    api
      .get<ApiDietPlan[] | { results: ApiDietPlan[] }>("/consultant/diet-plans/")
      .then(({ data }) => setDietPlans(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setDietPlans([]))
      .finally(() => setLoadingDietPlans(false));
  }, []);

  const upcomingSessions = useMemo(
    () => sessions.filter((session) => session.status !== "completed" && session.status !== "cancelled"),
    [sessions]
  );
  const completedSessions = useMemo(() => sessions.filter((session) => session.status === "completed"), [sessions]);
  const nextSession = upcomingSessions[0];
  const activeDietPlan = dietPlans[0];
  const summaryCards: SummaryCard[] = [
    {
      Icon: CalendarClock,
      value: upcomingSessions.length,
      label: "Upcoming Sessions",
      helper: nextSession ? `Next session ${nextSession.dateLabel.toLowerCase()}` : "No upcoming sessions",
      iconBg: "bg-[#E7F0EC]",
      iconColor: "text-[#0A4833]",
    },
    {
      Icon: ClipboardCheck,
      value: completedSessions.length,
      label: "Completed Sessions",
      helper: "This month",
      iconBg: "bg-[#F4F0EA]",
      iconColor: "text-[#A88751]",
    },
    {
      Icon: HeartPulse,
      value: dietPlans.length,
      label: "Active Diet Plans",
      helper: activeDietPlan?.title || "No active diet plan",
      iconBg: "bg-[#E7F0EC]",
      iconColor: "text-[#0A4833]",
    },
    {
      Icon: Star,
      value: 5,
      label: "Expert Tips",
      helper: "New recommendations",
      iconBg: "bg-[#F4F0EA]",
      iconColor: "text-[#A88751]",
    },
  ];
  const historyRows = (completedSessions.length > 0 ? completedSessions : sessions.slice(0, 2)).map((session, index) => ({
    id: session.id,
    nutritionist: session.doctor,
    profileImage: avatarFor(session, index),
    date: session.dateLabel,
    type: session.mode,
    status: session.status === "completed" ? "Completed" : "Scheduled",
  }));

  function joinSession(id: string) {
    const session = sessions.find((item) => item.id === id);
    if (session?.meetingLink) {
      window.open(session.meetingLink, "_blank", "noopener,noreferrer");
      return;
    }
    setMessage("Consultant has not shared the meeting link yet.");
  }

  return (
    <section className="w-full bg-white px-3 py-4 lg:px-4">
      <div className="mx-auto max-w-[1220px] space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[#0A4833]">Consultation</h1>
            <p className="mt-1 text-[14px] text-[#4B5563]">
              Connect with nutrition experts and manage your personalized wellness guidance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/communityDashBoard/addconsaltation")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#07533D] px-6 text-[14px] font-semibold text-white hover:bg-[#063F2F]"
          >
            <Plus className="h-4 w-4" />
            Book Consultation
          </button>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} card={card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_374px]">
          {loadingSessions ? (
            <div className="rounded-[10px] border border-[#E1E4E8] bg-white p-6 text-sm text-[#6B7280]">
              Loading sessions...
            </div>
          ) : (
            <UpcomingSessions
              sessions={upcomingSessions}
              onJoin={joinSession}
              onReschedule={(id) => router.push(`/communityDashBoard/addconsaltation?rescheduleBookingId=${id}`)}
            />
          )}
          <div className="space-y-5">
            <SessionJoinCard session={nextSession} onJoin={joinSession} />
            <ActiveDietPlanCard
              plan={activeDietPlan}
              loading={loadingDietPlans}
              onBookConsultation={() => router.push("/communityDashBoard/addconsaltation")}
              onViewPlan={() => router.push("/communityDashBoard/consultation/diet-plan")}
            />
          </div>
        </div>

        <ConsultationHistory rows={historyRows} />

        {message && (
          <div className="rounded-lg border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-2 text-sm text-[#0A4833]">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
