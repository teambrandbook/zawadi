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

export default function ProductBulkActions({ 
  selectedCount, 
  totalCount, 
  onSelectAllCurrent, 
  onChangeVisibility, 
  onMarkFeatured, 
  onExportSelected, 
  onArchive 
}: Props) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFDFDF] bg-white p-3">
      {/* Set "Select All" text to black */}
      <button 
        type="button" 
        onClick={onSelectAllCurrent} 
        className="inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-80"
      >
        <span className="inline-block h-4 w-4 rounded border border-black" />
        Select All ({totalCount} products)
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {/* Buttons updated with text-black and black icons where appropriate */}
        <button 
          type="button" 
          onClick={onChangeVisibility} 
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm font-medium text-black hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 text-black" />
          Change Visibility
        </button>
        
        <button 
          type="button" 
          onClick={onMarkFeatured} 
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-sm font-medium text-black hover:bg-gray-50"
        >
          <Star className="h-4 w-4 text-[#A88751]" />
          Mark Featured
        </button>
        
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
          Archive
        </button>
        
        {/* "Selected" count text set to black */}
        <span className="text-xs font-semibold text-black">
          {selectedCount} selected
        </span>
      </div>
    </section>
  );
}