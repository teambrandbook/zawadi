/* eslint-disable @next/next/no-img-element */

import { Eye, Pencil, Star, MoreVertical } from "lucide-react";

export type ProductRow = {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  category: string;
  variant: string;
  price: number;
  stockUnits: number;
  status: "Active" | "Draft";
  sales: number;
  featured: boolean;
  image: string;
};

type Props = {
  rows: ProductRow[];
  page: number;
  totalPages: number;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAllPage: () => void;
  onPageChange: (page: number) => void;
  onToggleFeaturedRow: (id: string) => void;
};

export default function ProductsTable({ rows, page, totalPages, selectedIds, onToggleSelect, onToggleSelectAllPage, onPageChange, onToggleFeaturedRow }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-[#E9E0D0] text-[#0A4833]">
            <tr>
              <th className="px-3 py-3"><input type="checkbox" onChange={onToggleSelectAllPage} /></th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">SKU</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Variant</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Sales</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#DFDFDF]">
                <td className="px-3 py-4">
                  <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => onToggleSelect(row.id)} />
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <img src={row.image} alt={row.name} className="h-12 w-12 rounded-md border border-[#DFDFDF] object-cover" />
                    <div>
                      <p className="font-medium text-[#0A4833]">{row.name}</p>
                      <p className="text-xs text-[#6B7280]">{row.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-[#4B5563]">{row.sku}</td>
                <td className="px-3 py-4 text-[#0A4833]">{row.category}</td>
                <td className="px-3 py-4 text-[#4B5563]">{row.variant}</td>
                <td className="px-3 py-4 font-semibold text-[#0A4833]">${row.price.toFixed(2)}</td>
                <td className="px-3 py-4 text-xs font-medium text-[#9F8151]">{row.stockUnits} units</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${row.status === "Active" ? "text-[#15803D]" : "text-[#6B7280]"}`}>{row.status}</span>
                    <button type="button" onClick={() => onToggleFeaturedRow(row.id)} title="Toggle featured">
                      <Star className={`h-4 w-4 ${row.featured ? "fill-[#A88751] text-[#A88751]" : "text-[#C4C4C4]"}`} />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-4 text-[#4B5563]">{row.sales.toLocaleString()}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2 text-[#0A4833]">
                    <button type="button" aria-label="View"><Eye className="h-4 w-4" /></button>
                    <button type="button" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button type="button" aria-label="More"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-[#DFDFDF] py-3 text-sm">
        <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} className="rounded border border-[#DFDFDF] px-3 py-1">Previous</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onPageChange(n)} className={`rounded border px-3 py-1 ${n === page ? "border-[#0A4833] bg-[#0A4833] text-white" : "border-[#DFDFDF]"}`}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="rounded border border-[#DFDFDF] px-3 py-1">Next</button>
      </div>
    </section>
  );
}
