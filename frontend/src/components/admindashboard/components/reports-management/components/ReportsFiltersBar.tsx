import { useEffect, useState } from "react";
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
  { id: "all", label: "All Sections" },
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
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState(startDate);
  const [draftEndDate, setDraftEndDate] = useState(endDate);

  useEffect(() => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
  }, [startDate, endDate]);

  function handlePeriodClick(period: ReportPeriod) {
    if (period === "custom") {
      setIsCustomOpen((prev) => !prev);
      return;
    }

    setIsCustomOpen(false);
    onPeriodChange(period);
  }

  function applyCustomRange() {
    if (!draftStartDate || !draftEndDate) return;
    onStartDateChange(draftStartDate);
    onEndDateChange(draftEndDate);
    onPeriodChange("custom");
    setIsCustomOpen(false);
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="hide-scrollbar -mx-1 overflow-x-auto px-1">
          <div className="flex min-w-max items-center gap-2">
            {filters.map((filter) => (
              <div key={filter.id}>
                <button
                  type="button"
                  onClick={() => handlePeriodClick(filter.id as ReportPeriod)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    activePeriod === filter.id || (filter.id === "custom" && isCustomOpen)
                      ? "border border-[#0A4B34] bg-[#0A4B34] text-white"
                      : "border border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]"
                  }`}
                >
                  {filter.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <select
          value={module}
          onChange={(event) => onModuleChange(event.target.value as ReportModule)}
          className="h-9 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-xs text-[#374151] outline-none focus:border-[#0A4B34] sm:ml-2 sm:w-auto"
        >
          {moduleOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        {isCustomOpen && (
          <div className="absolute left-0 top-11 z-20 w-full max-w-[320px] rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-lg sm:left-auto sm:right-0 sm:top-10">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <input
                type="date"
                value={draftStartDate}
                onChange={(event) => setDraftStartDate(event.target.value)}
                className="h-9 rounded-md border border-[#D1D5DB] bg-white px-2 text-xs text-[#374151] outline-none focus:border-[#0A4B34]"
              />
              <span className="hidden text-xs text-[#6B7280] sm:inline">to</span>
              <input
                type="date"
                value={draftEndDate}
                onChange={(event) => setDraftEndDate(event.target.value)}
                className="h-9 rounded-md border border-[#D1D5DB] bg-white px-2 text-xs text-[#374151] outline-none focus:border-[#0A4B34]"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={applyCustomRange}
                disabled={!draftStartDate || !draftEndDate}
                className="h-8 rounded-md bg-[#0A4B34] px-4 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
