import { Camera, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  hint: string;
  isUploading?: boolean;
  isSaving?: boolean;
  onPhotoChange: (file: File) => void;
  onSave?: () => void;
};

export default function ProfilePhotoCard({
  name,
  imageSrc,
  imageAlt,
  hint,
  isUploading = false,
  isSaving = false,
  onPhotoChange,
  onSave,
}: Props) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "C";

  useEffect(() => {
    setHasImageError(false);
  }, [imageSrc]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
    event.target.value = "";
  }

  return (
    <section className="relative rounded-[12px] border border-[#DFDFDF] bg-white px-5 py-6 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:px-6">
      <button
        type="button"
        onClick={onSave}
        disabled={isUploading || isSaving}
        className="absolute right-5 top-5 inline-flex h-9 min-w-[104px] items-center justify-center rounded-[8px] bg-[#0A4833] px-6 text-sm font-semibold text-white transition hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:bg-[#A7B5AF] sm:right-6"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#EBE1CF] bg-[#F7F4EE]">
            {imageSrc && !hasImageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" onError={() => setHasImageError(true)} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[#0A4833]">
                {initials}
              </div>
            )}
          </div>

          <label
            className="absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#A38355] text-white transition hover:bg-[#8E7149]"
            aria-label={`Change photo for ${name}`}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploading}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-[-0.5px] text-[#0A4833]">Profile Photo</h2>
          <p className="mt-2 text-sm text-[#4B5563]">{hint}</p>
          <label
            className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-[8px] bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] transition hover:bg-[#E0D2B7]"
          >
            {isUploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploading}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
