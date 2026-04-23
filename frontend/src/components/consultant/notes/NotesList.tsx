"use client";

import Image from "next/image";
import { CalendarDays, Eye, Pencil, UtensilsCrossed } from "lucide-react";
import type { BackendNoteItem, NoteStatus } from "./noteTypes";

function getStatusTone(status: NoteStatus) {
  if (status === "Follow-up Required") return "text-[#A88751]";
  if (status === "Completed") return "text-[#16A34A]";
  return "text-[#DC2626]";
}

type Props = {
  notes: BackendNoteItem[];
  selectedNoteId: string;
  onSelect: (note: BackendNoteItem) => void;
};

export default function NotesList({ notes, selectedNoteId, onSelect }: Props) {
  return (
    <section className="space-y-4">
      {notes.map((note) => (
        <article
          key={note.id}
          onClick={() => onSelect(note)}
          className={`cursor-pointer rounded-[12px] border bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition ${
            selectedNoteId === note.id ? "border-[#CDB996] ring-2 ring-[#F3EBDD]" : "border-[#DFDFDF]"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-[#E5E7EB]">
                <Image src={note.clientAvatar} alt={note.clientName} width={40} height={40} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#0A4833]">{note.clientName}</p>
                <p className="text-sm text-[#6B7280]">{note.noteDate}</p>
              </div>
            </div>

            <p className={`text-xs font-medium ${getStatusTone(note.status)}`}>{note.status}</p>
          </div>

          <h3 className="mt-5 text-xl font-medium tracking-[-0.03em] text-[#111827]">{note.title}</h3>
          <p className="mt-2 text-sm text-[#4B5563]">{note.summary}</p>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs text-[#6B7280]">Last updated: {note.lastUpdated}</p>

            <div className="flex items-center gap-3 text-[#0A4833]">
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                <Eye className="h-4 w-4" />
              </button>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                <CalendarDays className="h-4 w-4 text-[#A88751]" />
              </button>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#F3F4F6]">
                <UtensilsCrossed className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
