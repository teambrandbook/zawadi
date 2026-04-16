import { ChevronDown, Download, FunnelX, Mail } from "lucide-react";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "../userManagementShared";

type Props = {
  statusFilter: string;
  roleFilter: string;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onClearFilters: () => void;
  onBulkEmail: () => void;
  onExportSelected: () => void;
};

export default function UserFiltersBar({
  statusFilter,
  roleFilter,
  onStatusChange,
  onRoleChange,
  onClearFilters,
  onBulkEmail,
  onExportSelected,
}: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="appearance-none rounded-lg bg-[#E5E7EB] py-2 pl-3 pr-8 text-sm text-[#1F2937]">
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
          </label>

          <label className="relative">
            <select value={roleFilter} onChange={(e) => onRoleChange(e.target.value)} className="appearance-none rounded-lg bg-[#E5E7EB] py-2 pl-3 pr-8 text-sm text-[#1F2937]">
              {ROLE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
          </label>

          <button type="button" onClick={onClearFilters} className="inline-flex items-center gap-2 px-2 py-2 text-sm text-[#A88751] hover:text-[#8D6E3E]">
            <FunnelX className="h-4 w-4" />
            Clear Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onBulkEmail} className="inline-flex items-center gap-2 rounded-lg bg-[#A88751] px-4 py-2 text-sm text-white hover:bg-[#957548]">
            <Mail className="h-4 w-4" />
            Bulk Email
          </button>

          <button type="button" onClick={onExportSelected} className="inline-flex items-center gap-2 rounded-lg bg-[#0A4833] px-4 py-2 text-sm text-white hover:bg-[#083927]">
            <Download className="h-4 w-4" />
            Export Selected
          </button>
        </div>
      </div>
    </section>
  );
}

