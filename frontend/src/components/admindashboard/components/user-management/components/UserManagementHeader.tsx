import { ChevronDown, Download, Filter, Plus, Search } from "lucide-react";
import { PERIOD_OPTIONS } from "../userManagementShared";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  period: string;
  onPeriodChange: (value: string) => void;
  onQuickFilter: () => void;
  onExportAll: () => void;
  onAddUser: () => void;
  canAddUser: boolean;
  canExportUsers: boolean;
};

export default function UserManagementHeader({
  searchQuery,
  onSearchChange,
  period,
  onPeriodChange,
  onQuickFilter,
  onExportAll,
  onAddUser,
  canAddUser,
  canExportUsers,
}: Props) {
  return (
    <div className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center md:flex-1">
          <h2 className="text-2xl font-semibold text-[#0A4833] md:text-[28px]">Users</h2>

          <div className="relative min-w-[220px] flex-1 md:max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg bg-[#E6E6E6] py-2 pl-9 pr-3 text-sm text-black outline-none ring-[#0A4833]/20 placeholder:text-[#6B7280] focus:ring-2"
            />
          </div>
        </div>

        <div className="hide-scrollbar w-full overflow-x-auto md:w-auto md:overflow-visible">
          <div className="flex min-w-max items-center gap-3 md:justify-end">
            <button type="button" onClick={onQuickFilter} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#E5E7EB] px-4 py-2 text-sm text-[#374151] hover:bg-[#D9DCE1]">
              <Filter className="h-4 w-4" />
              Filter
            </button>

            {canExportUsers && <button type="button" onClick={onExportAll} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#A88751] px-4 py-2 text-sm text-white hover:bg-[#957548]">
              <Download className="h-4 w-4" />
              Export
            </button>}

            {canAddUser && <button type="button" onClick={onAddUser} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0A4833] px-4 py-2 text-sm text-white hover:bg-[#083927]">
              <Plus className="h-4 w-4" />
              Add User
            </button>}

            <label className="relative inline-flex shrink-0 items-center">
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="appearance-none rounded-lg border border-[#D1D5DB] bg-white py-2 pl-3 pr-9 text-sm text-[#111827] outline-none"
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#6B7280]" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

