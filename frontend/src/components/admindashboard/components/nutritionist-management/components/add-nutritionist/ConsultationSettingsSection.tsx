import { Settings } from "lucide-react";
import { Field, SelectField } from "./FormFields";

export default function ConsultationSettingsSection() {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <Settings size={16} />
        Consultation Settings
      </h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Consultation Fee (USD) *" placeholder="75" />
        <SelectField label="Session Duration (minutes) *" value="30 minutes" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[#0A4833]">Session Types Supported *</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#374151]">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-[#0A4833]" />
            Video Call
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 accent-[#0A4833]" />
            Audio Call
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 accent-[#0A4833]" />
            Chat
          </label>
        </div>
      </div>
    </article>
  );
}

