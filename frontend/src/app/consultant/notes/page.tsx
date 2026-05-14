"use client";

import { useEffect, useState } from "react";
import NoteDetailsPanel from "@/components/consultant/notes/NoteDetailsPanel";
import NotesList from "@/components/consultant/notes/NotesList";
import NotesStatsAndFilters from "@/components/consultant/notes/NotesStatsAndFilters";
import type { BackendNoteItem } from "@/components/consultant/notes/noteTypes";
import api from "@/services/api";

type ApiNote = {
  id: number;
  client_name: string;
  client_photo?: string | null;
  title: string;
  summary: string;
  observations: string;
  recommendations: string;
  food_restrictions: string;
  follow_up_instructions: string;
  follow_up_date?: string | null;
  priority_level?: string;
  tags?: string;
  updated_at: string;
  created_at: string;
};

function getApiOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return apiBase.replace(/\/api\/?$/, "");
}

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-2.webp";
  if (value.startsWith("http")) return value;
  return `${getApiOrigin()}${value.startsWith("/") ? "" : "/"}${value}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function splitLines(value?: string) {
  return String(value ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapNote(item: ApiNote): BackendNoteItem {
  return {
    id: String(item.id),
    clientName: item.client_name || "Client",
    clientAvatar: mediaUrl(item.client_photo),
    noteDate: formatDate(item.created_at),
    title: item.title,
    summary: item.summary || "No summary added",
    lastUpdated: formatDate(item.updated_at),
    status: item.follow_up_date ? "Follow-up Required" : "Completed",
    clientSummary: {
      age: "-",
      gender: "-",
      goals: item.tags || "-",
    },
    sessionObservations: splitLines(item.observations),
    foodRestrictions: splitLines(item.food_restrictions),
    recommendations: splitLines(item.recommendations),
    followUpInstructions: splitLines(item.follow_up_instructions),
  };
}

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
  const [notesFromBackend, setNotesFromBackend] = useState<BackendNoteItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<BackendNoteItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiNote[]>("/consultant/notes/")
      .then(({ data }) => {
        if (!isMounted) return;
        const mappedNotes = Array.isArray(data) ? data.map(mapNote) : [];
        setNotesFromBackend(mappedNotes);
        setSelectedNote(mappedNotes[0] ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotesFromBackend([]);
        setSelectedNote(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotesStatsAndFilters />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_384px]">
          {notesFromBackend.length > 0 ? (
            <>
              <NotesList notes={notesFromBackend} selectedNoteId={selectedNote?.id ?? ""} onSelect={setSelectedNote} />
              {selectedNote ? <NoteDetailsPanel note={selectedNote} /> : null}
            </>
          ) : (
            <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280] xl:col-span-2">
              No notes found. Add a note from an approved client consultation.
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
