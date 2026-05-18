import type { FilterOption, ReportModule, ReportPeriod } from "../types";

type ReportsFiltersBarProps = {
  filters: FilterOption[];
  activePeriod: ReportPeriod;
  module: ReportModule;
  startDate: string;
  endDate: string;
  onPeriodChange: (period: ReportPeriod) => void;
  onModuleChange: (module: ReportModule) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

const moduleOptions: { id: ReportModule; label: string }[] = [
  { id: "all", label: "All Modules" },
  { id: "orders", label: "Orders" },
  { id: "users", label: "Users" },
  { id: "consultations", label: "Consultations" },
  { id: "events", label: "Events" },
  { id: "content", label: "Content" },
];

export default function ReportsFiltersBar({
  filters,
  activePeriod,
  module,
  startDate,
  endDate,
  onPeriodChange,
  onModuleChange,
  onStartDateChange,
  onEndDateChange,
}: ReportsFiltersBarProps) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onPeriodChange(filter.id as ReportPeriod)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              activePeriod === filter.id
                ? "border border-[#0A4B34] bg-[#0A4B34] text-white"
                : "border border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]"
            }`}
          >
            {filter.label}
          </button>
        ))}

        <select
          value={module}
          onChange={(event) => onModuleChange(event.target.value as ReportModule)}
          className="ml-0 h-8 rounded-md border border-[#D1D5DB] bg-white px-3 text-xs text-[#374151] outline-none focus:border-[#0A4B34] md:ml-2"
        >
          {moduleOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        {activePeriod === "custom" && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="h-8 rounded-md border border-[#D1D5DB] bg-white px-2 text-xs text-[#374151] outline-none focus:border-[#0A4B34]"
            />
            <span className="text-xs text-[#6B7280]">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="h-8 rounded-md border border-[#D1D5DB] bg-white px-2 text-xs text-[#374151] outline-none focus:border-[#0A4B34]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
