"use client";

import { useEffect, useMemo, useState } from "react";
import NoteDetailsPanel from "@/components/consultant/notes/NoteDetailsPanel";
import NotesList from "@/components/consultant/notes/NotesList";
import NotesStatsAndFilters from "@/components/consultant/notes/NotesStatsAndFilters";
import type { NotesStats } from "@/components/consultant/notes/NotesStatsAndFilters";
import type { BackendNoteItem, NoteStatus } from "@/components/consultant/notes/noteTypes";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

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
  note_type?: string;
  priority_level?: string;
  status?: string;
  note_status?: string;
  tags?: string;
  updated_at: string;
  created_at: string;
};

function mediaUrl(value?: string | null) {
  return value ? getImageUrl(value) : "";
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

function noteStatus(item: ApiNote): NoteStatus {
  if (isPendingReview(item)) return "Pending Review";
  if (item.follow_up_date) return "Follow-up Required";
  return "Completed";
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
    status: noteStatus(item),
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

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

function isSameCalendarDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function matchesDateFilter(note: ApiNote, filter: string) {
  if (filter === "All Dates") return true;
  if (filter === "Has Follow-up") return Boolean(note.follow_up_date);

  const date = new Date(note.created_at);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  if (filter === "Today") return isSameCalendarDate(date, now);
  if (filter === "Last 7 Days") {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return date.getTime() >= sevenDaysAgo;
  }
  if (filter === "This Month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  return true;
}

function searchableText(note: ApiNote) {
  return [
    note.client_name,
    note.title,
    note.summary,
    note.observations,
    note.recommendations,
    note.food_restrictions,
    note.follow_up_instructions,
    note.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function ConsultantNotesPage() {
  const [apiNotes, setApiNotes] = useState<ApiNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<BackendNoteItem | null>(null);
  const noteStats = useMemo(() => calculateStats(apiNotes), [apiNotes]);
  const [searchValue, setSearchValue] = useState("");
  const [clientValue, setClientValue] = useState("All Clients");
  const [dateValue, setDateValue] = useState("All Dates");
  const [typeValue, setTypeValue] = useState("All Types");
  const [statusValue, setStatusValue] = useState("All Status");

  const clientOptions = useMemo(() => uniqueSorted(apiNotes.map((note) => note.client_name || "Client")), [apiNotes]);
  const typeOptions = useMemo(() => uniqueSorted(apiNotes.map((note) => note.note_type || "")), [apiNotes]);
  const statusOptions = useMemo(() => uniqueSorted(apiNotes.map(noteStatus)), [apiNotes]);

  const filteredNotes = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return apiNotes
      .filter((note) => {
        const matchesSearch = !query || searchableText(note).includes(query);
        const matchesClient = clientValue === "All Clients" || (note.client_name || "Client") === clientValue;
        const matchesDate = matchesDateFilter(note, dateValue);
        const matchesType = typeValue === "All Types" || note.note_type === typeValue;
        const matchesStatus = statusValue === "All Status" || noteStatus(note) === statusValue;

        return matchesSearch && matchesClient && matchesDate && matchesType && matchesStatus;
      })
      .map(mapNote);
  }, [apiNotes, clientValue, dateValue, searchValue, statusValue, typeValue]);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiNote[]>("/consultant/notes/")
      .then(({ data }) => {
        if (!isMounted) return;
        const notes = Array.isArray(data) ? data : [];
        const mappedNotes = notes.map(mapNote);
        setApiNotes(notes);
        setSelectedNote(mappedNotes[0] ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiNotes([]);
        setSelectedNote(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedNote((current) => {
      if (current && filteredNotes.some((note) => note.id === current.id)) return current;
      return filteredNotes[0] ?? null;
    });
  }, [filteredNotes]);

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <NotesStatsAndFilters
          stats={noteStats}
          searchValue={searchValue}
          clientValue={clientValue}
          dateValue={dateValue}
          typeValue={typeValue}
          statusValue={statusValue}
          clientOptions={clientOptions}
          typeOptions={typeOptions}
          statusOptions={statusOptions}
          onSearchChange={setSearchValue}
          onClientChange={setClientValue}
          onDateChange={setDateValue}
          onTypeChange={setTypeValue}
          onStatusChange={setStatusValue}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_384px]">
          {filteredNotes.length > 0 ? (
            <>
              <NotesList notes={filteredNotes} selectedNoteId={selectedNote?.id ?? ""} onSelect={setSelectedNote} />
              {selectedNote ? <NoteDetailsPanel note={selectedNote} /> : null}
            </>
          ) : (
            <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280] xl:col-span-2">
              No notes match the selected filters.
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
