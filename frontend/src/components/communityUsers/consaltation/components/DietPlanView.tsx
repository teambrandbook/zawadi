"use client";

import {
  CalendarDays,
  Check,
  Circle,
  Download,
  FileText,
  Flag,
  Target,
  Utensils,
} from "lucide-react";
import Image from "next/image";

export type DietMeal = {
  id: string;
  type: string;
  time: string;
  title: string;
  description: string;
  macros: string;
  completed: boolean;
  colorClass: string;
};

export type DailyTarget = {
  label: string;
  value: string;
  progress: number;
  colorClass: string;
};

export type WeeklySummary = {
  label: string;
  value: string;
  valueClassName?: string;
};

export type NutritionDoctorNote = {
  doctor: string;
  image: string;
  message: string;
};

export type NutritionGuidance = {
  doctorNote: NutritionDoctorNote;
  foodsToEmphasize: string[];
  lifestyleTips: string[];
};

type Props = {
  todaysMeals: DietMeal[];
  dailyTargets: DailyTarget[];
  weeklySummary: WeeklySummary[];
  nutritionGuidance: NutritionGuidance;
  onBookFollowUp: () => void;
  onDownloadPlan: () => void;
  onViewNotes: () => void;
  onMarkComplete: () => void;
  onTrackProgress: () => void;
};

const stats = [
  { label: "Days Completed", value: "14" },
  { label: "Days Remaining", value: "42" },
  { label: "Adherence Rate", value: "89%" },
  { label: "kg Progress", value: "-3.2" },
];

const benefits = ["Rich fiber and protein", "Supports heart health", "Helps regulate blood sugar", "Gluten-free alternative"];

export default function DietPlanView({
  todaysMeals,
  dailyTargets,
  weeklySummary,
  nutritionGuidance,
  onBookFollowUp,
  onDownloadPlan,
  onViewNotes,
  onMarkComplete,
  onTrackProgress,
}: Props) {
  return (
    <section className="w-full bg-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="text-2xl font-bold text-[#0A4833]">Diet Plan</h1>

        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-5">
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
              <div className="rounded-lg bg-[#0A4833] px-4 py-3 text-white">
                <p className="text-xs font-semibold">Current Goal: Weight Management</p>
                <p className="mt-1 text-[11px] text-white/85">
                  Balanced nutrition with buckwheat for sustainable weight loss
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0A4833]">Buckwheat Wellness Plan</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-[11px] text-[#6B7280]">
                    <span>Dr. Sarah Johnson</span>
                    <span>8 weeks duration</span>
                    <span className="inline-flex items-center gap-1 text-[#16A34A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onDownloadPlan}
                    className="inline-flex h-8 items-center gap-2 rounded-md bg-[#0A4833] px-3 text-[11px] font-medium text-white hover:bg-[#083B2A]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Plan
                  </button>
                  <button
                    onClick={onViewNotes}
                    className="inline-flex h-8 items-center gap-2 rounded-md border border-[#D1D5DB] bg-white px-3 text-[11px] font-medium text-[#0A4833] hover:bg-[#F9FAFB]"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View Notes
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="rounded-md bg-[#E9DFCC] px-3 py-4 text-center">
                    <p className={`text-xl font-semibold ${index === 2 ? "text-[#0A4833]" : "text-[#A88751]"}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#0A4833]">{"Today's Meals"}</h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7280]">
                  <CalendarDays className="h-3 w-3 text-[#A88751]" />
                  Monday, March 25, 2024
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {todaysMeals.map((meal) => (
                  <article key={meal.id} className="rounded-md border border-[#E8E8E8] bg-white p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A4833]">
                            <span className={`h-2 w-2 rounded-full ${meal.colorClass}`} />
                            {meal.type}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">{meal.time}</span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-[#111827]">{meal.title}</h3>
                        <p className="mt-1 text-xs text-[#4B5563]">{meal.description}</p>
                        <p className="mt-1 text-[11px] text-[#6B7280]">{meal.macros}</p>
                      </div>
                      <span
                        className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          meal.completed ? "border-[#22C55E] bg-[#22C55E] text-white" : "border-[#D1D5DB] text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
              <h2 className="text-lg font-semibold text-[#0A4833]">Nutrition Guidance</h2>

              <div className="mt-4 rounded-md bg-[#E9DFCC] p-4">
                <div className="flex items-start gap-3">
                  <Image
                    src={nutritionGuidance.doctorNote.image}
                    alt={nutritionGuidance.doctorNote.doctor}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0A4833]">{nutritionGuidance.doctorNote.doctor}</p>
                    <p className="mt-1 text-xs leading-5 text-[#374151]">{nutritionGuidance.doctorNote.message}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-[#DFDFDF] bg-white p-4">
                  <h3 className="text-sm font-semibold text-[#0A4833]">Foods to Emphasize</h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#374151]">
                    {nutritionGuidance.foodsToEmphasize.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-[#DFDFDF] bg-white p-4">
                  <h3 className="text-sm font-semibold text-[#0A4833]">Lifestyle Tips</h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#374151]">
                    {nutritionGuidance.lifestyleTips.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={onBookFollowUp}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-[#0A4833] text-sm font-medium text-white hover:bg-[#083B2A]"
              >
                <CalendarDays className="h-4 w-4" />
                Book Follow-up
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-[#A88751] text-sm font-medium text-white hover:bg-[#8E7346]">
                <Utensils className="h-4 w-4" />
                Order Recipes
              </button>
              <button
                onClick={onMarkComplete}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-[#0A4833] bg-white text-sm font-medium text-[#0A4833] hover:bg-[#F8F9FA]"
              >
                <Circle className="h-4 w-4" />
                Mark Complete
              </button>
              <button
                onClick={onTrackProgress}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-[#A88751] bg-white text-sm font-medium text-[#A88751] hover:bg-[#F8F3E9]"
              >
                <Flag className="h-4 w-4" />
                Track Progress
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#0A4833]">Daily Targets</h2>
              <div className="mt-4 space-y-3">
                {dailyTargets.map((target) => (
                  <div key={target.label}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7280]">{target.label}</span>
                      <span className="font-medium text-[#111827]">{target.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#E5E7EB]">
                      <div className={`h-1.5 rounded-full ${target.colorClass}`} style={{ width: `${target.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-[#0A4833] p-4 text-white">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4" />
                Buckwheat Benefits
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-white/90">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <Check className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#0A4833]">This Week</h2>
              <div className="mt-4 space-y-3 text-xs">
                {weeklySummary.map((item) => (
                  <p key={item.label} className="flex items-center justify-between gap-3">
                    <span className="text-[#6B7280]">{item.label}</span>
                    <span className={item.valueClassName ?? "font-medium text-[#0A4833]"}>{item.value}</span>
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-[#E9DFCC] p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[#A88751]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#0A4833]">Upcoming</h2>
                  <p className="mt-1 text-xs text-[#6B7280]">Mid-morning smoothie in 45 minutes</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
