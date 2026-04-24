"use client";

import { ChevronDown, Filter, Search } from "lucide-react";
import type { ClientGoal, ClientStatus } from "./clientTypes";

type Props = {
  searchValue: string;
  statusValue: ClientStatus | "All Status";
  goalValue: ClientGoal | "All Goals";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ClientStatus | "All Status") => void;
  onGoalChange: (value: ClientGoal | "All Goals") => void;
};

const statusOptions: Array<ClientStatus | "All Status"> = ["All Status", "Active", "Follow-up Due", "High Priority", "New"];
const goalOptions: Array<ClientGoal | "All Goals"> = ["All Goals", "Weight Loss", "General Health", "Muscle Gain", "Digestive Health"];

export default function ClientHeader({ searchValue, statusValue, goalValue, onSearchChange, onStatusChange, onGoalChange }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#0A4833]">Clients</h1>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search clients..."
            className="h-11 w-full rounded-[10px] border border-[#E4E7EC] bg-white pl-9 pr-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#0A4833]"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="relative">
            <select
              value={statusValue}
              onChange={(event) => onStatusChange(event.target.value as ClientStatus | "All Status")}
              className="h-11 min-w-[140px] appearance-none rounded-[10px] border border-[#E4E7EC] bg-white px-4 pr-10 text-sm text-[#344054] outline-none transition focus:border-[#0A4833]"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
          </div>

          <div className="relative">
            <select
              value={goalValue}
              onChange={(event) => onGoalChange(event.target.value as ClientGoal | "All Goals")}
              className="h-11 min-w-[140px] appearance-none rounded-[10px] border border-[#E4E7EC] bg-white px-4 pr-10 text-sm text-[#344054] outline-none transition focus:border-[#0A4833]"
            >
              {goalOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#0A4833] px-4 text-sm font-medium text-white transition hover:bg-[#083727]"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </section>
  );
}
