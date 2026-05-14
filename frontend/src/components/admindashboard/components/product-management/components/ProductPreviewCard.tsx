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
    <aside className="rounded-[12px] border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:sticky lg:top-24">
      <h2 className="mb-6 text-[18px] font-semibold leading-7 tracking-[-0.5px] text-[#0A4833]">Product Preview</h2>

      <div className="mb-6 grid h-48 place-items-center overflow-hidden rounded-[8px] bg-[#F3F4F6]">
        {imageUrl ? (
          <img src={imageUrl} alt={productName || "Product preview"} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-9 w-9 text-[#98A2B3]" />
        )}
      </div>

      <div className="space-y-4 text-[16px] tracking-[-0.5px]">
        <div>
          <p className="font-semibold leading-6 text-[#0A4833]">{productName || "Product Name"}</p>
          <p className="text-[14px] leading-5 text-[#6B7280]">{subtitle || "Product subtitle will appear here"}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#0A4833]">Price:</span>
          <span className="font-semibold text-[#A1844F]">${price || "0.00"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#0A4833]">Stock:</span>
          <span className="text-[#4B5563]">{stock || "0"} units</span>
        </div>
        <div className="border-t border-[#DFDFDF] pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#0A4833]">Status:</span>
            <span className="text-[12px] leading-4 text-[#4B5563]">{status || "Draft"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
