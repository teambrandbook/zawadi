"use client";

import { Calendar, Check, Clock3, Heart } from "lucide-react";
import HealthDetailsInfoPanel from "./HealthDetailsInfoPanel";

type HealthDetails = {
  primaryWellnessGoal: string;
  mainConcern: string;
  dietPreferences: string[];
  allergies: string;
  lifestyle: string;
  buckwheatGoals: string;
  additionalMessage: string;
};

type Props = {
  value: HealthDetails;
  onChange: <K extends keyof HealthDetails>(field: K, fieldValue: HealthDetails[K]) => void;
  onContinue: () => void;
  onBack: () => void;
  selectedDate: string;
  selectedTime: string;
  sessionType: string;
};

const primaryGoalOptions = [
  "Weight Loss",
  "Better Digestion",
  "Balanced Nutrition",
  "Energy Improvement",
  "Fitness Support",
  "General Wellness",
];

const dietPreferenceOptions = [
  "Vegetarian",
  "Vegan",
  "High Protein",
  "Gluten-Free",
  "Mixed Diet",
  "No Preference",
];

const fieldClass =
  "w-full rounded-lg border border-[#D9DDDA] bg-[#EEF0EE] px-3 py-2.5 text-sm text-[#0A4833] placeholder:text-[#6F7B75] outline-none focus:border-[#0A5A3F] focus:bg-white";

function ChoiceChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium transition ${
        isActive
          ? "border-[#A88751] bg-[#FFF8ED] text-[#0A4833]"
          : "border-[#D6DBD8] bg-white text-[#355248] hover:bg-[#F4F7F5]"
      }`}
    >
      {isActive && <Check className="mr-1.5 h-3.5 w-3.5 text-[#0A5A3F]" />}
      {label}
    </button>
  );
}

export default function HealthDetailsSection({
  value,
  onChange,
  onContinue,
  onBack,
  selectedDate,
  selectedTime,
  sessionType,
}: Props) {
  function toggleDietPreference(preference: string) {
    if (value.dietPreferences.includes(preference)) {
      onChange(
        "dietPreferences",
        value.dietPreferences.filter((item) => item !== preference)
      );
      return;
    }
    onChange("dietPreferences", [...value.dietPreferences, preference]);
  }

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#E0E4E1] bg-white p-4">
            <h2 className="text-lg font-semibold text-[#0A4833]">Your Selection</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-[#E6EAE7] bg-[#F8FAF8] p-2.5">
                <p className="mb-1 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <Calendar className="h-3.5 w-3.5" /> Date
                </p>
                <p className="font-medium text-[#0A4833]">{selectedDate}</p>
              </div>
              <div className="rounded-lg border border-[#E6EAE7] bg-[#F8FAF8] p-2.5">
                <p className="mb-1 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <Clock3 className="h-3.5 w-3.5" /> Time
                </p>
                <p className="font-medium text-[#0A4833]">{selectedTime}</p>
              </div>
              <div className="rounded-lg border border-[#E6EAE7] bg-[#F8FAF8] p-2.5">
                <p className="mb-1 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <Heart className="h-3.5 w-3.5" /> Session
                </p>
                <p className="font-medium text-[#0A4833]">{sessionType}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E0E4E1] bg-white p-4">
            <h3 className="text-lg font-semibold text-[#0A4833]">Your Wellness Information</h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Primary Wellness Goal</label>
                <div className="flex flex-wrap gap-2">
                  {primaryGoalOptions.map((goal) => (
                    <ChoiceChip
                      key={goal}
                      label={goal}
                      isActive={value.primaryWellnessGoal === goal}
                      onClick={() => onChange("primaryWellnessGoal", goal)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Main Concern or Focus Area</label>
                <input
                  className={fieldClass}
                  value={value.mainConcern}
                  onChange={(e) => onChange("mainConcern", e.target.value)}
                  placeholder="e.g. Managing stress eating, improving gut health..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Current Diet Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {dietPreferenceOptions.map((option) => (
                    <ChoiceChip
                      key={option}
                      label={option}
                      isActive={value.dietPreferences.includes(option)}
                      onClick={() => toggleDietPreference(option)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Allergies or Dietary Restrictions</label>
                <input
                  className={fieldClass}
                  value={value.allergies}
                  onChange={(e) => onChange("allergies", e.target.value)}
                  placeholder="e.g. Dairy, nuts, shellfish..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Lifestyle & Activity Level</label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={value.lifestyle}
                  onChange={(e) => onChange("lifestyle", e.target.value)}
                  placeholder="Tell us about your daily routine, exercise habits, work schedule..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Your Buckwheat Journey & Goals</label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={value.buckwheatGoals}
                  onChange={(e) => onChange("buckwheatGoals", e.target.value)}
                  placeholder="Share your interest in buckwheat, how you currently use it, or what you'd like to learn..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0A4833]">Additional Message for Your Nutritionist</label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={value.additionalMessage}
                  onChange={(e) => onChange("additionalMessage", e.target.value)}
                  placeholder="Any specific questions or topics you'd like to discuss during the consultation..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex h-11 min-w-[220px] items-center justify-center rounded-lg bg-[#0A5A3F] px-5 text-sm font-medium text-white hover:bg-[#084430]"
            >
              Continue to Confirmation
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 min-w-[100px] items-center justify-center rounded-lg border border-[#D6DBD8] bg-white px-4 text-sm font-medium text-[#355248]"
            >
              Back
            </button>
          </div>
        </div>

        <HealthDetailsInfoPanel
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>
    </section>
  );
}

export type { HealthDetails };
