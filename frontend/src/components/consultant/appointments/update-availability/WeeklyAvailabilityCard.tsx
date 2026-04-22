import { Plus } from "lucide-react";
import { weeklyAvailability } from "./updateAvailabilityData";

export default function WeeklyAvailabilityCard() {
  return (
    <section id="weekly-availability" className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Weekly Availability</h2>
        <button type="button" className="text-xs font-medium text-[#A38355] transition hover:text-[#8E7149]">
          Copy from last week
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {weeklyAvailability.map((item) => (
          <article
            key={item.day}
            className={`grid gap-3 rounded-[8px] px-3 py-3 md:grid-cols-[160px_110px_110px_minmax(0,1fr)_28px] md:items-center ${
              item.enabled ? "bg-[#F1E8D7]" : "bg-[#F8F8F8]"
            }`}
          >
            <label className={`flex items-center gap-3 text-sm font-medium ${item.enabled ? "text-[#0A4833]" : "text-[#9CA3AF]"}`}>
              <input type="checkbox" defaultChecked={item.enabled} className="h-4 w-4 rounded border-[#D0D5DD] accent-[#1677FF]" />
              <span>{item.day}</span>
            </label>

            <input
              type="time"
              defaultValue={item.startTime}
              disabled={!item.enabled}
              className="h-9 rounded-[8px] border border-[#DFDFDF] bg-white px-3 text-sm text-[#344054] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
            />

            <input
              type="time"
              defaultValue={item.endTime}
              disabled={!item.enabled}
              className="h-9 rounded-[8px] border border-[#DFDFDF] bg-white px-3 text-sm text-[#344054] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
            />

            <p className={`text-xs ${item.enabled ? "text-[#8A8F98]" : "text-[#B5B8BE]"}`}>{item.breakTime}</p>

            <button
              type="button"
              disabled={!item.enabled}
              className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[#A38355] transition hover:bg-white disabled:text-[#C7C9CE]"
              aria-label={`Add slot for ${item.day}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
