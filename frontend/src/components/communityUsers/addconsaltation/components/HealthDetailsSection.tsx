"use client";

type HealthDetails = {
  healthGoal: string;
  conditions: string;
  notes: string;
};

type Props = {
  value: HealthDetails;
  onChange: <K extends keyof HealthDetails>(field: K, fieldValue: HealthDetails[K]) => void;
};

const inputClass =
  "w-full rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 py-2 text-sm text-[#0A4833] placeholder:text-[#9CA3AF] outline-none focus:border-[#0A4833]";

export default function HealthDetailsSection({ value, onChange }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h2 className="text-xl font-semibold text-[#0A4833]">3. Health Details</h2>
      <p className="mt-1 text-sm text-[#6B7280]">Share details to personalize your consultation plan.</p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#0A4833]">Primary Health Goal</label>
          <input
            className={inputClass}
            value={value.healthGoal}
            onChange={(e) => onChange("healthGoal", e.target.value)}
            placeholder="e.g. Weight management"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#0A4833]">Medical Conditions (Optional)</label>
          <input
            className={inputClass}
            value={value.conditions}
            onChange={(e) => onChange("conditions", e.target.value)}
            placeholder="e.g. Thyroid, diabetes, BP"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#0A4833]">Additional Notes</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] p-3 text-sm text-[#0A4833] placeholder:text-[#9CA3AF] outline-none focus:border-[#0A4833]"
            value={value.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Tell us about your daily routine, diet preferences, and expectations."
          />
        </div>
      </div>
    </section>
  );
}

export type { HealthDetails };
