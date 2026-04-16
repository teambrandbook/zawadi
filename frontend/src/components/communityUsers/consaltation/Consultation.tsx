"use client";

import { useState } from "react";
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
import FindNutritionist from "./components/FindNutritionist";
import ExpertRecommendations from "./components/ExpertRecommendations";
import ConsultationHistory from "./components/ConsultationHistory";

const statCards = [
  {
    Icon: CalendarClock,
    value: 2,
    label: "Upcoming Sessions",
    trend: "Next session tomorrow",
    trendColor: "text-[#6B7280]",
    iconBgColor: "bg-[#E8F2ED]",
    iconColor: "text-[#0A4833]",
  },
  {
    Icon: ClipboardCheck,
    value: 8,
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

const upcomingSessions = [
  {
    id: "s-1",
    doctor: "Dr. Sarah Wilson",
    specialty: "Certified Nutritionist",
    datetime: "Tomorrow, 2:00 PM",
    mode: "Video Call" as const,
    status: "upcoming" as const,
  },
  {
    id: "s-2",
    doctor: "Dr. Michael Chen",
    specialty: "Sports Nutrition",
    datetime: "Friday, 11:00 AM",
    mode: "Phone Call" as const,
    status: "scheduled" as const,
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
          <UpcomingSessions
            sessions={upcomingSessions}
            onJoin={(id) => setMessage(`Joining session: ${id}`)}
            onReschedule={(id) => setMessage(`Reschedule requested for: ${id}`)}
          />
          <ActiveDietPlan progress={65} onViewPlan={() => setMessage("Opening full diet plan...")} />
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
    </section>
  );
}
