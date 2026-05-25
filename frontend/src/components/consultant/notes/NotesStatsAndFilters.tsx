"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  FilePlus2,
  MessageSquareText,
  Search,
} from "lucide-react";

export type NotesStats = {
  total: number;
  recent: number;
  followUp: number;
  pendingReview: number;
};

type Props = {
  stats: NotesStats;
  searchValue: string;
  clientFilter: string;
  dateFilter: string;
  typeFilter: string;
  statusFilter: string;
  clientOptions: string[];
  dateOptions: string[];
  typeOptions: string[];
  statusOptions: string[];
  onSearchChange: (value: string) => void;
  onClientFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative min-w-[150px] shrink-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-[8px] border border-[#DFDFDF] bg-white px-4 pr-10 text-sm text-[#111827] outline-none focus:border-[#0A4833]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
    </div>
  );
}

export default function NotesStatsAndFilters({
  stats,
  searchValue,
  clientFilter,
  dateFilter,
  typeFilter,
  statusFilter,
  clientOptions,
  dateOptions,
  typeOptions,
  statusOptions,
  onSearchChange,
  onClientFilterChange,
  onDateFilterChange,
  onTypeFilterChange,
  onStatusFilterChange,
}: Props) {
  const noteStats = [
    { label: "Total Notes", value: stats.total, icon: FilePlus2, tone: "text-[#0A4833] bg-[#EBE1CF]" },
    { label: "Recent Notes", value: stats.recent, icon: MessageSquareText, tone: "text-[#0A4833] bg-[#EBE1CF]" },
    { label: "Follow-up Notes", value: stats.followUp, icon: ClipboardList, tone: "text-[#A88751] bg-[#EBE1CF]" },
    { label: "Pending Review", value: stats.pendingReview, icon: AlertTriangle, tone: "text-[#EF4444] bg-[#EBE1CF]" },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.03em] text-[#0A4833]">Notes</h1>
          <p className="mt-1 text-sm text-[#4B5563]">Manage and review your client consultation records</p>
        </div>

        <Link
          href="/consultant/notes/add"
          className="inline-flex h-10 w-fit self-end items-center justify-center gap-2 rounded-[8px] bg-[#0A4833] px-4 text-xs font-medium text-[#EBE1CF] hover:bg-[#083B2A] md:self-start"
        >
          <span className="text-base leading-none">+</span>
          <span>Add New Note</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {noteStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-[12px] border border-[#DFDFDF] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#4B5563]">{stat.label}</p>
                  <p className="mt-2 text-[36px] font-bold leading-none text-[#0A4833]">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${stat.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-[12px] border border-[#DFDFDF] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="hide-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain">
          <div className="flex w-max gap-3 pb-1 lg:w-full">
          <div className="relative w-[255px] shrink-0 lg:shrink">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search notes..."
              className="h-11 w-full rounded-[8px] border border-[#DFDFDF] bg-white pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>

          <FilterSelect label="Client" value={clientFilter} options={clientOptions} onChange={onClientFilterChange} />
          <FilterSelect label="Date" value={dateFilter} options={dateOptions} onChange={onDateFilterChange} />
          <FilterSelect label="Type" value={typeFilter} options={typeOptions} onChange={onTypeFilterChange} />
          <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={onStatusFilterChange} />
          </div>
        </div>
      </div>
    </section>
  );
}
