"use client";

import { useMemo, useState } from "react";
import NoteDetailsPanel from "@/components/consultant/notes/NoteDetailsPanel";
import NotesList from "@/components/consultant/notes/NotesList";
import NotesStatsAndFilters from "@/components/consultant/notes/NotesStatsAndFilters";
import type { BackendNoteItem } from "@/components/consultant/notes/noteTypes";

const backendNotes: BackendNoteItem[] = [
  {
    id: "note-sarah",
    clientName: "Sarah Johnson",
    clientAvatar: "/recipe/recipe-2.webp",
    noteDate: "March 15, 2024",
    title: "Initial Buckwheat Nutrition Assessment",
    summary: "Digestive concerns, gluten sensitivity, weight management goals",
    lastUpdated: "2 hours ago",
    status: "Follow-up Required",
    clientSummary: {
      age: "32",
      gender: "Female",
      goals: "Weight management, digestive health improvement, gluten-free lifestyle",
    },
    sessionObservations: [
      "Client reports improved energy levels with buckwheat breakfast routine",
      "Digestive symptoms reduced by 60% over past 2 weeks",
      "Requesting more buckwheat recipe variations",
    ],
    foodRestrictions: ["Gluten", "Dairy", "Tree Nuts"],
    recommendations: [
      "Continue buckwheat porridge 3x weekly, introduce buckwheat flour for baking alternatives",
      "Supplement with probiotics to support digestive health",
    ],
    followUpInstructions: [
      "Schedule follow-up in 2 weeks to assess progress",
      "Send buckwheat recipe collection via email",
    ],
  },
  {
    id: "note-michael",
    clientName: "Michael Chen",
    clientAvatar: "/recipe/recipe-3.webp",
    noteDate: "March 14, 2024",
    title: "Buckwheat Diet Progress Review",
    summary: "Blood sugar improvement, energy levels, meal planning",
    lastUpdated: "1 day ago",
    status: "Completed",
    clientSummary: {
      age: "40",
      gender: "Male",
      goals: "Blood sugar control, sustainable meal planning, improved daily energy",
    },
    sessionObservations: [
      "Maintaining stable meal timings through the week",
      "Reported better satiety after switching to buckwheat lunches",
      "Needs more variety for evening snacks",
    ],
    foodRestrictions: ["Refined Sugar", "High Sodium"],
    recommendations: [
      "Keep lunch fiber-focused with vegetables and buckwheat base",
      "Rotate seeds and fruit bowls as evening snack alternatives",
    ],
    followUpInstructions: [
      "Review glucose logs in next consultation",
      "Share one-week meal planner PDF",
    ],
  },
  {
    id: "note-emma",
    clientName: "Emma Wilson",
    clientAvatar: "/recipe/recipe-4.webp",
    noteDate: "March 13, 2024",
    title: "Buckwheat Allergy Assessment",
    summary: "Allergic reactions, alternative grains, meal modifications",
    lastUpdated: "2 days ago",
    status: "Pending Review",
    clientSummary: {
      age: "29",
      gender: "Female",
      goals: "Reduce allergic triggers, improve digestion, create safe meal swaps",
    },
    sessionObservations: [
      "Possible sensitivity from packaged buckwheat mix rather than whole grain",
      "Symptoms reduced after removing flavored additives",
      "Client wants simpler shopping guidance",
    ],
    foodRestrictions: ["Artificial Flavoring", "Dairy", "Tree Nuts"],
    recommendations: [
      "Use plain buckwheat groats and test small portions with symptom tracking",
      "Pair meals with low-irritant vegetables and mild proteins",
    ],
    followUpInstructions: [
      "Send ingredient label checklist",
      "Schedule symptom review after 10 days",
    ],
  },
];

export default function ConsultantNotesPage() {
  const notesFromBackend = useMemo(() => backendNotes, []);
  const [selectedNote, setSelectedNote] = useState<BackendNoteItem>(notesFromBackend[0]);

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotesStatsAndFilters />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_384px]">
          <NotesList notes={notesFromBackend} selectedNoteId={selectedNote.id} onSelect={setSelectedNote} />
          <NoteDetailsPanel note={selectedNote} />
        </div>
      </div>
    </main>
  );
}
