import { CircleUserRound } from "lucide-react";
import type { ProfileDetailItem } from "./profileTypes";

type Props = {
  details: ProfileDetailItem[];
  values?: {
    full_name: string;
    user_name: string;
    email: string;
    phone: string;
    location: string;
    qualification: string;
    years_of_experience: string;
  };
  onChange?: (field: string, value: string) => void;
};

const inputClass =
  "mt-2 h-11 w-full rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 text-[15px] text-[#111827] outline-none transition focus:border-[#A38355] focus:ring-2 focus:ring-[#EBE1CF]";

export default function BasicDetailsCard({ details, values, onChange }: Props) {
  if (!values || !onChange) {
    return (
      <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
        <div className="flex items-center gap-2 text-[#0A4833]">
          <CircleUserRound className="h-4 w-4 text-[#A38355]" />
          <h2 className="text-lg font-semibold tracking-[-0.5px]">Basic Details</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {details.map((item) => (
            <article key={item.label}>
              <p className="text-xs font-medium text-[#4B5563]">{item.label}</p>
              <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
                {item.value}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <CircleUserRound className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Basic Details</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Full Name</p>
          <input value={values.full_name} onChange={(event) => onChange("full_name", event.target.value)} className={inputClass} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">User Name</p>
          <input value={values.user_name} onChange={(event) => onChange("user_name", event.target.value)} className={inputClass} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Email</p>
          <input value={values.email} disabled className={`${inputClass} cursor-not-allowed text-[#6B7280]`} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Phone</p>
          <input value={values.phone} onChange={(event) => onChange("phone", event.target.value)} className={inputClass} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Location</p>
          <input value={values.location} onChange={(event) => onChange("location", event.target.value)} className={inputClass} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Qualification</p>
          <input value={values.qualification} onChange={(event) => onChange("qualification", event.target.value)} className={inputClass} />
        </article>
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Years of Experience</p>
          <input
            type="number"
            min="0"
            value={values.years_of_experience}
            onChange={(event) => onChange("years_of_experience", event.target.value)}
            className={inputClass}
          />
        </article>
      </div>
    </section>
  );
}
