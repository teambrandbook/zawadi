import { Bell, Download, Star, Upload, XCircle } from "lucide-react";

export default function EventsFiltersAndActions() {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Status" value="All Status" />
          <FilterSelect label="Event Type" value="All Types" />
          <FilterSelect label="Category" value="All Categories" />
          <FilterSelect label="Sort By" value="Newest First" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button className="text-xs font-medium text-[#0A4833]">Clear Filters</button>
          <label className="inline-flex items-center gap-2 text-xs text-[#6B7280]">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
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

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-xs text-[#5E7E72]">{label}</p>
      <select className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none">
        <option>{value}</option>
      </select>
    </label>
  );
}

