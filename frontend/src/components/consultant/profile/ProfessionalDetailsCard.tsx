import { BriefcaseBusiness, ChevronDown } from "lucide-react";
import type { ProfessionalProfileData } from "./profileTypes";

type Props = {
  details: ProfessionalProfileData;
  values?: {
    short_bio: string;
    experience_areas: string;
    languages_spoken: string;
    session_type: string;
    certifications: string;
    consultation_fee: string;
  };
  onChange?: (field: string, value: string) => void;
};

const fieldClass =
  "mt-2 w-full rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827] outline-none transition focus:border-[#A38355] focus:ring-2 focus:ring-[#EBE1CF]";

export default function ProfessionalDetailsCard({ details, values, onChange }: Props) {
  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <BriefcaseBusiness className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Professional Profile</h2>
      </div>

      <div className="mt-5 space-y-4">
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Bio</p>
          {values && onChange ? (
            <textarea
              value={values.short_bio}
              onChange={(event) => onChange("short_bio", event.target.value)}
              rows={4}
              className={`${fieldClass} resize-none leading-6`}
            />
          ) : (
            <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] leading-6 text-[#6B7280]">
              {details.bio}
            </div>
          )}
        </article>

        <article>
          <p className="text-xs font-medium text-[#4B5563]">Expertise</p>
          {values && onChange ? (
            <input value={values.experience_areas} onChange={(event) => onChange("experience_areas", event.target.value)} className={fieldClass} />
          ) : (
            <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
              {details.expertise}
            </div>
          )}
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          <article>
            <p className="text-xs font-medium text-[#4B5563]">Languages</p>
            {values && onChange ? (
              <input value={values.languages_spoken} onChange={(event) => onChange("languages_spoken", event.target.value)} className={fieldClass} />
            ) : (
              <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
                {details.languages}
              </div>
            )}
          </article>

          <article>
            <p className="text-xs font-medium text-[#4B5563]">Consultation Modes</p>
            {values && onChange ? (
              <div className="relative">
                <select value={values.session_type} onChange={(event) => onChange("session_type", event.target.value)} className={`${fieldClass} appearance-none pr-10`}>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="chat">Chat</option>
                  <option value="video,audio">Video, Audio</option>
                  <option value="video,audio,chat">Video, Audio, Chat</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#111827]" />
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
                <span>{details.consultationModes}</span>
                <ChevronDown className="h-4 w-4 text-[#111827]" />
              </div>
            )}
          </article>
        </div>

        {values && onChange ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <article>
              <p className="text-xs font-medium text-[#4B5563]">Certifications</p>
              <input value={values.certifications} onChange={(event) => onChange("certifications", event.target.value)} className={fieldClass} />
            </article>
            <article>
              <p className="text-xs font-medium text-[#4B5563]">Consultation Fee</p>
              <input
                type="number"
                min="0"
                value={values.consultation_fee}
                onChange={(event) => onChange("consultation_fee", event.target.value)}
                className={fieldClass}
              />
            </article>
          </div>
        ) : null}

        <article>
          <p className="text-xs font-medium text-[#4B5563]">Specialization Tags</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {(values?.experience_areas ? values.experience_areas.split(",").map((tag) => tag.trim()).filter(Boolean) : details.specializationTags).map((tag) => (
              <span key={tag} className="text-xs font-medium text-[#0A4833]">
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
