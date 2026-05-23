import { Download, Trash2 } from "lucide-react";

type Props = {
  selectedCount: number;
  totalCount: number;
  onExportSelected: () => void;
  onArchive: () => void;
};

export default function ProductBulkActions({ 
  selectedCount, 
  onExportSelected, 
  onArchive 
}: Props) {
  return (
    <section className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-[#DFDFDF] bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          type="button" 
          onClick={onExportSelected} 
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm font-medium text-black hover:bg-gray-50"
        >
          <Download className="h-4 w-4 text-black" />
          Export Selected
        </button>
        
        {/* Archive kept as Red for semantic meaning, but darkened for visibility */}
        <button 
          type="button" 
          onClick={onArchive} 
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#F3B5B5] bg-white px-3 text-sm font-bold text-[#991B1B] hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        
        {/* "Selected" count text set to black */}
        <span className="text-xs font-semibold text-black">
          {selectedCount} selected
        </span>
      </div>
    </section>
  );
}
