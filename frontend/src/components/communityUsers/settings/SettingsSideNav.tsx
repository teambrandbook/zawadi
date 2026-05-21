import type { SettingsSection, SettingsSectionId } from "./settingsTypes";

type Props = {
  activeSection: SettingsSectionId;
  sections: SettingsSection[];
  onSectionChange: (section: SettingsSectionId) => void;
};

export default function SettingsSideNav({ activeSection, sections, onSectionChange }: Props) {
  return (
    <aside className="h-fit max-w-full overflow-hidden rounded-lg border border-[#DFDFDF] bg-white p-2 lg:p-5">
      <div className="flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            className={`flex h-11 min-w-fit shrink-0 items-center gap-2 rounded-md px-3 text-left text-xs font-medium transition sm:gap-3 sm:text-sm lg:w-full ${
              activeSection === section.id ? "bg-[#06402B] text-white" : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#06402B]"
            }`}
          >
            <section.Icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{section.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
