import CreateUserSection from "./CreateUserSection";

type Props = {
  notes: string;
  onChange: (value: string) => void;
};

export default function NotesSection({ notes, onChange }: Props) {
  return (
    <CreateUserSection title="Admin Notes & Remarks">
      <label className="text-sm text-[#0A4833]">Internal Notes
        <textarea
          className="mt-1 h-32 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] p-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2"
          placeholder="Add any internal observations or tags for this user account..."
          value={notes}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <p className="mt-2 text-xs text-[#6B7280]">These notes are only visible to administrators</p>
    </CreateUserSection>
  );
}
