"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  Plus,
  Save,
  Sparkles,
  X,
} from "lucide-react";

type MealKey = "breakfast" | "midMorningSnack" | "lunch" | "eveningSnack" | "dinner";

type MealConfig = {
  key: MealKey;
  label: string;
  calorieTag: string;
  dotClassName: string;
};

type FormState = {
  clientId: string;
  planTitle: string;
  goal: string;
  duration: string;
  startDate: string;
  dailyCalories: string;
  difficulty: string;
  buckwheatProducts: string;
  buckwheatServing: string;
  benefitsNote: string;
  foodsToAvoid: string;
  exerciseRecommendations: string;
  sleepHydration: string;
  personalizedAdvice: string;
  meals: Record<MealKey, { item: string; quantity: string; calories: string }>;
};

type ClientOption = {
  id: number;
  user_id: string;
  email: string;
  full_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
};

const mealSections: MealConfig[] = [
  { key: "breakfast", label: "Breakfast", calorieTag: "350 cal", dotClassName: "bg-[#F97316]" },
  { key: "midMorningSnack", label: "Mid-Morning Snack", calorieTag: "150 cal", dotClassName: "bg-[#EAB308]" },
  { key: "lunch", label: "Lunch", calorieTag: "450 cal", dotClassName: "bg-[#22C55E]" },
  { key: "eveningSnack", label: "Evening Snack", calorieTag: "200 cal", dotClassName: "bg-[#EF4444]" },
  { key: "dinner", label: "Dinner", calorieTag: "400 cal", dotClassName: "bg-[#8B5CF6]" },
];

const initialState: FormState = {
  clientId: "",
  planTitle: "30-Day Weight Loss Plan",
  goal: "Weight Loss",
  duration: "7 Days",
  startDate: "",
  dailyCalories: "1500",
  difficulty: "Beginner",
  buckwheatProducts: "",
  buckwheatServing: "e.g., 1 cup cooked groats",
  benefitsNote: "Explain how buckwheat supports this client's specific goals...",
  foodsToAvoid: "List foods client should avoid...",
  exerciseRecommendations: "Suggest physical activities...",
  sleepHydration: "Sleep schedule and water intake goals...",
  personalizedAdvice: "Your specific recommendations for this client...",
  meals: {
    breakfast: { item: "", quantity: "", calories: "" },
    midMorningSnack: { item: "", quantity: "", calories: "" },
    lunch: { item: "", quantity: "", calories: "" },
    eveningSnack: { item: "", quantity: "", calories: "" },
    dinner: { item: "", quantity: "", calories: "" },
  },
};

function SectionCard({
  title,
  children,
  className = "",
  titleClassName = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <section className={`rounded-xl border border-[#DFDFDF] bg-white p-5 ${className}`}>
      <h2 className={`text-lg font-semibold tracking-[-0.02em] text-[#0A4833] ${titleClassName}`}>{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <label className={`mb-2 block text-xs font-medium ${light ? "text-[#E8F1ED]" : "text-[#0A4833]"}`}>{children}</label>;
}

function InputField({
  value,
  placeholder,
  onChange,
  type = "text",
  dark = false,
  icon,
}: {
  value: string;
  placeholder: string;
  onChange: (nextValue: string) => void;
  type?: string;
  dark?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="relative">
      {icon ? <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-[#B8D0C7]" : "text-[#9CA3AF]"}`}>{icon}</div> : null}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition ${
          icon ? "pl-10" : ""
        } ${
          dark
            ? "border-[#3E6B5B] bg-[#1B5A43] text-white placeholder:text-[#B8D0C7] focus:border-[#D8C092]"
            : "border-[#DFDFDF] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0A4833]"
        }`}
      />
    </div>
  );
}

function TextAreaField({
  value,
  placeholder,
  onChange,
  dark = false,
}: {
  value: string;
  placeholder: string;
  onChange: (nextValue: string) => void;
  dark?: boolean;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      rows={4}
      className={`w-full rounded-lg border p-3 text-sm outline-none transition ${
        dark
          ? "border-[#3E6B5B] bg-[#1B5A43] text-white placeholder:text-[#B8D0C7] focus:border-[#D8C092]"
          : "border-[#DFDFDF] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0A4833]"
      }`}
    />
  );
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<string | { label: string; value: string }>;
  onChange: (nextValue: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-[#DFDFDF] bg-white px-3 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#0A4833]"
      >
        {options.map((item) => {
          const option = typeof item === "string" ? { label: item, value: item } : item;
          return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
    </div>
  );
}

function ActionButton({
  children,
  href,
  variant,
  icon,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  href?: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className =
    variant === "primary"
      ? "border-[#0A4833] bg-[#0A4833] text-white hover:bg-[#083627]"
      : variant === "secondary"
        ? "border-[#9F8151] bg-[#9F8151] text-white hover:bg-[#8E7247]"
        : variant === "outline"
          ? "border-[#0A4833] bg-white text-[#0A4833] hover:bg-[#F5FAF7]"
          : "border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]";

  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${className}`}
    >
      {content}
    </button>
  );
}

export default function ConsultantDietAddPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(
    () => ({
      duration: form.duration,
      dailyCalories: form.dailyCalories ? `${form.dailyCalories} cal` : "0 cal",
      mealsPerDay: mealSections.length,
      planTitle: form.planTitle || "Weight Loss Plan",
      protein: "25%",
      carbs: "45%",
      fats: "30%",
    }),
    [form.dailyCalories, form.duration, form.planTitle]
  );

  function updateField<K extends Exclude<keyof FormState, "meals">>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateMealField(mealKey: MealKey, key: "item" | "quantity" | "calories", value: string) {
    setForm((current) => ({
      ...current,
      meals: {
        ...current.meals,
        [mealKey]: {
          ...current.meals[mealKey],
          [key]: value,
        },
      },
    }));
  }

  useEffect(() => {
    api
      .get<ClientOption[]>("/consultant/clients/")
      .then(({ data }) => {
        setClients(data);
        if (data.length > 0) {
          setForm((current) => current.clientId ? current : { ...current, clientId: String(data[0].id) });
        }
      })
      .catch(() => toast.error("Could not load clients."));
  }, []);

  const selectedClient = clients.find((client) => String(client.id) === form.clientId);

  function goalValue(label: string) {
    const map: Record<string, string> = {
      "Weight Loss": "weight_loss",
      "Muscle Gain": "muscle_gain",
      Maintenance: "maintenance",
      Detox: "general_wellness",
    };
    return map[label] ?? "general_wellness";
  }

  function durationDays(value: string) {
    return parseInt(value, 10) || 7;
  }

  function endDateFrom(startDate: string, days: number) {
    const date = new Date(`${startDate}T00:00:00`);
    date.setDate(date.getDate() + Math.max(0, days - 1));
    return date.toISOString().slice(0, 10);
  }

  async function submitDietPlan(status: "draft" | "active") {
    if (!form.clientId) { toast.error("Please select a client."); return; }
    if (!form.planTitle.trim()) { toast.error("Plan title is required."); return; }
    if (!form.startDate) { toast.error("Start date is required."); return; }

    const days = durationDays(form.duration);
    const meals = mealSections
      .map((meal, index) => {
        const entry = form.meals[meal.key];
        if (!entry.item.trim()) return null;
        return {
          meal_type: meal.key === "midMorningSnack" ? "mid_morning" : meal.key === "eveningSnack" ? "evening_snack" : meal.key,
          title: meal.label,
          calories: parseInt(entry.calories, 10) || 0,
          sort_order: index + 1,
          items: [
            {
              food_name: entry.item.trim(),
              quantity: entry.quantity.trim(),
              calories: parseInt(entry.calories, 10) || 0,
              sort_order: 1,
            },
          ],
        };
      })
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await api.post("/consultant/diet-plans/create/", {
        client: Number(form.clientId),
        title: form.planTitle.trim(),
        goal: goalValue(form.goal),
        status,
        description: form.benefitsNote,
        instructions: [form.exerciseRecommendations, form.sleepHydration, form.personalizedAdvice].filter(Boolean).join("\n\n"),
        foods_to_avoid: form.foodsToAvoid,
        recommended_foods: form.buckwheatProducts || form.buckwheatServing,
        daily_calories: parseInt(form.dailyCalories, 10) || 0,
        start_date: form.startDate,
        end_date: endDateFrom(form.startDate, days),
        duration_days: days,
        meals,
      });
      toast.success(status === "active" ? "Diet plan created." : "Draft diet plan saved.");
      router.push("/consultant/diet-plans");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail = Object.entries(data ?? {})
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
        .join(" | ");
      toast.error(detail || "Failed to create diet plan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_272px]">
          <div className="space-y-5">
            <header className="space-y-2">
              <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#0A4833]">Create Diet Plan</h1>
              <p className="text-sm text-[rgba(10,72,51,0.65)]">
                Build a personalized wellness meal plan tailored to your client&apos;s goals and lifestyle.
              </p>
            </header>

            <SectionCard title="Client Assignment">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_1fr]">
                <div>
                  <FieldLabel>Select Client</FieldLabel>
                  <SelectField
                    value={form.clientId}
                    options={clients.map((client) => ({ label: client.full_name || client.email, value: String(client.id) }))}
                    onChange={(value) => updateField("clientId", value)}
                  />
                </div>

                <div className="rounded-lg bg-[#F1E7D5] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#E3D1B5]">
                      <Image src="/recipe/recipe-3.webp" alt={selectedClient?.full_name || "Selected client"} width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0A4833]">{selectedClient?.full_name || "Select a client"}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">{selectedClient?.email || "Client details will appear here"}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="text-[#6B7280]">Diet Preference</p>
                          <p className="font-medium text-[#0A4833]">{form.goal}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#6B7280]">Allergies</p>
                          <p className="font-medium text-[#D97706]">Review notes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Plan Information">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Diet Plan Title</FieldLabel>
                  <InputField
                    value={form.planTitle}
                    placeholder="e.g., 30-Day Weight Loss Plan"
                    onChange={(value) => updateField("planTitle", value)}
                  />
                </div>
                <div>
                  <FieldLabel>Goal/Objectives</FieldLabel>
                  <SelectField value={form.goal} options={["Weight Loss", "Muscle Gain", "Maintenance", "Detox"]} onChange={(value) => updateField("goal", value)} />
                </div>
                <div>
                  <FieldLabel>Duration</FieldLabel>
                  <SelectField value={form.duration} options={["7 Days", "14 Days", "30 Days", "60 Days"]} onChange={(value) => updateField("duration", value)} />
                </div>
                <div>
                  <FieldLabel>Daily Calorie Target</FieldLabel>
                  <InputField
                    value={form.dailyCalories}
                    placeholder="1500"
                    onChange={(value) => updateField("dailyCalories", value)}
                    type="number"
                  />
                </div>
                <div>
                  <FieldLabel>Start Date</FieldLabel>
                  <InputField
                    value={form.startDate}
                    placeholder="mm/dd/yyyy"
                    onChange={(value) => updateField("startDate", value)}
                    type="date"
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <FieldLabel>Difficulty Level</FieldLabel>
                  <SelectField value={form.difficulty} options={["Beginner", "Intermediate", "Advanced"]} onChange={(value) => updateField("difficulty", value)} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Daily Meal Structure">
              <div className="space-y-4">
                {mealSections.map((meal) => (
                  <div key={meal.key} className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${meal.dotClassName}`} />
                        <p className="text-sm font-medium text-[#0A4833]">{meal.label}</p>
                      </div>
                      <span className="rounded bg-[#B69359] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.04em] text-white">
                        {meal.calorieTag}
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-[minmax(0,1.2fr)_120px_120px_96px]">
                      <InputField
                        value={form.meals[meal.key].item}
                        placeholder="Food item"
                        onChange={(value) => updateMealField(meal.key, "item", value)}
                      />
                      <InputField
                        value={form.meals[meal.key].quantity}
                        placeholder="Quantity"
                        onChange={(value) => updateMealField(meal.key, "quantity", value)}
                      />
                      <InputField
                        value={form.meals[meal.key].calories}
                        placeholder="Calories"
                        onChange={(value) => updateMealField(meal.key, "calories", value)}
                      />
                      <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0A5A43] text-white transition hover:bg-[#084634]"
                        aria-label={`Add ${meal.label}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Buckwheat Wellness Integration" className="border-[#0A5A43] bg-[#0A5A43]" titleClassName="text-white">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel light>Recommended Buckwheat Products</FieldLabel>
                  <InputField
                    value={form.buckwheatProducts}
                    placeholder=""
                    onChange={(value) => updateField("buckwheatProducts", value)}
                    dark
                  />
                </div>
                <div>
                  <FieldLabel light>Daily Buckwheat Serving</FieldLabel>
                  <InputField
                    value={form.buckwheatServing}
                    placeholder="e.g., 1 cup cooked groats"
                    onChange={(value) => updateField("buckwheatServing", value)}
                    dark
                  />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel light>Wellness Benefits Note</FieldLabel>
                  <TextAreaField
                    value={form.benefitsNote}
                    placeholder="Explain how buckwheat supports this client's specific goals..."
                    onChange={(value) => updateField("benefitsNote", value)}
                    dark
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Lifestyle & Guidance Notes">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Foods to Avoid</FieldLabel>
                  <TextAreaField value={form.foodsToAvoid} placeholder="List foods client should avoid..." onChange={(value) => updateField("foodsToAvoid", value)} />
                </div>
                <div>
                  <FieldLabel>Exercise Recommendations</FieldLabel>
                  <TextAreaField
                    value={form.exerciseRecommendations}
                    placeholder="Suggest physical activities..."
                    onChange={(value) => updateField("exerciseRecommendations", value)}
                  />
                </div>
                <div>
                  <FieldLabel>Sleep &amp; Hydration</FieldLabel>
                  <TextAreaField
                    value={form.sleepHydration}
                    placeholder="Sleep schedule and water intake goals..."
                    onChange={(value) => updateField("sleepHydration", value)}
                  />
                </div>
                <div>
                  <FieldLabel>Personalized Consultant Advice</FieldLabel>
                  <TextAreaField
                    value={form.personalizedAdvice}
                    placeholder="Your specific recommendations for this client..."
                    onChange={(value) => updateField("personalizedAdvice", value)}
                  />
                </div>
              </div>
            </SectionCard>

            <div className="flex flex-wrap gap-3">
              <ActionButton variant="primary" icon={<Check className="h-4 w-4" />} onClick={() => submitDietPlan("active")} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Diet Plan"}
              </ActionButton>
              <ActionButton variant="secondary" icon={<Save className="h-4 w-4" />} onClick={() => submitDietPlan("draft")} disabled={isSubmitting}>
                Save as Draft
              </ActionButton>
              <ActionButton variant="outline" icon={<Eye className="h-4 w-4" />}>
                Preview Plan
              </ActionButton>
              <ActionButton variant="ghost" href="/consultant/diet-plans" icon={<X className="h-4 w-4" />}>
                Cancel
              </ActionButton>
            </div>
          </div>

          <aside className="xl:pt-8">
            <div className="sticky top-24 rounded-xl border border-[#DFDFDF] bg-white p-6">
              <h3 className="text-lg font-semibold text-[#0A4833]">Plan Preview</h3>

              <div className="mt-5 border-b border-[#E5E7EB] pb-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#E3D1B5]">
                  <Image src="/recipe/recipe-3.webp" alt="Emily Chen" width={64} height={64} className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0A4833]">{selectedClient?.full_name || "No client selected"}</p>
                <p className="mt-1 text-xs text-[#6B7280]">{preview.planTitle}</p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6B7280]">Duration:</span>
                  <span className="font-medium text-[#111827]">{preview.duration}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6B7280]">Daily Calories:</span>
                  <span className="font-medium text-[#9F8151]">{preview.dailyCalories}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6B7280]">Meals/Day:</span>
                  <span className="font-medium text-[#111827]">{preview.mealsPerDay}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6B7280]">Buckwheat Focus:</span>
                  <span className="font-medium text-[#0A4833]">Yes</span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#E5E7EB] pt-5">
                <p className="text-sm font-medium text-[#0A4833]">Nutrition Breakdown</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Protein:</span>
                    <span className="font-medium">{preview.protein}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Carbs:</span>
                    <span className="font-medium">{preview.carbs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fats:</span>
                    <span className="font-medium">{preview.fats}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-[#F1E7D5] px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#0A4833]">Status</span>
                  <span className="inline-flex items-center rounded bg-[#FFEDD5] px-2 py-1 text-xs font-medium text-[#9A3412]">Draft</span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-[#F8FAF9] p-3 text-xs text-[#4B5563]">
                <div className="flex items-center gap-2 text-[#0A4833]">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Simple preview</span>
                </div>
                <p className="mt-2">This form stays lightweight and is ready to pass client diet details later.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
