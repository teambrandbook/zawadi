import { ImageIcon } from "lucide-react";

export default function ProductPreviewCard() {
  return (
    <aside className="rounded-lg border border-[#E4E7EC] bg-white p-4">
      <h2 className="mb-3 text-[12px] font-semibold text-[#0A4833]">Product Preview</h2>

      <div className="mb-4 grid h-28 place-items-center rounded-md border border-[#EAECF0] bg-[#F9FAFB]">
        <ImageIcon className="h-5 w-5 text-[#98A2B3]" />
      </div>

      <div className="space-y-2 text-[11px] text-[#475467]">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-[#344054]">Product Name</span>
          <span className="text-right">Product subtitle will appear here</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#F2F4F7] pt-2">
          <span className="font-semibold text-[#344054]">Price:</span>
          <span className="font-semibold text-[#A1844F]">$0.00</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#344054]">Stock:</span>
          <span>0 units</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#344054]">Status:</span>
          <span>Draft</span>
        </div>
      </div>
    </aside>
  );
}
