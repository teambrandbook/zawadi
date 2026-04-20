import { Building2, Mail, Phone, ChevronDown } from "lucide-react";
import type { PlatformInformation } from "../settingsTypes";

type PlatformInformationCardProps = {
  data: PlatformInformation;
};

export default function PlatformInformationCard({ data }: PlatformInformationCardProps) {
  return (
    <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A4833]/10 text-[#0A4833]">
          <Building2 size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0A4833]">Platform Information</h2>
          <p className="mt-1 text-xs text-[#0A4833]/60 sm:text-sm">
            Configure your platform&apos;s basic identity and branding details
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Platform Name</p>
          <div className="h-[44px] rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 py-2 text-sm text-[#0A4833] sm:text-base">
            {data.platformName}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Support Email</p>
          <div className="flex h-[44px] items-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 text-sm text-[#0A4833] sm:text-base">
            <Mail size={13} className="text-[#9F8151]" />
            {data.supportEmail}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Support Phone Number</p>
          <div className="flex h-[44px] items-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 text-sm text-[#0A4833] sm:text-base">
            <Phone size={13} className="text-[#9F8151]" />
            {data.supportPhone}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Region / Country</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 text-sm text-[#0A4833] sm:text-base">
            <span>{data.region}</span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>
      </div>
    </article>
  );
}
