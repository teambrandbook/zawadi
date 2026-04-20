import { GraduationCap } from "lucide-react";
import { Field, TextAreaField } from "./FormFields";

export default function ProfessionalDetailsSection() {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <GraduationCap size={16} />
        Professional Details
      </h2>

      <div className="mt-4 space-y-3">
        <Field label="Qualification *" placeholder="e.g., Master's in Nutrition Science" />
        <Field label="Certifications" placeholder="e.g., Certified Nutrition Specialist" />
        <TextAreaField label="Short Bio *" placeholder="Brief professional summary..." />
        <Field label="Languages Spoken" placeholder="English, Spanish, French" />
      </div>
    </article>
  );
}

