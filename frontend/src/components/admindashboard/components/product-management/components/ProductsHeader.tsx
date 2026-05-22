import { Download, Plus } from "lucide-react";

type Props = {
  onExport: () => void;
  onAdd: () => void;
};

export default function ProductsHeader({ onExport, onAdd }: Props) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-[34px] font-semibold text-[#0A4833]">Products</h2>
        <p className="text-sm text-[#6B7280]">Manage product listings, pricing, inventory, and visibility</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
