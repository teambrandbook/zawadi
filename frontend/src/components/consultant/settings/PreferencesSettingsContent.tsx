import { cn } from "@/utils/cn";
import type { PreferencesSettingsData } from "./settingsTypes";

type Props = {
  data: PreferencesSettingsData;
  onSelectChange: (fieldId: string, value: string) => void;
  onToggleChange: (toggleId: string) => void;
  onSegmentChange: (groupId: string, value: string) => void;
  onSave: () => void;
  onReset: () => void;
};

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span className={cn("relative inline-flex h-6 w-11 rounded-full transition", enabled ? "bg-[#9F8151]" : "bg-[#E5E7EB]")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", enabled ? "left-[22px]" : "left-0.5")} />
    </span>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (fieldId: string, value: string) => void;
}) {
  return (
    <label className="text-xs font-medium text-[#0A4833]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        className="mt-2 h-[45px] w-full rounded-[12px] border border-[#DFDFDF] bg-white px-3 text-sm text-[#111827] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SegmentedControl({
  groupId,
  label,
  value,
  options,
  onChange,
}: {
  groupId: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (groupId: string, value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#0A4833]">{label}</p>
      <div className="mt-2 inline-flex rounded-[8px] border border-[#DFDFDF] bg-white p-1">
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(groupId, option.value)}
              className={cn(
                "min-w-[94px] rounded-[6px] px-4 py-2 text-xs font-medium transition",
                isActive ? "bg-[#9F8151] text-white" : "text-[#6B7280] hover:bg-[#F8F6F1]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleGrid({
  items,
  onToggle,
}: {
  items: { id: string; label: string; enabled: boolean }[];
  onToggle: (toggleId: string) => void;
}) {
  return (
    <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#0A4833]">{item.label}</p>
          <button type="button" onClick={() => onToggle(item.id)} aria-pressed={item.enabled} aria-label={item.label}>
            <Toggle enabled={item.enabled} />
          </button>
        </article>
      ))}
    </div>
  );
}

export default function PreferencesSettingsContent({ data, onSelectChange, onToggleChange, onSegmentChange, onSave, onReset }: Props) {
  return (
    <div className="space-y-5">
      <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
        <div className="space-y-8">
          <div className="border-b border-[#DFDFDF] pb-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Dashboard Preferences</h2>
            <div className="mt-5 space-y-4">
              <div className="max-w-[515px]">
                <SelectField {...data.dashboardLandingPage} onChange={onSelectChange} />
              </div>
              <SegmentedControl
                groupId="preferredDashboardView"
                label={data.preferredDashboardView.label}
                value={data.preferredDashboardView.value}
                options={data.preferredDashboardView.options}
                onChange={onSegmentChange}
              />
              <ToggleGrid items={data.dashboardToggles} onToggle={onToggleChange} />
            </div>
          </div>

          <div className="border-b border-[#DFDFDF] pb-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Consultation Preferences</h2>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {data.consultationSelects.map((field) => (
                  <SelectField key={field.id} {...field} onChange={onSelectChange} />
                ))}
              </div>
              <ToggleGrid items={data.consultationToggles} onToggle={onToggleChange} />
            </div>
          </div>

          <div className="border-b border-[#DFDFDF] pb-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Diet Plan Preferences</h2>
            <div className="mt-5 space-y-4">
              <div className="max-w-[515px]">
                <SelectField {...data.dietPlanTemplate} onChange={onSelectChange} />
              </div>
              <SegmentedControl
                groupId="planViewDefault"
                label={data.planViewDefault.label}
                value={data.planViewDefault.value}
                options={data.planViewDefault.options}
                onChange={onSegmentChange}
              />
              <ToggleGrid items={data.dietPlanToggles} onToggle={onToggleChange} />
            </div>
          </div>

          <div className="border-b border-[#DFDFDF] pb-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Communication Preferences</h2>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {data.communicationSelects.map((field) => (
                  <SelectField key={field.id} {...field} onChange={onSelectChange} />
                ))}
              </div>
              <ToggleGrid items={data.communicationToggles} onToggle={onToggleChange} />
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Regional &amp; Interface Preferences</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {data.regionalSelects.map((field) => (
                <SelectField key={field.id} {...field} onChange={onSelectChange} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-[50px] items-center justify-center rounded-[12px] bg-[#9F8151] px-6 text-sm font-medium text-white transition hover:bg-[#8C7247]"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[50px] items-center justify-center rounded-[12px] border border-[#DFDFDF] bg-white px-6 text-sm font-medium text-[#0A4833] transition hover:bg-[#FAFAF8]"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
