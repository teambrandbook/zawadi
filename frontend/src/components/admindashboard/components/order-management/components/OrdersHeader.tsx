import { Download, Filter, Search } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onExport: () => void;
  canExportOrders: boolean;
};

export default function OrdersHeader({ search, onSearchChange, onFilterClick, onExport, canExportOrders }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <h2 className="text-2xl font-semibold leading-none text-[#0A4833] md:text-[28px]">Orders</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8B8B]" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search orders..."
              className="h-11 w-full rounded-lg bg-[#E9E0D0] pl-9 pr-3 text-sm outline-none ring-[#0A4833]/20 placeholder:text-[#8B8B8B] focus:ring-2 sm:w-[220px] md:w-[290px]"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center justify-end gap-2">
          <button type="button" onClick={onFilterClick} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#DFE2E7] px-4 text-sm text-[#374151] hover:bg-[#D5D9E0]">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          {canExportOrders && <button type="button" onClick={onExport} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#A88751] px-4 text-sm text-white hover:bg-[#8F7348]">
            <Download className="h-4 w-4" />
            Export
          </button>}
        </div>
      </div>

      <p className="text-base text-[#4B5563]">Track customer purchases, monitor fulfillment, and manage delivery workflows.</p>
    </section>
  );
}
