import { BriefcaseBusiness, ChevronDown, Plus } from "lucide-react";
import type { ProfessionalProfileData } from "./profileTypes";

type Props = {
  details: ProfessionalProfileData;
};

export default function ProfessionalDetailsCard({ details }: Props) {
  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <BriefcaseBusiness className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Professional Profile</h2>
      </div>

      <div className="mt-5 space-y-4">
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Bio</p>
          <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] leading-6 text-[#6B7280]">
            {details.bio}
          </div>
        </article>

        <article>
          <p className="text-xs font-medium text-[#4B5563]">Expertise</p>
          <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
            {details.expertise}
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          <article>
            <p className="text-xs font-medium text-[#4B5563]">Languages</p>
            <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
              {details.languages}
            </div>
          </article>

          <article>
            <p className="text-xs font-medium text-[#4B5563]">Consultation Modes</p>
            <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
              <span>{details.consultationModes}</span>
              <ChevronDown className="h-4 w-4 text-[#111827]" />
            </div>
          </article>
        </div>

        <article>
          <p className="text-xs font-medium text-[#4B5563]">Specialization Tags</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {details.specializationTags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-[#0A4833]">
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 inline-flex h-8 items-center gap-2 rounded-full bg-[#F2EFEB] px-3 text-sm text-[#6B7280] transition hover:bg-[#E7E1D8]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Tag</span>
          </button>
        </article>
      </div>
    </section>
  );
}
