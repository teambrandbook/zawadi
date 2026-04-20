import { User } from "lucide-react";
import { Field, SelectField } from "./FormFields";

export default function BasicInformationSection() {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <User size={16} />
        Basic Information
      </h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Full Name *" placeholder="Enter full name" />
        <Field label="Email Address *" placeholder="nutritionist@email.com" />
        <Field label="Phone Number *" placeholder="+1 (555) 123-4567" />
        <Field label="Years of Experience *" placeholder="5" />
        <SelectField label="Gender" value="Select gender" />
        <Field label="Location *" placeholder="City, State" />
      </div>
    </article>
  );
}

