"use client";

type Props = {
  onSave: () => void;
};

export default function AddNoteHeader({ onSave }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[30px] font-bold tracking-[-0.03em] text-[#0A4833]">Add Notes</h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Record important client observations, wellness guidance, and follow-up recommendations from the session.
        </p>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#0A4833] px-8 text-sm font-medium text-[#EBE1CF] hover:bg-[#083B2A]"
      >
        Save
      </button>
    </div>
  );
}
