/* eslint-disable @next/next/no-img-element */

import { ImageIcon } from "lucide-react";

type Props = {
  productName?: string;
  subtitle?: string;
  price?: string;
  stock?: string;
  status?: string;
  imageUrl?: string | null;
};

export default function ProductPreviewCard({
  productName = "",
  subtitle = "Product subtitle will appear here",
  price = "0.00",
  stock = "0",
  status = "Draft",
  imageUrl = null,
}: Props) {
  return (
    <aside className="rounded-lg border border-[#E4E7EC] bg-white p-4">
      <h2 className="mb-3 text-[12px] font-semibold text-[#0A4833]">Product Preview</h2>

      <div className="mb-4 grid h-28 place-items-center overflow-hidden rounded-md border border-[#EAECF0] bg-[#F9FAFB]">
        {imageUrl ? (
          <img src={imageUrl} alt={productName || "Product preview"} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-5 w-5 text-[#98A2B3]" />
        )}
      </div>

      <div className="space-y-2 text-[11px] text-[#475467]">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-[#344054]">Product Name</span>
          <span className="text-right">{productName || subtitle}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#F2F4F7] pt-2">
          <span className="font-semibold text-[#344054]">Price:</span>
          <span className="font-semibold text-[#A1844F]">${price || "0.00"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#344054]">Stock:</span>
          <span>{stock || "0"} units</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#344054]">Status:</span>
          <span>{status}</span>
        </div>
      </div>
    </aside>
  );
}
