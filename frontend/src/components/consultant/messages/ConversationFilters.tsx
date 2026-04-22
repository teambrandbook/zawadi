"use client";

import type { ConversationFilter } from "./messageTypes";

type Props = {
  activeFilter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
};

const filters: ConversationFilter[] = ["All", "Unread", "Priority"];

export default function ConversationFilters({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="mt-4 flex items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            activeFilter === filter ? "bg-[#A38355] text-white" : "bg-[#E5E7EB] text-[#0A4833] hover:bg-[#D9DDD9]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
