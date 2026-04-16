import { Search } from "lucide-react";

type Props = {
  search: string;
  productStatus: string;
  stockStatus: string;
  sortBy: string;
  onChange: (key: string, value: string) => void;
  onQuickFilter: (value: string) => void;
  onClear: () => void;
};

const fieldClass = "h-10 w-full rounded-md border border-[#DFDFDF] bg-[#E9E0D0] px-3 text-sm text-[#111827] outline-none";
const quickFilters = ["Featured", "Best Selling", "Recently Added", "Low Stock"];

export default function ProductFilters({ search, productStatus, stockStatus, sortBy, onChange, onQuickFilter, onClear }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label>
          <p className="mb-1 text-sm text-[#0A4833]">Search Products</p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8B8B]" />
            <input className={`${fieldClass} pl-9`} placeholder="Name, SKU, Category..." value={search} onChange={(e) => onChange("search", e.target.value)} />
          </div>
        </label>

        <label>
          <p className="mb-1 text-sm text-[#0A4833]">Product Status</p>
          <select className={fieldClass} value={productStatus} onChange={(e) => onChange("productStatus", e.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
        </label>

        <label>
          <p className="mb-1 text-sm text-[#0A4833]">Stock Status</p>
          <select className={fieldClass} value={stockStatus} onChange={(e) => onChange("stockStatus", e.target.value)}>
            <option>All Stock</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </label>

        <label>
          <p className="mb-1 text-sm text-[#0A4833]">Sort By</p>
          <select className={fieldClass} value={sortBy} onChange={(e) => onChange("sortBy", e.target.value)}>
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#ECECEC] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#6B7280]">Quick Filters:</span>
          {quickFilters.map((item) => (
            <button key={item} type="button" onClick={() => onQuickFilter(item)} className="rounded-md border border-[#DFDFDF] bg-white px-3 py-1 text-sm text-[#374151]">
              {item}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClear} className="text-sm text-[#0A4833] hover:underline">Clear Filters</button>
      </div>
    </section>
  );
}
