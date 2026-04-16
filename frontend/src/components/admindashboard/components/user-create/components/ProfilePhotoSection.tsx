/* eslint-disable @next/next/no-img-element */

import { Upload } from "lucide-react";
import CreateUserSection from "./CreateUserSection";

type Props = {
  photoPreview: string;
  onPick: (file: File | null) => void;
};

export default function ProfilePhotoSection({ photoPreview, onPick }: Props) {
  return (
    <CreateUserSection title="Profile Photo">
      <label className="flex min-h-[156px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DFDFDF] bg-[#F9F9F9] text-center">
        {photoPreview ? <img src={photoPreview} alt="Preview" className="mb-2 h-20 w-20 rounded-full object-cover" /> : <Upload className="mb-2 h-8 w-8 text-[#9F8151]" />}
        <p className="text-sm font-medium text-[#0A4833]">Drag and drop or click to upload</p>
        <p className="text-xs text-[#6B7280]">PNG, JPG up to 5MB</p>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </label>
    </CreateUserSection>
  );
}
