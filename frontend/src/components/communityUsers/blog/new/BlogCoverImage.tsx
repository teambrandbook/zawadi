import { ImagePlus } from "lucide-react";

export default function BlogCoverImage() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Blog Cover Image</h2>
      <div className="mt-4 flex min-h-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E9DFCC] text-[#A88751]">
          <ImagePlus className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-medium text-[#374151]">Drag and drop your cover image here, or click to browse</p>
        <p className="mt-2 text-xs text-[#6B7280]">Recommended size: 1200x600px</p>
      </div>
    </section>
  );
}
