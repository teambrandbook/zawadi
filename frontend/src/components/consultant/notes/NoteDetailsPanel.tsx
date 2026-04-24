"use client";

import Image from "next/image";
import type { BackendNoteItem } from "./noteTypes";

function getRestrictionTone(item: string) {
  if (item.toLowerCase().includes("gluten")) return "text-[#DC2626]";
  if (item.toLowerCase().includes("dairy")) return "text-[#A16207]";
  return "text-[#EA580C]";
}

type Props = {
  note: BackendNoteItem;
};

export default function NoteDetailsPanel({ note }: Props) {
  return (
    <aside className="overflow-hidden rounded-[12px] border border-[#DFDFDF] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#DFDFDF] px-5 py-5">
        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0A4833] sm:text-[26px]">Note Details</h2>
        <p className="mt-1 text-sm text-[#4B5563]">Select a note to view details</p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <section>
          <h3 className="text-xl font-medium text-[#111827]">Client Summary</h3>
          <div className="mt-3 rounded-[8px] bg-[rgba(235,225,207,0.5)] p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-[#E5E7EB]">
                <Image src={note.clientAvatar} alt={note.clientName} width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-base font-medium text-[#0A4833]">{note.clientName}</p>
                <p className="text-sm text-[#4B5563]">{`Age: ${note.clientSummary.age} - ${note.clientSummary.gender}`}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#374151]">{`Health goals: ${note.clientSummary.goals}`}</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-medium text-[#111827]">Session Observations</h3>
          <div className="mt-3 space-y-3">
            {note.sessionObservations.map((item) => (
              <div key={item} className="flex gap-2">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0A4833]" />
                <p className="text-sm leading-6 text-[#374151]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-medium text-[#111827]">Food Restrictions</h3>
          <div className="mt-3 flex flex-wrap gap-5 text-xs">
            {note.foodRestrictions.map((item) => (
              <span key={item} className={getRestrictionTone(item)}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-medium text-[#111827]">Key Recommendations</h3>
          <div className="mt-3 rounded-[8px] bg-[rgba(10,72,51,0.05)] p-4">
            {note.recommendations.map((item) => (
              <p key={item} className="mb-3 text-sm leading-6 text-[#374151] last:mb-0">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-medium text-[#111827]">Follow-up Instructions</h3>
          <div className="mt-3 rounded-[8px] bg-[rgba(159,129,81,0.1)] p-4">
            {note.followUpInstructions.map((item) => (
              <p key={item} className="mb-3 text-sm leading-6 text-[#374151] last:mb-0">
                {item}
              </p>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
