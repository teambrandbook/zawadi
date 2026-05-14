"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import api from "@/services/api";

type ApiMealItem = {
  food_name: string;
  quantity: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
};

type ApiMeal = {
  meal_type: string;
  title: string;
  time: string;
  calories: number;
  notes: string;
  sort_order: number;
  items: ApiMealItem[];
};

type DietPlan = {
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
  duration_days: number;
  consultant_name: string;
  updated_at: string;
  meals: ApiMeal[];
};

type Meal = {
  id: string;
  name: string;
  title: string;
  time: string;
  description: string;
  macros: string;
  hasBuckwheat?: boolean;
  completed?: boolean;
};

function parseLines(value?: string) {
  return (value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatLabel(value?: string) {
  return (value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTime(raw?: string) {
  if (!raw) return "";
  const [hourValue, minuteValue = "00"] = raw.split(":");
  const hourNumber = Number.parseInt(hourValue, 10);
  if (Number.isNaN(hourNumber)) return raw;
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = hourNumber % 12 || 12;
  return `${displayHour}:${minuteValue} ${suffix}`;
}

function formatUpdatedDate(value?: string) {
  if (!value) return "";
  const updatedDate = new Date(value);
  if (Number.isNaN(updatedDate.getTime())) return "";
  return updatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildMeal(meal: ApiMeal, index: number): Meal {
  const itemDescription = meal.items
    ?.map((item) => `${item.food_name}${item.quantity ? ` (${item.quantity})` : ""}`)
    .join(", ");
  const protein = meal.items?.reduce((sum, item) => sum + (item.protein_grams || 0), 0);
  const carbs = meal.items?.reduce((sum, item) => sum + (item.carbs_grams || 0), 0);
  const fats = meal.items?.reduce((sum, item) => sum + (item.fats_grams || 0), 0);
  const macros = [
    meal.calories ? `${meal.calories} calories` : "",
    protein ? `${Math.round(protein)}g protein` : "",
    carbs ? `${Math.round(carbs)}g carbs` : "",
    fats ? `${Math.round(fats)}g fats` : "",
  ]
    .filter(Boolean)
    .join(" / ");
  const title = meal.title || formatLabel(meal.meal_type) || "Meal";
  const textForBuckwheat = `${title} ${meal.notes || ""} ${itemDescription || ""}`.toLowerCase();

  return {
    id: `${meal.sort_order ?? index}-${meal.meal_type}`,
    name: formatLabel(meal.meal_type),
    title,
    time: formatTime(meal.time),
    description: meal.notes || itemDescription || "Meal details will appear here.",
    macros,
    hasBuckwheat: textForBuckwheat.includes("buckwheat"),
    completed: false,
  };
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <article className="rounded-[8px] border border-[#DFDFDF] bg-white p-4">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="h-3 w-3 rounded-full bg-[#A88751]" />
            <h3 className="text-[18px] font-semibold leading-6 text-[#0A4833]">{meal.name}</h3>
            {meal.hasBuckwheat ? (
              <span className="text-[12px] font-semibold leading-4 text-[#A88751]">Buckwheat</span>
            ) : null}
            {meal.time ? <span className="text-[12px] leading-4 text-[#6B7280]">{meal.time}</span> : null}
          </div>

          <h4 className="mt-2 text-[16px] font-semibold leading-6 text-[#111827]">{meal.title}</h4>
          <p className="mt-1 text-[14px] leading-5 text-[#4B5563]">{meal.description}</p>
          {meal.macros ? <p className="mt-2 text-[12px] leading-4 text-[#6B7280]">{meal.macros}</p> : null}
        </div>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            meal.completed ? "border-[#0A4833] bg-[#0A4833] text-white" : "border-[#DFDFDF] bg-white text-transparent"
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>
    </article>
  );
}

function RecommendationList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-[8px] border border-[#DFDFDF] bg-white p-4">
      <h5 className="text-[16px] font-semibold leading-6 text-[#0A4833]">{title}</h5>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-5 text-[#4B5563]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ConsultationHistoryDetails() {
  const router = useRouter();
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DietPlan[] | { results: DietPlan[] }>("/consultant/diet-plans/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results ?? [];
        setPlan(list[0] ?? null);
      })
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  const meals = useMemo(() => (plan?.meals ?? []).map(buildMeal), [plan]);
  const recommendedFoods = useMemo(() => parseLines(plan?.recommended_foods), [plan]);
  const foodsToAvoid = useMemo(() => parseLines(plan?.foods_to_avoid), [plan]);
  const updatedDate = formatUpdatedDate(plan?.updated_at);

  return (
    <section className="w-full bg-white px-3 py-4 lg:px-4">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <button
          type="button"
          onClick={() => router.push("/communityDashBoard/consultation")}
          className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-[#DFDFDF] bg-white px-4 text-[14px] font-medium text-[#0A4833] hover:bg-[#F8F3E9]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {loading ? (
          <div className="mx-auto max-w-[846px] rounded-[12px] border border-[#DFDFDF] bg-white p-6 text-sm text-[#6B7280]">
            Loading consultation history...
          </div>
        ) : null}

        {!loading && !plan ? (
          <div className="mx-auto max-w-[846px] rounded-[12px] border border-[#DFDFDF] bg-white p-6 text-sm text-[#6B7280]">
            No diet plan details found for this consultation.
          </div>
        ) : null}

        {!loading && plan ? (
          <div className="mx-auto w-full max-w-[846px] space-y-10">
            <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_313px]">
                <div>
                  <h2 className="text-[20px] font-bold leading-7 text-[#0A4833]">Active Diet Plan</h2>
                  <h4 className="mt-4 text-[16px] font-semibold leading-6 text-[#111827]">
                    {formatLabel(plan.goal) || plan.title}
                  </h4>
                  <p className="mt-2 max-w-[313px] text-[14px] leading-5 text-[#4B5563]">
                    {plan.description || "Your consultant has assigned this diet plan."}
                  </p>
                </div>

                <div className="space-y-2 text-[14px] leading-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#4B5563]">Status</span>
                    <span className="font-medium text-[#15803D]">{formatLabel(plan.status)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#4B5563]">Daily Calories</span>
                    <span className="font-medium text-[#111827]">
                      {plan.daily_calories ? `${plan.daily_calories} kcal` : "Not added"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#4B5563]">Duration</span>
                    <span className="font-medium text-[#111827]">
                      {plan.duration_days ? `${plan.duration_days} days` : "Not added"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {meals.length > 0 ? (
                  meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
                ) : (
                  <div className="rounded-[8px] border border-[#DFDFDF] bg-white p-4 text-sm text-[#6B7280]">
                    Meal details are not added yet.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-6">
              <h2 className="text-[20px] font-bold leading-7 text-[#0A4833]">Consultant Recommendations</h2>

              <div className="mt-4 rounded-[8px] bg-[#EBE1CF] p-4">
                <div className="min-w-0">
                  <h4 className="text-[16px] font-semibold leading-6 text-[#0A4833]">
                    {plan.consultant_name || "Consultant"}
                  </h4>
                  {plan.instructions || plan.description ? (
                    <p className="mt-1 text-[14px] leading-5 text-[#4B5563]">
                      {plan.instructions || plan.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-[14px] leading-5 text-[#4B5563]">
                      Consultant recommendations are not added yet.
                    </p>
                  )}
                  {updatedDate ? (
                    <p className="mt-2 text-[12px] leading-4 text-[#6B7280]">Updated {updatedDate}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <RecommendationList title="Foods to Emphasize" items={recommendedFoods} />
                <RecommendationList title="Foods to Avoid" items={foodsToAvoid} />
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </section>
  );
}
