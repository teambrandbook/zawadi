import { useState } from "react";
import type { AssignmentSummaryData, ScheduleBlock, ScheduleNoteData } from "../assignNutritionistTypes";

type AssignmentSidebarProps = {
  scheduleTitle: string;
  schedule: ScheduleBlock[];
  summary: AssignmentSummaryData;
  note: ScheduleNoteData;
  onAssign?: (adminNotes: string) => void;
};

export default function AssignmentSidebar({ scheduleTitle, schedule, summary, note, onAssign }: AssignmentSidebarProps) {
  const [adminNotes, setAdminNotes] = useState("");
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">{scheduleTitle}</h3>

        {schedule.map((block) => (
          <div key={block.dayLabel} className="mt-3 rounded-md border border-[#E5E7EB] p-3">
            <p className="text-sm font-medium text-[#111827]">{block.dayLabel}</p>
            <div className="mt-2 space-y-2">
              {block.slots.map((slot) => (
                <div
                  key={slot.text}
                  className={
                    slot.highlighted
                      ? "rounded-md border border-[#D8C8A8] bg-[#FEF8EE] px-3 py-2 text-center text-xs text-[#8A6A3D]"
                      : "rounded-md bg-[#E8F5ED] px-3 py-2 text-center text-xs text-[#0A4833]"
                  }
                >
                  {slot.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">{summary.title}</h3>
        <div className="mt-3 space-y-3 text-sm">
          {summary.items.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-[#6B7280]">{item.label}</p>
              <p className="text-[#111827]">{item.value}</p>
            </div>
          ))}
          <div>
            <p className="text-xs text-[#6B7280]">{summary.notesLabel}</p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={summary.notesPlaceholder}
              rows={3}
              className="w-full resize-none rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs text-[#374151] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => onAssign?.(adminNotes)}
            className="h-10 w-full rounded-md bg-[#0A4833] text-sm font-medium text-white hover:bg-[#083927]"
          >
            {summary.assignButtonLabel}
          </button>
          <button
            type="button"
            className="h-10 w-full rounded-md bg-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#D1D5DB]"
          >
            {summary.draftButtonLabel}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#F3E8B5] bg-[#FFFBEA] p-4">
        <p className="text-sm font-medium text-[#A16207]">{note.title}</p>
        <p className="mt-1 text-xs text-[#B45309]">{note.description}</p>
      </div>
    </aside>
  );
}
