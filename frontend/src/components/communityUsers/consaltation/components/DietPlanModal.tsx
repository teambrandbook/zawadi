"use client";

import { X } from "lucide-react";
import FullDietPlanDetails from "./FullDietPlanDetails";
import { fullDietPlanDetails } from "./fullDietPlanData";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DietPlanModal({ open, onClose }: Props) {
  if (!open) return null;

  const fallbackPlan = {
    id: 0,
    title: fullDietPlanDetails.plan.title,
    goal: fullDietPlanDetails.plan.goal,
    status: fullDietPlanDetails.plan.status,
    description: fullDietPlanDetails.lifestyle.personalizedAdvice,
    instructions: fullDietPlanDetails.lifestyle.exerciseRecommendations.join("\n"),
    foods_to_avoid: fullDietPlanDetails.lifestyle.foodsToAvoid.join("\n"),
    recommended_foods: fullDietPlanDetails.buckwheatIntegration.products.join("\n"),
    daily_calories: parseInt(fullDietPlanDetails.plan.dailyCalories, 10) || 0,
    protein_grams: 0,
    carbs_grams: 0,
    fats_grams: 0,
    water_intake_liters: 0,
    start_date: fullDietPlanDetails.plan.startDate,
    end_date: "",
    duration_days: parseInt(fullDietPlanDetails.plan.duration, 10) || 0,
    consultant_name: fullDietPlanDetails.plan.consultant,
    client_name: fullDietPlanDetails.client.name,
    meals: fullDietPlanDetails.meals.map((meal, index) => ({
      meal_type: meal.label.toUpperCase(),
      title: meal.item,
      time: meal.time,
      calories: parseInt(meal.calories, 10) || 0,
      notes: meal.note,
      sort_order: index,
      items: [
        {
          food_name: meal.item,
          quantity: meal.quantity,
          calories: parseInt(meal.calories, 10) || 0,
        },
      ],
    })),
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#101828]/55 px-4 py-6" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[#D1D5DB] bg-[#F9FAFB] shadow-[0_28px_90px_rgba(16,24,40,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E5E7EB] bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A88751]">Full Diet Plan</p>
            <h3 className="mt-1 text-xl font-semibold text-[#0A4833]">Buckwheat Wellness Plan Details</h3>
            <p className="mt-1 text-sm text-[#6B7280]">Review the complete plan without leaving the consultation page.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#344054] transition hover:bg-[#EFECE6]"
            aria-label="Close full diet plan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <FullDietPlanDetails plan={fallbackPlan} />
        </div>
      </div>
    </div>
  );
}
