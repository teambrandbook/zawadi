import Link from "next/link";

type Props = {
  onSubmit?: () => void;
  isSubmitting?: boolean;
};

export default function CreateEventActions({ onSubmit, isSubmitting }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Cancel
      </Link>
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Save as Draft
      </Link>
      <button type="button" className="inline-flex h-9 items-center rounded-md bg-[#9F8151] px-4 text-xs text-white">
        Preview Event
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}
