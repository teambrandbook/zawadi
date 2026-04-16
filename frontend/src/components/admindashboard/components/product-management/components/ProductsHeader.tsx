import { Download, Filter, Plus, Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onFilter: () => void;
  onExport: () => void;
  onAdd: () => void;
};

export default function ProductsHeader({ query, onQueryChange, onFilter, onExport, onAdd }: Props) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-[34px] font-semibold text-[#0A4833]">Products</h2>
        <p className="text-sm text-[#6B7280]">Manage product listings, pricing, inventory, and visibility</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8B8B]" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search..."
            className="h-11 w-[250px] rounded-lg border border-[#DFDFDF] bg-[#E9E0D0] pl-9 pr-3 text-sm outline-none"
          />
        </div>

        <button type="button" onClick={onFilter} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#DFDFDF] bg-white px-4 text-sm text-[#0A4833]">
          <Filter className="h-4 w-4" />
          Filter
        </button>

        <button type="button" onClick={onExport} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#DFDFDF] bg-white px-4 text-sm text-[#0A4833]">
          <Download className="h-4 w-4" />
          Export
        </button>

        <button type="button" onClick={onAdd} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0A4833] px-4 text-sm text-white hover:bg-[#083927]">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
    </section>
  );
}
