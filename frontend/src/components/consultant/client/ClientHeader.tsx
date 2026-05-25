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
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#0A4833]">Clients</h1>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative order-1 w-full md:max-w-[320px] lg:max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search clients..."
            className="h-11 w-full rounded-[10px] border border-[#E4E7EC] bg-white pl-9 pr-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#0A4833]"
          />
        </div>

        <div className="order-2 md:ml-auto">
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={statusValue}
                onChange={(event) => onStatusChange(event.target.value as ClientStatus | "All Status")}
                className="h-11 w-full appearance-none rounded-[10px] border border-[#E4E7EC] bg-white px-2 pr-7 text-xs text-[#344054] outline-none transition focus:border-[#0A4833] sm:w-[148px] sm:px-4 sm:pr-10 sm:text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085] sm:right-3" />
            </div>

            <div className="relative">
              <select
                value={goalValue}
                onChange={(event) => onGoalChange(event.target.value as ClientGoal | "All Goals")}
                className="h-11 w-full appearance-none rounded-[10px] border border-[#E4E7EC] bg-white px-2 pr-7 text-xs text-[#344054] outline-none transition focus:border-[#0A4833] sm:w-[148px] sm:px-4 sm:pr-10 sm:text-sm"
              >
                {goalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085] sm:right-3" />
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-1 rounded-[10px] bg-[#0A4833] px-2 text-xs font-medium text-white transition hover:bg-[#083727] sm:w-[148px] sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
