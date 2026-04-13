import { Download, Eye, Star, Trash2 } from "lucide-react";

type Props = {
  selectedCount: number;
  totalCount: number;
  onSelectAllCurrent: () => void;
  onChangeVisibility: () => void;
  onMarkFeatured: () => void;
  onExportSelected: () => void;
  onArchive: () => void;
};

export default function ProductBulkActions({ selectedCount, totalCount, onSelectAllCurrent, onChangeVisibility, onMarkFeatured, onExportSelected, onArchive }: Props) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFDFDF] bg-white p-3">
      <button type="button" onClick={onSelectAllCurrent} className="inline-flex items-center gap-2 text-sm text-[#0A4833]">
        <span className="inline-block h-4 w-4 rounded border border-[#9CA3AF]" />
        Select All ({totalCount} products)
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onChangeVisibility} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm">
          <Eye className="h-4 w-4" />
          Change Visibility
        </button>
        <button type="button" onClick={onMarkFeatured} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm">
          <Star className="h-4 w-4 text-[#A88751]" />
          Mark Featured
        </button>
        <button type="button" onClick={onExportSelected} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm">
          <Download className="h-4 w-4" />
          Export Selected
        </button>
        <button type="button" onClick={onArchive} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#F3B5B5] bg-white px-3 text-sm text-[#DC2626]">
          <Trash2 className="h-4 w-4" />
          Archive
        </button>
        <span className="text-xs text-[#6B7280]">{selectedCount} selected</span>
      </div>
    </section>
  );
}
