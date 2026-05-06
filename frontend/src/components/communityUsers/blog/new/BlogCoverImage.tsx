import { ImagePlus } from "lucide-react";

export default function BlogCoverImage({
  fileName,
  onChange,
}: {
  fileName: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Blog Cover Image</h2>
      <div className="mt-4 flex min-h-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E9DFCC] text-[#A88751]">
          <ImagePlus className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-medium text-[#374151]">Drag and drop your cover image here, or click to browse</p>
        {fileName ? <p className="mt-1 text-xs font-medium text-[#06402B]">{fileName}</p> : null}
        <p className="mt-2 text-xs text-[#6B7280]">Recommended size: 1200x600px</p>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="mt-4 block w-full max-w-sm text-xs text-[#6B7280] file:mr-3 file:rounded-md file:border-0 file:bg-[#06402B] file:px-3 file:py-2 file:text-white"
        />
      </div>
    </section>
  );
}
