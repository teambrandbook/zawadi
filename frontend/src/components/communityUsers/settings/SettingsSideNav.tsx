import type { SettingsSection, SettingsSectionId } from "./settingsTypes";

type Props = {
  activeSection: SettingsSectionId;
  sections: SettingsSection[];
  onSectionChange: (section: SettingsSectionId) => void;
};

export default function SettingsSideNav({ activeSection, sections, onSectionChange }: Props) {
  return (
    <aside className="h-fit rounded-lg border border-[#DFDFDF] bg-white p-5">
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
              activeSection === section.id ? "text-[#06402B]" : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#06402B]"
            }`}
          >
            <section.Icon className="h-4 w-4 shrink-0" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
