"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddNoteHeader from "@/components/consultant/notes/add/AddNoteHeader";
import ClientConsultationReferenceSection from "@/components/consultant/notes/add/ClientConsultationReferenceSection";
import NoteFormSection from "@/components/consultant/notes/add/NoteFormSection";
import type { AddNoteFormState, NoteClientOption } from "@/components/consultant/notes/add/formTypes";

const backendClients: NoteClientOption[] = [
  {
    id: "user-001",
    name: "Emma Richardson",
    avatar: "/recipe/recipe-2.webp",
    consultationId: "CONS-2024-1847",
    sessionDate: "Jan 16, 2024",
    sessionMode: "Video Call",
    sessionTime: "11:00 AM",
    wellnessGoal: "Weight Management",
    focusArea: "Follow-up Session",
    consultant: "Dr. Sarah Wilson",
  },
  {
    id: "user-002",
    name: "Michael Chen",
    avatar: "/recipe/recipe-3.webp",
    consultationId: "CONS-2024-1759",
    sessionDate: "Jan 18, 2024",
    sessionMode: "Phone Call",
    sessionTime: "2:30 PM",
    wellnessGoal: "Digestive Health",
    focusArea: "Diet Revision",
    consultant: "Dr. Sarah Wilson",
  },
];

const availableTags = [
  "Weight Management",
  "Digestive Health",
  "Balanced Nutrition",
  "Low Energy",
  "Lifestyle Change",
  "Follow-up Needed",
];

const initialFormState: AddNoteFormState = {
  userId: "user-001",
  noteTitle: "e.g., This 3 Progress Review - Digestive Improvement",
  noteType: "Initial Consultation",
  sessionDate: "2024-07-19",
  sessionMode: "Video Call",
  priorityLevel: "Low",
  currentMood: "Calm",
  sessionSummary: "Provide a brief overview of the consultation session...",
  keyObservation: "Note any significant observations about client's progress, behavior, or health status...",
  nutritionObservation: "List concerns addressed during session...",
  foodHabitObservation: "Document current eating patterns and habits...",
  lifestyleObservation: "Note any lifestyle factors affecting wellness...",
  clientProgressNotes: "Document progress since last consultation...",
  foodsToInclude: "Recommended foods and ingredients...",
  foodsToAvoid: "Foods to limit or eliminate...",
  buckwheatRecommendation: "Specific buckwheat products and usage guidance...",
  mealTimingAdvice: "Optimal meal timing and frequency...",
  waterIntakeAdvice: "Daily water consumption recommendations...",
  additionalDietaryGuidance: "Additional dietary guidance and nutritional advice...",
  allergies: "List known allergies...",
  dietaryRestrictions: "Vegetarian, vegan, religious restrictions...",
  medicalConditions: "Important health considerations or medical conditions...",
  sensitivities: "Food sensitivities or intolerances...",
  specialReminders: "Important notes to remember...",
  nextConsultationRecommendation: "1 week",
  followUpDate: "mm/dd/yyyy",
  actionItemsForClient: "Tasks and actions client should complete before next session...",
  progressChecksRequired: "Specific metrics or progress to monitor...",
  dietPlanUpdateNeeded: "Note if diet plan revision required...",
  additionalMonitoringNote: "Other follow-up or monitoring requirements...",
  internalNotes: "Add consultant-only observations, sensitive notes, or internal comments...",
  tags: ["Weight Management", "Digestive Health", "Follow-up Needed"],
};

export default function ConsultantAddNotePage() {
  const router = useRouter();
  const [form, setForm] = useState<AddNoteFormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState("");
  const clientsFromBackend = useMemo(() => backendClients, []);
  const selectedClient = useMemo(
    () => clientsFromBackend.find((client) => client.id === form.userId) ?? clientsFromBackend[0],
    [clientsFromBackend, form.userId]
  );

  function updateField<K extends keyof AddNoteFormState>(field: K, value: AddNoteFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleTag(tag: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag],
    }));
  }

  function handleSave() {
    const payloadForBackend = {
      userId: form.userId,
      noteTitle: form.noteTitle,
      noteType: form.noteType,
      sessionDate: form.sessionDate,
      sessionMode: form.sessionMode,
      priorityLevel: form.priorityLevel,
      currentMood: form.currentMood,
      sessionSummary: form.sessionSummary,
      keyObservation: form.keyObservation,
      nutritionObservation: form.nutritionObservation,
      foodHabitObservation: form.foodHabitObservation,
      lifestyleObservation: form.lifestyleObservation,
      clientProgressNotes: form.clientProgressNotes,
      foodsToInclude: form.foodsToInclude,
      foodsToAvoid: form.foodsToAvoid,
      buckwheatRecommendation: form.buckwheatRecommendation,
      mealTimingAdvice: form.mealTimingAdvice,
      waterIntakeAdvice: form.waterIntakeAdvice,
      additionalDietaryGuidance: form.additionalDietaryGuidance,
      allergies: form.allergies,
      dietaryRestrictions: form.dietaryRestrictions,
      medicalConditions: form.medicalConditions,
      sensitivities: form.sensitivities,
      specialReminders: form.specialReminders,
      nextConsultationRecommendation: form.nextConsultationRecommendation,
      followUpDate: form.followUpDate,
      actionItemsForClient: form.actionItemsForClient,
      progressChecksRequired: form.progressChecksRequired,
      dietPlanUpdateNeeded: form.dietPlanUpdateNeeded,
      additionalMonitoringNote: form.additionalMonitoringNote,
      internalNotes: form.internalNotes,
      tags: form.tags,
    };

    console.log("Add note payload", payloadForBackend);
    setStatusMessage("Note form data is ready to pass to the backend.");
    window.setTimeout(() => router.push("/consultant/notes"), 900);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <AddNoteHeader onSave={handleSave} />
        <ClientConsultationReferenceSection
          clients={clientsFromBackend}
          selectedClient={selectedClient}
          form={form}
          onFieldChange={updateField}
        />
        <NoteFormSection form={form} onFieldChange={updateField} availableTags={availableTags} onToggleTag={toggleTag} />

        {statusMessage ? (
          <div className="rounded-[10px] border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm text-[#0A4833]">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </main>
  );
}
