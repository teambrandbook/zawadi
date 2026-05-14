"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Eye,
  FileText,
  Flame,
  Plus,
  Search,
  User,
  UserPlus,
  UtensilsCrossed,
  X,
} from "lucide-react";
import api from "@/services/api";

type PlanStatus = "active" | "completed" | "draft" | "pending" | "paused" | "cancelled";

type DietPlan = {
  id: string;
  title: string;
  clientName: string;
  goal: string;
  duration: string;
  status: PlanStatus;
  updatedAt: string;
  dailyCalories: string;
  meals: MealItem[];
  highlights: string[];
};

type StatCardConfig = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  getValue: (plans: DietPlan[]) => number;
};

type MealItem = {
  label: string;
  calories: string;
};

type DietPlanApiMeal = {
  meal_type: string;
  title?: string | null;
  calories: number;
};

type DietPlanApiResponse = {
  id: number;
  title: string;
  client_name?: string | null;
  goal: string;
  duration_days: number;
  status: PlanStatus;
  daily_calories: number;
  description?: string | null;
  instructions?: string | null;
  recommended_foods?: string | null;
  foods_to_avoid?: string | null;
  updated_at: string;
  meals: DietPlanApiMeal[];
};

const statConfigs: StatCardConfig[] = [
  { label: "Total Plans", icon: FileText, iconColor: "text-[#0A4833]", getValue: (plans) => plans.length },
  { label: "Active Plans", icon: Flame, iconColor: "text-[#B48A4A]", getValue: (plans) => plans.filter((plan) => plan.status === "active").length },
  { label: "Draft Plans", icon: FileText, iconColor: "text-[#7C8A86]", getValue: (plans) => plans.filter((plan) => plan.status === "draft").length },
  { label: "Completed", icon: CircleCheck, iconColor: "text-[#22C55E]", getValue: (plans) => plans.filter((plan) => plan.status === "completed").length },
  { label: "Pending", icon: Clock3, iconColor: "text-[#F97316]", getValue: (plans) => plans.filter((plan) => plan.status === "pending").length },
];

const dietPlans: DietPlan[] = [
  {
    id: "plan-1",
    title: "Buckwheat Power Plan",
    clientName: "Emma Johnson",
    goal: "Weight Loss",
    duration: "30 Days",
    status: "active",
    updatedAt: "Updated 2 hours ago",
    dailyCalories: "1850 cal",
    meals: [
      { label: "Breakfast", calories: "420 cal" },
      { label: "Mid-Morning", calories: "180 cal" },
      { label: "Lunch", calories: "560 cal" },
      { label: "Snack", calories: "190 cal" },
      { label: "Dinner", calories: "500 cal" },
    ],
    highlights: ["Buckwheat-focused meals", "High fiber support", "Weekly progress tracking"],
  },
  {
    id: "plan-2",
    title: "Balanced Nutrition Guide",
    clientName: "Michael Chen",
    goal: "Muscle Gain",
    duration: "60 Days",
    status: "active",
    updatedAt: "Updated 1 day ago",
    dailyCalories: "2400 cal",
    meals: [
      { label: "Breakfast", calories: "500 cal" },
      { label: "Mid-Morning", calories: "250 cal" },
      { label: "Lunch", calories: "700 cal" },
      { label: "Snack", calories: "250 cal" },
      { label: "Dinner", calories: "700 cal" },
    ],
    highlights: ["Protein-balanced meals", "Strength training support", "Higher calorie target"],
  },
  {
    id: "plan-3",
    title: "Wellness Maintenance Plan",
    clientName: "Not Assigned",
    goal: "Maintenance",
    duration: "45 Days",
    status: "draft",
    updatedAt: "Updated 3 days ago",
    dailyCalories: "2000 cal",
    meals: [
      { label: "Breakfast", calories: "430 cal" },
      { label: "Mid-Morning", calories: "170 cal" },
      { label: "Lunch", calories: "600 cal" },
      { label: "Snack", calories: "180 cal" },
      { label: "Dinner", calories: "620 cal" },
    ],
    highlights: ["Draft plan", "Balanced maintenance goal", "Ready for assignment"],
  },
  {
    id: "plan-4",
    title: "Energy Boost Protocol",
    clientName: "Sarah Williams",
    goal: "Weight Loss",
    duration: "30 Days",
    status: "completed",
    updatedAt: "Updated 1 week ago",
    dailyCalories: "1750 cal",
    meals: [
      { label: "Breakfast", calories: "390 cal" },
      { label: "Mid-Morning", calories: "160 cal" },
      { label: "Lunch", calories: "520 cal" },
      { label: "Snack", calories: "180 cal" },
      { label: "Dinner", calories: "500 cal" },
    ],
    highlights: ["Completed successfully", "Energy-focused foods", "Client adherence summary"],
  },
  {
    id: "plan-5",
    title: "High Protein Buckwheat Plan",
    clientName: "David Martinez",
    goal: "Muscle Gain",
    duration: "90 Days",
    status: "pending",
    updatedAt: "Updated 5 hours ago",
    dailyCalories: "2600 cal",
    meals: [
      { label: "Breakfast", calories: "520 cal" },
      { label: "Mid-Morning", calories: "220 cal" },
      { label: "Lunch", calories: "760 cal" },
      { label: "Snack", calories: "240 cal" },
      { label: "Dinner", calories: "860 cal" },
    ],
    highlights: ["High-protein structure", "Buckwheat meal base", "Awaiting client approval"],
  },
];

function formatGoal(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMealType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return `Updated ${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function splitHighlights(...values: Array<string | null | undefined>) {
  return values
    .flatMap((value) => String(value ?? "").split(/\n|,/))
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function mapDietPlan(plan: DietPlanApiResponse): DietPlan {
  const highlights = splitHighlights(
    plan.description,
    plan.recommended_foods,
    plan.instructions,
    plan.foods_to_avoid ? `Avoid: ${plan.foods_to_avoid}` : ""
  );

  return {
    id: String(plan.id),
    title: plan.title,
    clientName: plan.client_name || "Not Assigned",
    goal: formatGoal(plan.goal),
    duration: `${plan.duration_days || 0} Days`,
    status: plan.status,
    updatedAt: formatUpdatedAt(plan.updated_at),
    dailyCalories: `${plan.daily_calories || 0} cal`,
    meals: plan.meals.map((meal) => ({
      label: meal.title || formatMealType(meal.meal_type),
      calories: `${meal.calories || 0} cal`,
    })),
    highlights: highlights.length > 0 ? highlights : ["No highlights added"],
  };
}

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-[#D1D5DB] bg-white shadow-sm ${className}`}>{children}</section>;
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-between rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-[#1F2937]"
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-[#374151]" />
    </button>
  );
}

function getStatusTone(status: PlanStatus) {
  if (status === "active") return "text-[#A88751]";
  if (status === "completed") return "text-[#22C55E]";
  if (status === "draft") return "text-[#7C8A86]";
  return "text-[#F97316]";
}

function getPlanActions(status: PlanStatus) {
  const baseActions = [
    {
      label: "View Plan",
      icon: Eye,
      className: "bg-[#0A4833] text-white hover:bg-[#083627]",
    },
  ];

  if (status === "active") {
    return [
      ...baseActions,
      { label: "Edit", icon: FileText, className: "bg-[#F5EFE3] text-[#A88751] hover:bg-[#ECE2D0]" },
      { label: "Assign", icon: UserPlus, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
    ];
  }

  if (status === "draft") {
    return [
      ...baseActions,
      { label: "Edit", icon: FileText, className: "bg-[#F5EFE3] text-[#A88751] hover:bg-[#ECE2D0]" },
      { label: "Assign", icon: UserPlus, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
    ];
  }

  if (status === "completed") {
    return baseActions;
  }

  return [
    ...baseActions,
    { label: "Edit", icon: FileText, className: "bg-[#F5EFE3] text-[#A88751] hover:bg-[#ECE2D0]" },
    { label: "Assign", icon: UserPlus, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
  ];
}

export default function ConsultantDietPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<DietPlan[]>(dietPlans);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(dietPlans[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .get<DietPlanApiResponse[]>("/consultant/diet-plans/")
      .then((response) => {
        if (!isMounted) return;
        const mappedPlans = response.data.map(mapDietPlan);
        setPlans(mappedPlans);
        setSelectedPlan(mappedPlans[0] ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setPlans([]);
        setSelectedPlan(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleViewPlan(plan: DietPlan) {
    setSelectedPlan(plan);
    setIsPreviewOpen(true);
  }

  function handlePlanAction(plan: DietPlan, label: string) {
    if (label === "View Plan") {
      handleViewPlan(plan);
      return;
    }

    if (label === "Edit") {
      router.push(`/consultant/diet-plans/add?mode=edit&id=${plan.id}`);
      return;
    }

    if (label === "Assign") {
      router.push(`/consultant/diet-plans/add?mode=assign&id=${plan.id}`);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
        <div className="mx-auto max-w-[1220px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#0A4833]">Diet Plans</h1>
            <p className="mt-2 text-sm text-[rgba(10,72,51,0.6)]">
              Create and manage personalized nutrition plans for your clients
            </p>
          </div>

          <Link
            href="/consultant/diet-plans/add"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0A4833] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(10,72,51,0.15)] transition hover:bg-[#083627]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Diet Plan</span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statConfigs.map((stat) => {
            const Icon = stat.icon;
            const value = isLoading ? "..." : String(stat.getValue(plans));

            return (
              <SectionCard key={stat.label} className="p-4">
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                <p className="mt-4 text-[38px] font-bold leading-none text-[#0A4833]">{value}</p>
                <p className="mt-2 text-sm text-[rgba(10,72,51,0.55)]">{stat.label}</p>
              </SectionCard>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <SectionCard className="p-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
                <div>
                  <p className="mb-2 text-xs font-medium text-[#0A4833]">Search Plans</p>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="Search by title..."
                      className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm text-[#1F2937] outline-none focus:border-[#0A4833]"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#0A4833]">Client</p>
                  <FilterSelect label="All Clients" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#0A4833]">Goal</p>
                  <FilterSelect label="All Goals" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#0A4833]">Status</p>
                  <FilterSelect label="All Status" />
                </div>
              </div>
            </SectionCard>

            {isLoading ? (
              <SectionCard className="p-5">
                <p className="text-sm font-medium text-[#0A4833]">Loading diet plans...</p>
              </SectionCard>
            ) : null}

            {!isLoading && plans.length === 0 ? (
              <SectionCard className="p-5">
                <p className="text-sm font-medium text-[#0A4833]">No diet plans found.</p>
                <p className="mt-1 text-sm text-[rgba(10,72,51,0.6)]">
                  Create a diet plan to show it here.
                </p>
              </SectionCard>
            ) : null}

            {plans.map((plan) => (
              <SectionCard key={plan.id} className={`p-5 ${selectedPlan?.id === plan.id ? "ring-2 ring-[#D8C092]" : ""}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-[18px] font-semibold text-[#0A4833]">{plan.title}</h2>
                      <span className={`text-xs font-medium capitalize ${getStatusTone(plan.status)}`}>{plan.status}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[rgba(10,72,51,0.6)]">
                      <span className="inline-flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {plan.clientName}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CircleCheck className="h-4 w-4" />
                        {plan.goal}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {plan.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[rgba(10,72,51,0.45)]">{plan.updatedAt}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {getPlanActions(plan.status).map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={`${plan.id}-${action.label}`}
                        type="button"
                        onClick={() => handlePlanAction(plan, action.label)}
                        className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition ${action.className}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>
            ))}
          </div>

          <SectionCard className="h-fit p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EFE3]">
                <UtensilsCrossed className="h-5 w-5 text-[#A88751]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A4833]">Plan Preview</h2>
                <p className="mt-1 text-xs text-[rgba(10,72,51,0.6)]">{selectedPlan?.title || "Select a plan"}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#F8FAF9] p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#0A4833]">Client</span>
                <span className="font-medium text-[#A88751]">{selectedPlan?.clientName || "-"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#0A4833]">Goal</span>
                <span className="font-medium text-[#A88751]">{selectedPlan?.goal || "-"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#0A4833]">Duration</span>
                <span className="font-medium text-[#A88751]">{selectedPlan?.duration || "-"}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                <UtensilsCrossed className="h-4 w-4 text-[#A88751]" />
                <span>Meal Structure</span>
              </div>

              <div className="mt-4 space-y-3">
                {(selectedPlan?.meals ?? []).map((meal) => (
                  <div key={meal.label} className="flex items-center justify-between rounded-lg bg-[#F8F4EC] px-3 py-3 text-sm">
                    <span className="text-[#0A4833]">{meal.label}</span>
                    <span className="font-medium text-[#A88751]">{meal.calories}</span>
                  </div>
                ))}
                {!selectedPlan ? (
                  <div className="rounded-lg bg-[#F8F4EC] px-3 py-3 text-sm text-[#0A4833]">No plan selected</div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E5E7EB] pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                <Clock3 className="h-4 w-4 text-[#A88751]" />
                <span>Daily Target</span>
              </div>
              <div className="mt-4 rounded-lg bg-[#F3F4F6] px-3 py-3 text-sm font-medium text-[#0A4833]">
                {selectedPlan?.dailyCalories || "-"}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E5E7EB] pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                <Check className="h-4 w-4 text-[#A88751]" />
                <span>Highlights</span>
              </div>
              <div className="mt-4 space-y-2">
                {(selectedPlan?.highlights ?? []).map((item) => (
                  <div key={item} className="rounded-lg bg-[#F8F4EC] px-3 py-2 text-sm text-[#0A4833]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
        </div>
      </main>

      {isPreviewOpen && selectedPlan ? (
        <div
          className="fixed inset-0 z-[90] overflow-y-auto bg-[#101828]/55 px-4 py-4 sm:py-6"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="flex min-h-full items-start justify-center py-4 sm:items-center">
          <div
            className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#D1D5DB] bg-white shadow-[0_28px_90px_rgba(16,24,40,0.22)] sm:max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A88751]">Plan Preview</p>
                <h3 className="mt-1 text-2xl font-semibold text-[#0A4833]">{selectedPlan.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280]">
                  {selectedPlan.clientName} - {selectedPlan.goal} - {selectedPlan.duration}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#344054] transition hover:bg-[#EFECE6]"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-xs text-[#6B7280]">Client</p>
                  <p className="mt-1 text-sm font-semibold text-[#0A4833]">{selectedPlan.clientName}</p>
                </div>
                <div className="rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-xs text-[#6B7280]">Status</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-[#0A4833]">{selectedPlan.status}</p>
                </div>
                <div className="rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-xs text-[#6B7280]">Daily Target</p>
                  <p className="mt-1 text-sm font-semibold text-[#0A4833]">{selectedPlan.dailyCalories}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#0A4833]">Meal Structure</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedPlan.meals.map((meal) => (
                    <div key={meal.label} className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-sm font-medium text-[#0A4833]">{meal.label}</p>
                      <p className="mt-1 text-sm text-[#A88751]">{meal.calories}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#0A4833]">Plan Highlights</h4>
                <div className="mt-4 space-y-2">
                  {selectedPlan.highlights.map((item) => (
                    <div key={item} className="rounded-xl bg-[#F8FAF9] px-4 py-3 text-sm text-[#0A4833]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
