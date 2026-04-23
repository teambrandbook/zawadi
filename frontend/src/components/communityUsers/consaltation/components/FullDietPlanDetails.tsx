"use client";

import Image from "next/image";
import { Check, Leaf, ShieldCheck, Target, Waves, XCircle } from "lucide-react";
import { fullDietPlanDetails } from "./fullDietPlanData";

const noteCards = [
  {
    title: "Foods to Avoid",
    icon: XCircle,
    items: fullDietPlanDetails.lifestyle.foodsToAvoid,
    tone: "bg-[#FFF7ED] text-[#9A3412]",
  },
  {
    title: "Exercise Recommendations",
    icon: Target,
    items: fullDietPlanDetails.lifestyle.exerciseRecommendations,
    tone: "bg-[#ECFDF3] text-[#166534]",
  },
  {
    title: "Sleep & Hydration",
    icon: Waves,
    items: fullDietPlanDetails.lifestyle.sleepHydration,
    tone: "bg-[#EFF6FF] text-[#1D4ED8]",
  },
];

export default function FullDietPlanDetails() {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#E3D1B5]">
              <Image
                src={fullDietPlanDetails.client.avatar}
                alt={fullDietPlanDetails.client.name}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A88751]">Assigned Client</p>
              <h2 className="mt-1 text-xl font-semibold text-[#0A4833]">{fullDietPlanDetails.client.name}</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Age {fullDietPlanDetails.client.age} • {fullDietPlanDetails.client.goal} Goal
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-[#0A4833] px-4 py-3 text-white">
            <p className="text-sm font-semibold">{fullDietPlanDetails.plan.title}</p>
            <p className="mt-1 text-xs text-white/85">Consultant: {fullDietPlanDetails.plan.consultant}</p>
            <p className="mt-1 text-xs text-white/85">Status: {fullDietPlanDetails.plan.status}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Diet Preference</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{fullDietPlanDetails.client.dietPreference}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Allergies</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{fullDietPlanDetails.client.allergies}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Daily Calories</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{fullDietPlanDetails.plan.dailyCalories}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Difficulty</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{fullDietPlanDetails.plan.difficulty}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0A4833]">Plan Information</h3>
          <span className="rounded-full bg-[#ECF8F2] px-3 py-1 text-xs font-medium text-[#0A4833]">
            {fullDietPlanDetails.plan.duration}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Goal</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{fullDietPlanDetails.plan.goal}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Start Date</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{fullDietPlanDetails.plan.startDate}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Duration</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{fullDietPlanDetails.plan.duration}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Status</p>
            <p className="mt-1 text-sm font-semibold text-[#16A34A]">{fullDietPlanDetails.plan.status}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <h3 className="text-lg font-semibold text-[#0A4833]">Daily Meal Structure</h3>

        <div className="mt-4 space-y-3">
          {fullDietPlanDetails.meals.map((meal) => (
            <article key={meal.id} className="rounded-lg border border-[#E5E7EB] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                      <span className={`h-2.5 w-2.5 rounded-full ${meal.dotClassName}`} />
                      {meal.label}
                    </span>
                    <span className="text-xs text-[#6B7280]">{meal.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#111827]">{meal.item}</p>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    {meal.quantity} • {meal.calories}
                  </p>
                  <p className="mt-2 text-xs text-[#4B5563]">{meal.note}</p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F3E9] px-3 py-1 text-xs font-medium text-[#A88751]">
                  <Check className="h-3.5 w-3.5" />
                  Planned
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#0A5A43] bg-[#0A5A43] p-5 text-white">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Buckwheat Wellness Integration</h3>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Recommended Products</p>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {fullDietPlanDetails.buckwheatIntegration.products.map((product) => (
                <li key={product} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Daily Serving</p>
              <p className="mt-2 text-sm text-white">{fullDietPlanDetails.buckwheatIntegration.serving}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Benefits Note</p>
              <p className="mt-2 text-sm leading-6 text-white/90">{fullDietPlanDetails.buckwheatIntegration.benefitsNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#0A4833]" />
          <h3 className="text-lg font-semibold text-[#0A4833]">Lifestyle & Guidance Notes</h3>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {noteCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="rounded-lg border border-[#E5E7EB] p-4">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${card.tone}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {card.title}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-[#374151]">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A88751]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg bg-[#F8F3E9] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#A88751]">Personalized Consultant Advice</p>
          <p className="mt-2 text-sm leading-6 text-[#374151]">{fullDietPlanDetails.lifestyle.personalizedAdvice}</p>
        </div>
      </section>
    </div>
  );
}
