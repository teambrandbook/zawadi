"use client";

import { Check, Leaf, ShieldCheck, Target, Waves, XCircle } from "lucide-react";

type MealItem = { food_name: string; quantity: string; calories: number };
type Meal = {
  meal_type: string;
  title: string;
  time: string;
  calories: number;
  notes: string;
  sort_order: number;
  items: MealItem[];
};

export type DietPlanProp = {
  id: number;
  title: string;
  goal: string;
  status: string;
  description: string;
  instructions: string;
  foods_to_avoid: string;
  recommended_foods: string;
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  water_intake_liters: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  consultant_name: string;
  client_name?: string;
  meals: Meal[];
};

const MEAL_DOT: Record<string, string> = {
  BREAKFAST:   "bg-[#22C55E]",
  MID_MORNING: "bg-[#EAB308]",
  SNACK:       "bg-[#EAB308]",
  LUNCH:       "bg-[#F97316]",
  EVENING:     "bg-[#A855F7]",
  DINNER:      "bg-[#EF4444]",
};

function parseLines(text: string): string[] {
  return (text || "").split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function capitalize(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(raw: string): string {
  if (!raw) return "";
  const [hStr, mStr] = raw.split(":");
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${mStr ?? "00"} ${suffix}`;
}

export default function FullDietPlanDetails({ plan }: { plan: DietPlanProp }) {
  const foodsToAvoid = parseLines(plan.foods_to_avoid);
  const recommendedFoods = parseLines(plan.recommended_foods);

  const noteCards = [
    {
      title: "Foods to Avoid",
      icon: XCircle,
      items: foodsToAvoid.length ? foodsToAvoid : ["No restrictions specified"],
      tone: "bg-[#FFF7ED] text-[#9A3412]",
    },
    {
      title: "Recommended Foods",
      icon: Target,
      items: recommendedFoods.length ? recommendedFoods : ["Follow your plan meals"],
      tone: "bg-[#ECFDF3] text-[#166534]",
    },
    {
      title: "Hydration Goal",
      icon: Waves,
      items: [
        plan.water_intake_liters ? `Drink ${plan.water_intake_liters}L of water daily` : "Stay well hydrated",
        "Avoid sugary drinks",
        "Herbal teas are encouraged",
      ],
      tone: "bg-[#EFF6FF] text-[#1D4ED8]",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Client & Plan header */}
      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A88751]">Assigned Client</p>
            <h2 className="mt-1 text-xl font-semibold text-[#0A4833]">{plan.client_name}</h2>
            <p className="mt-1 text-sm text-[#6B7280]">{plan.goal}</p>
          </div>
          <div className="rounded-lg bg-[#0A4833] px-4 py-3 text-white">
            <p className="text-sm font-semibold">{plan.title}</p>
            <p className="mt-1 text-xs text-white/85">Consultant: {plan.consultant_name}</p>
            <p className="mt-1 text-xs text-white/85">Status: {capitalize(plan.status)}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Daily Calories</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{plan.daily_calories ? `${plan.daily_calories} kcal` : "—"}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Protein</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{plan.protein_grams ? `${plan.protein_grams}g` : "—"}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Carbs</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{plan.carbs_grams ? `${plan.carbs_grams}g` : "—"}</p>
          </div>
          <div className="rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs text-[#6B7280]">Fats</p>
            <p className="mt-1 text-sm font-semibold text-[#0A4833]">{plan.fats_grams ? `${plan.fats_grams}g` : "—"}</p>
          </div>
        </div>
      </section>

      {/* Plan Information */}
      <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0A4833]">Plan Information</h3>
          {plan.duration_days ? (
            <span className="rounded-full bg-[#ECF8F2] px-3 py-1 text-xs font-medium text-[#0A4833]">
              {plan.duration_days} days
            </span>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Goal</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{plan.goal || "—"}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Start Date</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{plan.start_date || "—"}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">End Date</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{plan.end_date || "—"}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">Status</p>
            <p className="mt-1 text-sm font-semibold text-[#16A34A]">{capitalize(plan.status)}</p>
          </div>
        </div>
        {plan.description && (
          <p className="mt-4 text-sm leading-6 text-[#4B5563]">{plan.description}</p>
        )}
      </section>

      {/* Daily Meal Structure */}
      {plan.meals?.length > 0 && (
        <section className="rounded-xl border border-[#DFDFDF] bg-white p-5">
          <h3 className="text-lg font-semibold text-[#0A4833]">Daily Meal Structure</h3>
          <div className="mt-4 space-y-3">
            {plan.meals.map((meal, i) => (
              <article key={i} className="rounded-lg border border-[#E5E7EB] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                        <span className={`h-2.5 w-2.5 rounded-full ${MEAL_DOT[meal.meal_type] ?? "bg-[#64748B]"}`} />
                        {capitalize(meal.meal_type)}
                      </span>
                      <span className="text-xs text-[#6B7280]">{formatTime(meal.time)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#111827]">{meal.title}</p>
                    {meal.calories ? (
                      <p className="mt-1 text-xs text-[#6B7280]">{meal.calories} kcal</p>
                    ) : null}
                    {meal.notes && <p className="mt-2 text-xs text-[#4B5563]">{meal.notes}</p>}
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
      )}

      {/* Buckwheat Wellness Integration — brand-specific static content */}
      <section className="rounded-xl border border-[#0A5A43] bg-[#0A5A43] p-5 text-white">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Buckwheat Wellness Integration</h3>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Recommended Products</p>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {["Buckwheat Flour — 1 kg", "Buckwheat Groats — 500 g", "Buckwheat Honey — 250 ml"].map((p) => (
                <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" /><span>{p}</span></li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Daily Serving</p>
              <p className="mt-2 text-sm text-white">1–2 servings of buckwheat per day as a core grain</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/70">Benefits Note</p>
              <p className="mt-2 text-sm leading-6 text-white/90">Buckwheat is gluten-free, high in fibre, and supports blood-sugar balance and cardiovascular health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle & Guidance */}
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
        {plan.instructions && (
          <div className="mt-4 rounded-lg bg-[#F8F3E9] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#A88751]">Personalized Consultant Advice</p>
            <p className="mt-2 text-sm leading-6 text-[#374151]">{plan.instructions}</p>
          </div>
        )}
      </section>
    </div>
  );
}
