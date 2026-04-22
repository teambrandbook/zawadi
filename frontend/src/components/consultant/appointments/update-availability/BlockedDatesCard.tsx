import { CalendarDays, Trash2 } from "lucide-react";

export default function BlockedDatesCard() {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#0A4833]">Blocked Dates &amp; Leave Settings</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#667085]">From Date</label>
          <input type="date" className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]" />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#667085]">To Date</label>
          <input type="date" className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <label className="text-[11px] font-medium text-[#667085]">Reason</label>
        <input
          type="text"
          defaultValue="e.g., Vacation, Conference, Emergency"
          className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]"
        />
      </div>

      <button type="button" className="mt-3 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#A38355] px-4 text-sm font-medium text-white transition hover:bg-[#8E7149]">
        Add Blocked Date
      </button>

      <div className="mt-5">
        <p className="text-[11px] font-medium text-[#667085]">Upcoming Blocked Dates</p>
        <div className="mt-3 flex items-center justify-between rounded-[8px] bg-[#F1E8D7] px-4 py-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-[#A38355]" />
            <div>
              <p className="text-sm font-medium text-[#0A4833]">Dec 24 - Dec 26, 2024</p>
              <p className="text-xs text-[#8A8F98]">Holiday Break</p>
            </div>
          </div>
          <button type="button" className="text-[#D92D20] transition hover:text-[#B42318]" aria-label="Remove blocked date">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
