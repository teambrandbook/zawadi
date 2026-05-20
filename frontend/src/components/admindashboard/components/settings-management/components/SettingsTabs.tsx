import { Lock, Percent, Settings2, UserCog } from "lucide-react";
import type { SettingsTab } from "../settingsTypes";

type SettingsTabsProps = {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
};

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="rounded-lg border border-[#DFDFDF] bg-white p-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onTabChange("general")}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs sm:text-sm ${
            activeTab === "general" ? "bg-[#0A4833] font-semibold text-white" : "font-medium text-[#4B5563]"
          }`}
        >
          <UserCog size={13} />
          General
        </button>
        <button
          onClick={() => onTabChange("security")}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs sm:text-sm ${
            activeTab === "security" ? "bg-[#0A4833] font-semibold text-white" : "font-medium text-[#4B5563]"
          }`}
        >
          <Lock size={13} />
          Security &amp; Privacy
        </button>
        <button
          onClick={() => onTabChange("system")}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs sm:text-sm ${
            activeTab === "system" ? "bg-[#0A4833] font-semibold text-white" : "font-medium text-[#4B5563]"
          }`}
        >
          <Settings2 size={13} />
          System Preferences
        </button>
        <button
          onClick={() => onTabChange("tax")}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs sm:text-sm ${
            activeTab === "tax" ? "bg-[#0A4833] font-semibold text-white" : "font-medium text-[#4B5563]"
          }`}
        >
          <Percent size={13} />
          Tax &amp; Currency
        </button>
      </div>
    </div>
  );
}
