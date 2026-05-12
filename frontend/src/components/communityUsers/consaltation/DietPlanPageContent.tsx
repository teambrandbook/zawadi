"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import DietPlanView, {
  type DailyTarget,
  type DietMeal,
  type NutritionGuidance,
  type WeeklySummary,
} from "./components/DietPlanView";
import FullDietPlanDetails from "./components/FullDietPlanDetails";

type MealItem = {
  food_name: string;
  quantity: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
};

type Meal = {
  meal_type: string;
  title: string;
  time: string;
  calories: number;
  notes: string;
  sort_order: number;
  items: MealItem[];
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
  water_intake_liters: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  consultant_name: string;
  meals: Meal[];
};

const MEAL_COLORS: Record<string, string> = {
  BREAKFAST: "bg-[#22C55E]",
  MID_MORNING: "bg-[#EAB308]",
  SNACK: "bg-[#EAB308]",
  LUNCH: "bg-[#F97316]",
  EVENING: "bg-[#A855F7]",
  DINNER: "bg-[#EF4444]",
};

function formatTime(raw: string): string {
  if (!raw) return "";
  const [hStr, mStr] = raw.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m} ${suffix}`;
}

function capitalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildMeals(meals: Meal[]): DietMeal[] {
  return meals.map((m, i) => {
    const itemList = m.items?.map((it) => `${it.food_name}${it.quantity ? ` (${it.quantity})` : ""}`).join(", ");
    const description = m.notes || itemList || "";
    const protein = m.items?.reduce((s, it) => s + (it.protein_grams || 0), 0);
    const carbs = m.items?.reduce((s, it) => s + (it.carbs_grams || 0), 0);
    const macros = [
      m.calories ? `${m.calories} cal` : "",
      protein ? `${Math.round(protein)}g protein` : "",
      carbs ? `${Math.round(carbs)}g carbs` : "",
    ]
      .filter(Boolean)
      .join(" | ");
    return {
      id: String(m.sort_order ?? i),
      type: capitalize(m.meal_type),
      time: formatTime(m.time),
      title: m.title,
      description,
      macros,
      completed: false,
      colorClass: MEAL_COLORS[m.meal_type] ?? "bg-[#64748B]",
    };
  });
}

function buildTargets(plan: DietPlan): DailyTarget[] {
  return [
    { label: "Calories", value: plan.daily_calories ? `${plan.daily_calories} kcal` : "—", progress: 0, colorClass: "bg-[#A88751]" },
    { label: "Protein", value: plan.protein_grams ? `${plan.protein_grams}g` : "—", progress: 0, colorClass: "bg-[#0A4833]" },
    { label: "Carbs", value: plan.carbs_grams ? `${plan.carbs_grams}g` : "—", progress: 0, colorClass: "bg-[#A88751]" },
    { label: "Fats", value: plan.fats_grams ? `${plan.fats_grams}g` : "—", progress: 0, colorClass: "bg-[#F97316]" },
    { label: "Water", value: plan.water_intake_liters ? `${plan.water_intake_liters}L` : "—", progress: 0, colorClass: "bg-[#38BDF8]" },
  ];
}

function buildSummary(plan: DietPlan): WeeklySummary[] {
  return [
    { label: "Goal", value: plan.goal || "—" },
    { label: "Status", value: capitalize(plan.status || "active"), valueClassName: "font-medium text-[#16A34A]" },
    { label: "Duration", value: plan.duration_days ? `${plan.duration_days} days` : "—" },
    { label: "End Date", value: plan.end_date || "—" },
  ];
}

function buildGuidance(plan: DietPlan): NutritionGuidance {
  const foods = (plan.recommended_foods || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    doctorNote: {
      doctor: plan.consultant_name || "Your Nutritionist",
      image: "/recipe/recipe-2.webp",
      message: plan.instructions || plan.description || "Follow your personalised diet plan for best results.",
    },
    foodsToEmphasize: foods.length ? foods : ["Buckwheat in various forms", "Lean proteins", "Leafy greens", "Healthy fats"],
    lifestyleTips: ["30 minutes of walking daily", "Meal prep on Sundays", "Drink 8–10 glasses of water", "Mindful eating practice"],
  };
}

export default function DietPlanPageContent() {
  const router = useRouter();
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get<DietPlan[] | { results: DietPlan[] }>("/consultant/diet-plans/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results ?? [];
        setPlan(list[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[#6B7280]">
        Loading your diet plan…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-16 text-center lg:px-8">
        <p className="text-lg font-semibold text-[#0A4833]">No diet plan assigned yet.</p>
        <p className="mt-2 text-sm text-[#6B7280]">
          Your nutritionist will create a personalised plan after your consultation.
        </p>
        <button
          onClick={() => router.push("/communityDashBoard/addconsaltation")}
          className="mt-6 rounded-xl bg-[#0A4833] px-6 py-2 text-sm font-bold text-white hover:bg-[#083627]"
        >
          Book a Consultation
        </button>
      </div>
    );
  }

  return (
    <>
      <DietPlanView
        todaysMeals={buildMeals(plan.meals ?? [])}
        dailyTargets={buildTargets(plan)}
        weeklySummary={buildSummary(plan)}
        nutritionGuidance={buildGuidance(plan)}
        onBookFollowUp={() => router.push("/communityDashBoard/addconsaltation")}
        onDownloadPlan={() => setMessage("Diet plan download requested.")}
        onViewNotes={() => setMessage("Opening nutritionist notes.")}
        onMarkComplete={() => setMessage("Meal marked as complete.")}
        onTrackProgress={() => setMessage("Opening progress tracker.")}
      />

      <section className="mx-auto mb-6 max-w-[1120px] px-4 lg:px-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#0A4833]">Full Plan Details</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Detailed plan information based on the diet plan creation fields.
          </p>
        </div>
        <FullDietPlanDetails plan={plan} />
      </section>

      {message && (
        <div className="mx-auto mb-6 max-w-[1120px] px-4 lg:px-8">
          <div className="rounded-lg border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-2 text-sm text-[#0A4833]">
            {message}
          </div>
        </div>
      )}
    </>
  );
}
