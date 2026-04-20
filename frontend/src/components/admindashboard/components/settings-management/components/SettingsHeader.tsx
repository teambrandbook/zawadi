import { Save, Search } from "lucide-react";

type SettingsHeaderProps = {
  onSave: () => void;
};

export default function SettingsHeader({ onSave }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#0A4833]">Settings</h1>
        <p className="mt-1 max-w-[500px] text-xs leading-5 text-[#4B5563] sm:text-sm">
          Manage platform configurations, communication preferences, and system controls
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <div className="flex h-[38px] min-w-[270px] items-center gap-2 rounded-lg border border-[#DFDFDF] bg-white px-3">
          <Search size={14} className="text-[#6B7280]" />
          <span className="text-xs text-[#6B7280] sm:text-sm">Search settings...</span>
        </div>
        <button
          onClick={onSave}
          className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-[#0A4833] px-4 text-xs font-semibold text-white sm:text-sm"
        >
          <Save size={13} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
