import { Bell, Download, Star, Upload, XCircle } from "lucide-react";

export type EventFilters = {
  status: string;
  type: string;
  category: string;
  sortBy: string;
  featuredOnly: boolean;
};

type EventsFiltersAndActionsProps = {
  filters: EventFilters;
  categories: string[];
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
};

const statusOptions = ["All Status", "Published", "Draft", "Cancelled"];
const typeOptions = ["All Types", "Online", "Offline"];
const sortOptions = ["Newest First", "Oldest First", "Title A-Z", "Title Z-A"];

export default function EventsFiltersAndActions({ filters, categories, onFiltersChange, onClearFilters }: EventsFiltersAndActionsProps) {
  function updateFilter(key: keyof EventFilters, value: string | boolean) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Status" value={filters.status} options={statusOptions} onChange={(value) => updateFilter("status", value)} />
          <FilterSelect label="Event Type" value={filters.type} options={typeOptions} onChange={(value) => updateFilter("type", value)} />
          <FilterSelect label="Category" value={filters.category} options={["All Categories", ...categories]} onChange={(value) => updateFilter("category", value)} />
          <FilterSelect label="Sort By" value={filters.sortBy} options={sortOptions} onChange={(value) => updateFilter("sortBy", value)} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={onClearFilters} className="text-xs font-medium text-[#0A4833]">
            Clear Filters
          </button>
          <label className="inline-flex items-center gap-2 text-xs text-[#6B7280]">
            <input
              type="checkbox"
              checked={filters.featuredOnly}
              onChange={(event) => updateFilter("featuredOnly", event.target.checked)}
              className="h-3.5 w-3.5 rounded border-[#CFCFCF]"
            />
            Featured Only
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DFDFDF] bg-white p-3">
        <span className="mr-2 text-xs font-medium text-[#0A4833]">Bulk Actions:</span>
        <button className="inline-flex items-center gap-1 rounded-md bg-[#EEF2F0] px-3 py-1.5 text-xs text-[#0A4833]">
          <Upload size={12} />
          Publish Selected
        </button>
        <button className="inline-flex items-center gap-1 rounded-md bg-[#FFF1F1] px-3 py-1.5 text-xs text-[#DC2626]">
          <XCircle size={12} />
          Cancel Selected
        </button>
        <button className="inline-flex items-center gap-1 rounded-md bg-[#F5EFE5] px-3 py-1.5 text-xs text-[#9F8151]">
          <Star size={12} />
          Mark Featured
        </button>
        <button className="inline-flex items-center gap-1 rounded-md bg-[#EEF3FF] px-3 py-1.5 text-xs text-[#2563EB]">
          <Bell size={12} />
          Send Reminders
        </button>
        <button className="inline-flex items-center gap-1 rounded-md bg-[#EEF2F0] px-3 py-1.5 text-xs text-[#0A4833]">
          <Download size={12} />
          Export Selected
        </button>
      </div>
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <p className="mb-1 text-xs text-[#5E7E72]">{label}</p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
