"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DietPlanView, {
  type DailyTarget,
  type DietMeal,
  type NutritionGuidance,
  type WeeklySummary,
} from "./components/DietPlanView";
import FullDietPlanDetails from "./components/FullDietPlanDetails";

const todaysMeals: DietMeal[] = [
  {
    id: "meal-1",
    type: "Breakfast",
    time: "7:00 AM",
    title: "Buckwheat Pancakes with Berries",
    description: "Fluffy buckwheat pancakes topped with fresh blueberries, honey, and chopped walnuts",
    macros: "320 calories | 12g protein | 45g carbs | 8g fiber",
    completed: true,
    colorClass: "bg-[#22C55E]",
  },
  {
    id: "meal-2",
    type: "Mid-Morning",
    time: "10:30 AM",
    title: "Green Smoothie",
    description: "Spinach, banana, almond milk, and chia seeds",
    macros: "180 calories | 4g protein | 28g carbs | 6g fiber",
    completed: false,
    colorClass: "bg-[#EAB308]",
  },
  {
    id: "meal-3",
    type: "Lunch",
    time: "1:00 PM",
    title: "Buckwheat Buddha Bowl",
    description: "Roasted buckwheat, grilled chicken, roasted vegetables, avocado, and tahini dressing",
    macros: "450 calories | 28g protein | 52g carbs | 10g fiber",
    completed: false,
    colorClass: "bg-[#F97316]",
  },
  {
    id: "meal-4",
    type: "Evening",
    time: "4:00 PM",
    title: "Mixed Nuts & Herbal Tea",
    description: "Almonds, walnuts, and chamomile tea",
    macros: "180 calories | 6g protein | 8g carbs | 3g fiber",
    completed: false,
    colorClass: "bg-[#A855F7]",
  },
  {
    id: "meal-5",
    type: "Dinner",
    time: "7:30 PM",
    title: "Buckwheat Stuffed Peppers",
    description: "Bell peppers stuffed with buckwheat, mushrooms, herbs, and a side salad",
    macros: "420 calories | 16g protein | 58g carbs | 12g fiber",
    completed: false,
    colorClass: "bg-[#EF4444]",
  },
];

const dailyTargets: DailyTarget[] = [
  { label: "Calories", value: "1350 / 1550", progress: 87, colorClass: "bg-[#A88751]" },
  { label: "Protein", value: "52g / 68g", progress: 76, colorClass: "bg-[#0A4833]" },
  { label: "Carbs", value: "165g / 185g", progress: 89, colorClass: "bg-[#A88751]" },
  { label: "Fiber", value: "28g / 35g", progress: 80, colorClass: "bg-[#22C55E]" },
  { label: "Water", value: "6 / 8 glasses", progress: 75, colorClass: "bg-[#38BDF8]" },
];

const weeklySummary: WeeklySummary[] = [
  { label: "Meals Completed", value: "28/35" },
  { label: "Adherence Rate", value: "80%" },
  { label: "Weight Change", value: "-0.8 kg", valueClassName: "font-medium text-[#16A34A]" },
  { label: "Energy Level", value: "High" },
];

const nutritionGuidance: NutritionGuidance = {
  doctorNote: {
    doctor: "Dr. Sarah Johnson",
    image: "/recipe/recipe-2.webp",
    message:
      "Great progress this week! Your adherence to the buckwheat-based meals is excellent. Remember to drink plenty of water and aim for 7-8 hours of sleep to support your metabolism.",
  },
  foodsToEmphasize: [
    "Buckwheat in various forms",
    "Lean proteins (fish, chicken)",
    "Leafy greens and colorful vegetables",
    "Healthy fats (avocado, nuts)",
  ],
  lifestyleTips: ["30 minutes walking daily", "Meal prep on Sundays", "Mindful eating practice", "Stay hydrated (8-10 glasses)"],
};

export default function DietPlanPageContent() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <>
      <DietPlanView
        todaysMeals={todaysMeals}
        dailyTargets={dailyTargets}
        weeklySummary={weeklySummary}
        nutritionGuidance={nutritionGuidance}
        onBookFollowUp={() => router.push("/communityDashBorde/addconsaltation")}
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
        <FullDietPlanDetails />
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
