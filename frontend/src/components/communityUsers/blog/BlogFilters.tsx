import { Search } from "lucide-react";

const tabs = ["All Posts", "Published", "Drafts", "Pending", "Archived"];

export default function BlogFilters() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max flex-nowrap gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`h-8 shrink-0 whitespace-nowrap rounded-md px-4 text-xs font-semibold ${
                  index === 0 ? "bg-[#06402B] text-white" : "bg-[#F3F4F6] text-[#4B5563]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#06402B] sm:w-72"
            />
          </div>
          <select className="h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]">
            <option>Sort by newest</option>
            <option>Sort by oldest</option>
            <option>Sort by status</option>
          </select>
        </div>
      </div>
    </section>
  );
}
