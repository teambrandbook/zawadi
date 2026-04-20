import { Tag } from "lucide-react";

type ExpertiseSectionProps = {
  chips: Array<{ label: string }>;
  activeExpertise: string[];
  onToggle: (label: string) => void;
};

export default function ExpertiseSection({ chips, activeExpertise, onToggle }: ExpertiseSectionProps) {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
        <Tag size={16} />
        Areas of Expertise
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onToggle(chip.label)}
            className={
              activeExpertise.includes(chip.label)
                ? "rounded-full bg-[#9F8151] px-3 py-1.5 text-xs font-medium text-white"
                : "rounded-full bg-[#DFDFDF] px-3 py-1.5 text-xs font-medium text-[#4B5563]"
            }
          >
            {chip.label}
          </button>
        ))}
      </div>
    </article>
  );
}

