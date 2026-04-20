export default function NotificationsFilters() {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <FilterSelect value="All Status" />
        <FilterSelect value="All Types" />
        <FilterSelect value="All Channels" />
        <FilterSelect value="All Priority" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button className="text-sm text-[#0A4833]">Clear Filters</button>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
            Featured Only
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
            Sort by:
            <select className="h-8 rounded-md border border-[#DFDFDF] bg-white px-2 text-sm text-[#111827] outline-none">
              <option>Newest First</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ value }: { value: string }) {
  return (
    <select className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none">
      <option>{value}</option>
    </select>
  );
}

