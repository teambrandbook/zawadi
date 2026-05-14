"use client";

import { useEffect, useMemo, useState } from "react";
import NoteDetailsPanel from "@/components/consultant/notes/NoteDetailsPanel";
import NotesList from "@/components/consultant/notes/NotesList";
import NotesStatsAndFilters from "@/components/consultant/notes/NotesStatsAndFilters";
import type { NotesStats } from "@/components/consultant/notes/NotesStatsAndFilters";
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
  status?: string;
  note_status?: string;
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

function isRecentNote(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return date.getTime() >= sevenDaysAgo;
}

function isPendingReview(item: ApiNote) {
  const status = String(item.status ?? item.note_status ?? "").toLowerCase();
  return status.includes("pending") && status.includes("review");
}

function calculateStats(notes: ApiNote[]): NotesStats {
  return {
    total: notes.length,
    recent: notes.filter((item) => isRecentNote(item.created_at)).length,
    followUp: notes.filter((item) => Boolean(item.follow_up_date)).length,
    pendingReview: notes.filter(isPendingReview).length,
  };
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

export default function ConsultantNotesPage() {
  const [notesFromBackend, setNotesFromBackend] = useState<BackendNoteItem[]>([]);
  const [apiNotes, setApiNotes] = useState<ApiNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<BackendNoteItem | null>(null);
  const noteStats = useMemo(() => calculateStats(apiNotes), [apiNotes]);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiNote[]>("/consultant/notes/")
      .then(({ data }) => {
        if (!isMounted) return;
        const notes = Array.isArray(data) ? data : [];
        const mappedNotes = notes.map(mapNote);
        setApiNotes(notes);
        setNotesFromBackend(mappedNotes);
        setSelectedNote(mappedNotes[0] ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiNotes([]);
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
        <NotesStatsAndFilters stats={noteStats} />

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
