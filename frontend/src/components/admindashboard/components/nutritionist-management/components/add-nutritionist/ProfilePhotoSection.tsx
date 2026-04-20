import { Camera } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

type ProfilePhotoSectionProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedPhotoName: string;
  onBrowsePhoto: () => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfilePhotoSection({
  fileInputRef,
  selectedPhotoName,
  onBrowsePhoto,
  onPhotoChange,
}: ProfilePhotoSectionProps) {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <Camera size={16} />
        Profile Photo
      </h2>

      <div className="mt-4 flex h-[120px] flex-col items-center justify-center rounded-lg border border-[#DFDFDF] bg-[#FAFAFA] text-center">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
        <div className="rounded-full bg-[#EFE2CA] p-2 text-[#9F8151]">
          <Camera size={16} />
        </div>
        <p className="mt-2 text-xs text-[#4B5563]">
          Drag and drop your photo here, or{" "}
          <button type="button" onClick={onBrowsePhoto} className="text-[#9F8151]">
            browse
          </button>
        </p>
        <p className="text-[11px] text-[#9CA3AF]">{selectedPhotoName || "Recommended: 400x400px, max 2MB"}</p>
      </div>
    </article>
  );
}

