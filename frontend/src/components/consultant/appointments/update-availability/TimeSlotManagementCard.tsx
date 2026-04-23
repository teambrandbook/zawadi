import { ChevronDown } from "lucide-react";
import { timeSlotChips } from "./updateAvailabilityData";

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-medium text-[#667085]">{label}</label>
      <div className="relative">
        <select
          defaultValue={defaultValue}
          className="h-10 w-full appearance-none rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 pr-10 text-sm text-[#344054] outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
      </div>
    </div>
  );
}

export default function TimeSlotManagementCard() {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#0A4833]">Time Slot Management</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SelectField label="Session Duration" options={["30 minutes", "45 minutes", "60 minutes"]} defaultValue="30 minutes" />
        <SelectField label="Buffer Time" options={["No buffer", "10 minutes", "15 minutes"]} defaultValue="No buffer" />
        <SelectField label="Max Sessions/Day" options={["6", "8", "10"]} defaultValue="8" />
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-medium text-[#667085]">Available Time Slots</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {timeSlotChips.map((chip) => (
            <button key={chip.label} type="button" className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${chip.tone}`}>
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
