import Link from "next/link";

type Props = {
  onSubmit?: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  draftLabel?: string;
};

export default function CreateEventActions({ onSubmit, onSaveDraft, isSubmitting, submitLabel = "Create Event", draftLabel = "Save as Draft" }: Props) {
  function handlePreview() {
    document.getElementById("event-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Cancel
      </Link>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563] disabled:opacity-60"
      >
        {draftLabel}
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
