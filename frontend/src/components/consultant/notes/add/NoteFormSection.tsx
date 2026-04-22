"use client";

import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, ClipboardPlus, HeartPulse, Salad, ShieldAlert, Tags } from "lucide-react";
import type { AddNoteFormState } from "./formTypes";

type Props = {
  form: AddNoteFormState;
  onFieldChange: <K extends keyof AddNoteFormState>(field: K, value: AddNoteFormState[K]) => void;
  availableTags: string[];
  onToggleTag: (tag: string) => void;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-[#0A4833]">{children}</label>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`h-12 w-full rounded-[8px] border border-[#DFDFDF] px-4 text-sm outline-none ${
        readOnly ? "bg-[#DFDFDF] text-[#4B5563]" : "bg-[#EBE1CF] text-[#111827]"
      }`}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[8px] border border-[#DFDFDF] bg-[#EBE1CF] px-4 py-3 text-sm text-[#111827] outline-none"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-[8px] border border-[#DFDFDF] bg-[#EBE1CF] px-4 pr-10 text-sm text-[#111827] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
    </div>
  );
}

function SectionShell({
  title,
  icon,
  children,
  subtitle,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-[#0A4833]">{title}</h2>
      </div>
      {subtitle ? <p className="mt-2 text-sm text-[#6B7280]">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function NoteFormSection({ form, onFieldChange, availableTags, onToggleTag }: Props) {
  return (
    <div className="space-y-6">
      <SectionShell title="Basic Note Information" icon={<ClipboardPlus className="h-4 w-4 text-[#0A4833]" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <FieldLabel>Note Title</FieldLabel>
            <TextInput
              value={form.noteTitle}
              onChange={(value) => onFieldChange("noteTitle", value)}
              placeholder="e.g., This 3 Progress Review - Digestive Improvement"
            />
          </div>
          <div>
            <FieldLabel>Note Type</FieldLabel>
            <SelectField
              value={form.noteType}
              onChange={(value) => onFieldChange("noteType", value)}
              options={["Initial Consultation", "Progress Review", "Follow-up", "Diet Revision"]}
            />
          </div>
          <div>
            <FieldLabel>Session Date</FieldLabel>
            <div className="relative">
              <TextInput value={form.sessionDate} onChange={(value) => onFieldChange("sessionDate", value)} placeholder="mm/dd/yyyy" />
              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            </div>
          </div>
          <div>
            <FieldLabel>Priority Level</FieldLabel>
            <SelectField value={form.priorityLevel} onChange={(value) => onFieldChange("priorityLevel", value)} options={["Low", "Medium", "High"]} />
          </div>
          <div>
            <FieldLabel>Current Mood</FieldLabel>
            <SelectField value={form.currentMood} onChange={(value) => onFieldChange("currentMood", value)} options={["Calm", "Neutral", "Concerned"]} />
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Main Consultation Notes" icon={<HeartPulse className="h-4 w-4 text-[#0A4833]" />}>
        <div className="space-y-4">
          <div>
            <FieldLabel>Session Summary</FieldLabel>
            <TextArea value={form.sessionSummary} onChange={(value) => onFieldChange("sessionSummary", value)} placeholder="Provide a brief overview of the consultation session..." />
          </div>
          <div>
            <FieldLabel>Key Observation</FieldLabel>
            <TextArea value={form.keyObservation} onChange={(value) => onFieldChange("keyObservation", value)} placeholder="Note any significant observations about client's progress, behavior, or health status..." />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>Nutrition Observations Observed</FieldLabel>
              <TextArea rows={3} value={form.nutritionObservation} onChange={(value) => onFieldChange("nutritionObservation", value)} placeholder="List concerns addressed during session..." />
            </div>
            <div>
              <FieldLabel>Food Habits Observed</FieldLabel>
              <TextArea rows={3} value={form.foodHabitObservation} onChange={(value) => onFieldChange("foodHabitObservation", value)} placeholder="Document current eating patterns and habits..." />
            </div>
            <div>
              <FieldLabel>Lifestyle Concerns</FieldLabel>
              <TextArea rows={3} value={form.lifestyleObservation} onChange={(value) => onFieldChange("lifestyleObservation", value)} placeholder="Note any lifestyle factors affecting wellness..." />
            </div>
            <div>
              <FieldLabel>Client Progress Notes</FieldLabel>
              <TextArea rows={3} value={form.clientProgressNotes} onChange={(value) => onFieldChange("clientProgressNotes", value)} placeholder="Document progress since last consultation..." />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Diet & Nutrition Recommendations" icon={<Salad className="h-4 w-4 text-[#0A4833]" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <FieldLabel>Foods to Include</FieldLabel>
            <TextArea rows={3} value={form.foodsToInclude} onChange={(value) => onFieldChange("foodsToInclude", value)} placeholder="Recommended foods and ingredients..." />
          </div>
          <div>
            <FieldLabel>Foods to Avoid</FieldLabel>
            <TextArea rows={3} value={form.foodsToAvoid} onChange={(value) => onFieldChange("foodsToAvoid", value)} placeholder="Foods to limit or eliminate..." />
          </div>
          <div className="lg:col-span-2">
            <FieldLabel>Buckwheat Recommendation</FieldLabel>
            <TextArea rows={3} value={form.buckwheatRecommendation} onChange={(value) => onFieldChange("buckwheatRecommendation", value)} placeholder="Specific buckwheat products and usage guidance..." />
          </div>
          <div>
            <FieldLabel>Meal Timing Advice</FieldLabel>
            <TextArea rows={3} value={form.mealTimingAdvice} onChange={(value) => onFieldChange("mealTimingAdvice", value)} placeholder="Optimal meal timing and frequency..." />
          </div>
          <div>
            <FieldLabel>Water Intake Advice</FieldLabel>
            <TextArea rows={3} value={form.waterIntakeAdvice} onChange={(value) => onFieldChange("waterIntakeAdvice", value)} placeholder="Daily water consumption recommendations..." />
          </div>
          <div className="lg:col-span-2">
            <FieldLabel>Additional Specific Suggestions</FieldLabel>
            <TextArea rows={3} value={form.additionalDietaryGuidance} onChange={(value) => onFieldChange("additionalDietaryGuidance", value)} placeholder="Additional dietary guidance and nutritional advice..." />
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Health & Restriction Notes" icon={<ShieldAlert className="h-4 w-4 text-[#0A4833]" />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <FieldLabel>Allergies</FieldLabel>
            <TextInput value={form.allergies} onChange={(value) => onFieldChange("allergies", value)} placeholder="List known allergies..." />
          </div>
          <div>
            <FieldLabel>Dietary Restrictions</FieldLabel>
            <TextInput value={form.dietaryRestrictions} onChange={(value) => onFieldChange("dietaryRestrictions", value)} placeholder="Vegetarian, vegan, religious restrictions..." />
          </div>
          <div>
            <FieldLabel>Medical Conditions</FieldLabel>
            <TextInput value={form.medicalConditions} onChange={(value) => onFieldChange("medicalConditions", value)} placeholder="Important health considerations or medical conditions..." />
          </div>
          <div>
            <FieldLabel>Sensitivities</FieldLabel>
            <TextInput value={form.sensitivities} onChange={(value) => onFieldChange("sensitivities", value)} placeholder="Food sensitivities or intolerances..." />
          </div>
          <div className="lg:col-span-2">
            <FieldLabel>Special Reminders</FieldLabel>
            <TextInput value={form.specialReminders} onChange={(value) => onFieldChange("specialReminders", value)} placeholder="Important notes to remember..." />
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Follow-up Instructions" icon={<CalendarDays className="h-4 w-4 text-[#0A4833]" />}>
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>Next Consultation Recommendation</FieldLabel>
              <SelectField
                value={form.nextConsultationRecommendation}
                onChange={(value) => onFieldChange("nextConsultationRecommendation", value)}
                options={["1 week", "2 weeks", "1 month"]}
              />
            </div>
            <div>
              <FieldLabel>Follow-up Date</FieldLabel>
              <div className="relative">
                <TextInput value={form.followUpDate} onChange={(value) => onFieldChange("followUpDate", value)} placeholder="mm/dd/yyyy" />
                <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              </div>
            </div>
          </div>
          <div>
            <FieldLabel>Action Items for Client</FieldLabel>
            <TextArea value={form.actionItemsForClient} onChange={(value) => onFieldChange("actionItemsForClient", value)} placeholder="Tasks and actions client should complete before next session..." />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>Progress Checks Required</FieldLabel>
              <TextArea rows={3} value={form.progressChecksRequired} onChange={(value) => onFieldChange("progressChecksRequired", value)} placeholder="Specific metrics or progress to monitor..." />
            </div>
            <div>
              <FieldLabel>Diet Plan Update Needed</FieldLabel>
              <TextArea rows={3} value={form.dietPlanUpdateNeeded} onChange={(value) => onFieldChange("dietPlanUpdateNeeded", value)} placeholder="Note if diet plan revision required..." />
            </div>
          </div>
          <div>
            <FieldLabel>Additional Monitoring Note</FieldLabel>
            <TextArea rows={3} value={form.additionalMonitoringNote} onChange={(value) => onFieldChange("additionalMonitoringNote", value)} placeholder="Other follow-up or monitoring requirements..." />
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Internal Notes / Private Remarks"
        icon={<ClipboardPlus className="h-4 w-4 text-[#0A4833]" />}
        subtitle="These notes are only visible to you and other consultants. Not shared with the client."
      >
        <TextArea value={form.internalNotes} onChange={(value) => onFieldChange("internalNotes", value)} placeholder="Add consultant-only observations, sensitive notes, or internal comments..." />
      </SectionShell>

      <SectionShell title="Tags / Wellness Labels" icon={<Tags className="h-4 w-4 text-[#0A4833]" />}>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = form.tags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  active ? "bg-[#9F8151] text-white" : "bg-[#DFDFDF] text-[#374151]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}
