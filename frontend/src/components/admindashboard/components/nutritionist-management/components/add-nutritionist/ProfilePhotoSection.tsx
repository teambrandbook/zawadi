import { Camera } from "lucide-react";
import type { ChangeEvent, DragEvent, RefObject } from "react";

type ProfilePhotoSectionProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedPhotoName: string;
  previewUrl: string;
  onBrowsePhoto: () => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoDrop: (file: File) => void;
};

export default function ProfilePhotoSection({
  fileInputRef,
  selectedPhotoName,
  previewUrl,
  onBrowsePhoto,
  onPhotoChange,
  onPhotoDrop,
}: ProfilePhotoSectionProps) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onPhotoDrop(file);
  }

  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <Camera size={16} />
        Profile Photo
      </h2>

      <div
        role="button"
        tabIndex={0}
        onClick={onBrowsePhoto}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onBrowsePhoto();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="mt-4 flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C8B797] bg-[#FAFAFA] p-4 text-center transition hover:bg-[#F8F4ED]"
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
        {previewUrl ? (
          <div
            aria-label="Selected profile photo preview"
            className="h-20 w-20 rounded-full border border-[#EFE2CA] bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url(${previewUrl})` }}
          />
        ) : (
          <div className="rounded-full bg-[#EFE2CA] p-2 text-[#9F8151]">
            <Camera size={16} />
          </div>
        )}
        <p className="mt-2 text-xs text-[#4B5563]">
          Drag and drop your photo here, or{" "}
          <span className="text-[#9F8151]">
            browse
          </span>
        </p>
        <p className="text-[11px] text-[#9CA3AF]">{selectedPhotoName || "Recommended: 400x400px, max 5MB"}</p>
      </div>
    </article>
  );
}
