export default function BlogManagementFilters() {
  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-3">
      <div className="grid gap-2.5 md:grid-cols-5">
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-[#667085]">Status</span>
          <select className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] outline-none">
            <option>All Status</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[11px] font-medium text-[#667085]">Category</span>
          <select className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] outline-none">
            <option>All Categories</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[11px] font-medium text-[#667085]">Featured</span>
          <select className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] outline-none">
            <option>All Blogs</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[11px] font-medium text-[#667085]">Sort By</span>
          <select className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] outline-none">
            <option>Newest First</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[11px] font-medium text-[#667085]">Actions</span>
          <button type="button" className="h-9 w-full rounded-lg bg-[#0A4833] px-3 text-[13px] font-medium text-white">
            Apply Filters
          </button>
        </label>
      </div>
    </section>
  );
}
