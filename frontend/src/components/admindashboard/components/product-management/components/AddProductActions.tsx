import { Plus, Save } from "lucide-react";

type Props = {
  onSubmit: () => void;
  onDraft: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
};

export default function AddProductActions({ onSubmit, onDraft, isSubmitting, submitLabel = "Create Product" }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-end sm:gap-4 lg:justify-start">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-[8px] bg-[#0A4833] px-3 text-[14px] font-medium tracking-[-0.5px] text-white disabled:opacity-60 sm:h-[50px] sm:min-w-[201px] sm:gap-3 sm:px-8 sm:text-[16px]"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? `${submitLabel === "Create Product" ? "Creating" : "Updating"}...` : submitLabel}
      </button>
      <button
        type="button"
        onClick={onDraft}
        disabled={isSubmitting}
        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-[8px] bg-[#9F8151] px-3 text-[14px] font-medium tracking-[-0.5px] text-white disabled:opacity-60 sm:h-[50px] sm:min-w-[187px] sm:gap-3 sm:px-8 sm:text-[16px]"
      >
        <Save className="h-4 w-4" />
        Save as Draft
      </button>
    </div>
  );
}
