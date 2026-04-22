import Image from "next/image";
import { Camera } from "lucide-react";

type Props = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  hint: string;
};

export default function ProfilePhotoCard({ name, imageSrc, imageAlt, hint }: Props) {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white px-5 py-6 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#EBE1CF] bg-[#F7F4EE]">
            <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="96px" />
          </div>

          <button
            type="button"
            className="absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#A38355] text-white transition hover:bg-[#8E7149]"
            aria-label={`Change photo for ${name}`}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-[-0.5px] text-[#0A4833]">Profile Photo</h2>
          <p className="mt-2 text-sm text-[#4B5563]">{hint}</p>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] transition hover:bg-[#E0D2B7]"
          >
            Change Photo
          </button>
        </div>
      </div>
    </section>
  );
}
