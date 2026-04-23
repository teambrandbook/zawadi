import { cn } from "@/utils/cn";
import type { ConsultantSettingsTab, ConsultantSettingsTabId } from "./settingsTypes";

type Props = {
  activeTab: ConsultantSettingsTabId;
  tabs: ConsultantSettingsTab[];
  onChange: (tab: ConsultantSettingsTabId) => void;
};

export default function SettingsTabs({ activeTab, tabs, onChange }: Props) {
  return (
    <div className="border-b border-[#DFDFDF]">
      <nav className="flex flex-wrap gap-6 sm:gap-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "border-b-2 px-1 pb-3 pt-1 text-sm transition",
                isActive ? "border-[#9F8151] font-medium text-[#0A4833]" : "border-transparent text-[#6B7280] hover:text-[#0A4833]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
