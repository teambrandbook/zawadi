"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Copy,
  Eye,
  FileText,
  Flame,
  Plus,
  Search,
  User,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";

type PlanStatus = "active" | "completed" | "draft" | "pending";

type DietPlan = {
  id: string;
  title: string;
  clientName: string;
  goal: string;
  duration: string;
  status: PlanStatus;
  updatedAt: string;
};

type StatCard = {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
};

type MealItem = {
  label: string;
  calories: string;
};

const stats: StatCard[] = [
  { label: "Total Plans", value: "48", icon: FileText, iconColor: "text-[#0A4833]" },
  { label: "Active Plans", value: "32", icon: Flame, iconColor: "text-[#B48A4A]" },
  { label: "Draft Plans", value: "8", icon: FileText, iconColor: "text-[#7C8A86]" },
  { label: "Completed", value: "24", icon: CircleCheck, iconColor: "text-[#22C55E]" },
  { label: "Pending", value: "5", icon: Clock3, iconColor: "text-[#F97316]" },
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
  },
  {
    id: "plan-2",
    title: "Balanced Nutrition Guide",
    clientName: "Michael Chen",
    goal: "Muscle Gain",
    duration: "60 Days",
    status: "active",
    updatedAt: "Updated 1 day ago",
  },
  {
    id: "plan-3",
    title: "Wellness Maintenance Plan",
    clientName: "Not Assigned",
    goal: "Maintenance",
    duration: "45 Days",
    status: "draft",
    updatedAt: "Updated 3 days ago",
  },
  {
    id: "plan-4",
    title: "Energy Boost Protocol",
    clientName: "Sarah Williams",
    goal: "Weight Loss",
    duration: "30 Days",
    status: "completed",
    updatedAt: "Updated 1 week ago",
  },
  {
    id: "plan-5",
    title: "High Protein Buckwheat Plan",
    clientName: "David Martinez",
    goal: "Muscle Gain",
    duration: "90 Days",
    status: "pending",
    updatedAt: "Updated 5 hours ago",
  },
];

const previewMeals: MealItem[] = [
  { label: "Breakfast", calories: "450 cal" },
  { label: "Mid-Morning", calories: "200 cal" },
  { label: "Lunch", calories: "550 cal" },
  { label: "Snack", calories: "150 cal" },
  { label: "Dinner", calories: "500 cal" },
];

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
      { label: "Duplicate", icon: Copy, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
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
    return [
      ...baseActions,
      { label: "Duplicate", icon: Copy, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
    ];
  }

  return [
    ...baseActions,
    { label: "Edit", icon: FileText, className: "bg-[#F5EFE3] text-[#A88751] hover:bg-[#ECE2D0]" },
    { label: "Assign", icon: UserPlus, className: "bg-[#F3F4F6] text-[#0A4833] hover:bg-[#E5E7EB]" },
  ];
}

export default function ConsultantDietPlansPage() {
  return (
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
            href="/consultant/diet-plans"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0A4833] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(10,72,51,0.15)] transition hover:bg-[#083627]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Diet Plan</span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <SectionCard key={stat.label} className="p-4">
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                <p className="mt-4 text-[38px] font-bold leading-none text-[#0A4833]">{stat.value}</p>
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

            {dietPlans.map((plan) => (
              <SectionCard key={plan.id} className="p-5">
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
                <p className="mt-1 text-xs text-[rgba(10,72,51,0.6)]">Buckwheat Power Plan</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                <UtensilsCrossed className="h-4 w-4 text-[#A88751]" />
                <span>Meal Structure</span>
              </div>

              <div className="mt-4 space-y-3">
                {previewMeals.map((meal) => (
                  <div key={meal.label} className="flex items-center justify-between rounded-lg bg-[#F8F4EC] px-3 py-3 text-sm">
                    <span className="text-[#0A4833]">{meal.label}</span>
                    <span className="font-medium text-[#A88751]">{meal.calories}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E5E7EB] pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
                <Clock3 className="h-4 w-4 text-[#A88751]" />
                <span>Daily Target</span>
              </div>
              <div className="mt-4 h-8 rounded-lg bg-[#F3F4F6]" />
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
