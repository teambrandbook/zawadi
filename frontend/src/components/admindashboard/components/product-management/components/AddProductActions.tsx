import { Eye, Plus } from "lucide-react";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
};

export default function AddProductActions({ onSubmit, isSubmitting }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0A4833] px-4 text-[12px] font-medium text-white disabled:opacity-60"
      >
        <Plus className="h-3.5 w-3.5" />
        {isSubmitting ? "Creating..." : "Create Product"}
      </button>
      <button type="button" className="inline-flex h-9 items-center rounded-md bg-[#A1844F] px-4 text-[12px] font-medium text-white">
        Save as Draft
      </button>
      <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-4 text-[12px] font-medium text-[#344054]">
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>
    </div>
  );
}
