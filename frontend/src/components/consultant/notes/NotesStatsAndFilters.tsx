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

const noteStats = [
  { label: "Total Notes", value: "247", icon: FilePlus2, tone: "text-[#0A4833] bg-[#EBE1CF]" },
  { label: "Recent Notes", value: "18", icon: MessageSquareText, tone: "text-[#0A4833] bg-[#EBE1CF]" },
  { label: "Follow-up Notes", value: "12", icon: ClipboardList, tone: "text-[#A88751] bg-[#EBE1CF]" },
  { label: "Pending Review", value: "5", icon: AlertTriangle, tone: "text-[#EF4444] bg-[#EBE1CF]" },
];

export default function NotesStatsAndFilters() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.03em] text-[#0A4833]">Notes</h1>
          <p className="mt-1 text-sm text-[#4B5563]">Manage and review your client consultation records</p>
        </div>

        <Link
          href="/consultant/notes/add"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#0A4833] px-5 text-sm font-medium text-[#EBE1CF] hover:bg-[#083B2A]"
        >
          <span className="text-base leading-none">+</span>
          <span>Add New Note</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative lg:w-[255px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search notes..."
              className="h-11 w-full rounded-[8px] border border-[#DFDFDF] bg-white pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>

          {["All Clients", "All Dates", "All Types", "All Status"].map((label) => (
            <button
              key={label}
              type="button"
              className="inline-flex h-11 items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-white px-4 text-sm text-[#111827] lg:min-w-[150px]"
            >
              <span>{label}</span>
              <ChevronDown className="h-4 w-4 text-[#374151]" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
