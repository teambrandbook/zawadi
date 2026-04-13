import { Download, Filter, Search } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onExport: () => void;
};

export default function OrdersHeader({ search, onSearchChange, onFilterClick, onExport }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[30px] font-semibold leading-none text-[#0A4833]">Orders</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8B8B]" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search orders..."
              className="h-11 w-[290px] rounded-lg bg-[#E9E0D0] pl-9 pr-3 text-sm outline-none ring-[#0A4833]/20 placeholder:text-[#8B8B8B] focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onFilterClick} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#DFE2E7] px-4 text-sm text-[#374151] hover:bg-[#D5D9E0]">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button type="button" onClick={onExport} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#A88751] px-4 text-sm text-white hover:bg-[#8F7348]">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <p className="text-base text-[#4B5563]">Track customer purchases, monitor fulfillment, and manage delivery workflows.</p>
    </section>
  );
}
