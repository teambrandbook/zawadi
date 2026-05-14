import { Eye, Plus, Save } from "lucide-react";

type Props = {
  onSubmit: () => void;
  onDraft: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
};

export default function AddProductActions({ onSubmit, onDraft, isSubmitting, submitLabel = "Create Product" }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-[50px] min-w-[201px] items-center justify-center gap-3 rounded-[8px] bg-[#0A4833] px-8 text-[16px] font-medium tracking-[-0.5px] text-white disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? `${submitLabel === "Create Product" ? "Creating" : "Updating"}...` : submitLabel}
      </button>
      <button
        type="button"
        onClick={onDraft}
        disabled={isSubmitting}
        className="inline-flex h-[50px] min-w-[187px] items-center justify-center gap-3 rounded-[8px] bg-[#9F8151] px-8 text-[16px] font-medium tracking-[-0.5px] text-white disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        Save as Draft
      </button>
      <button
        type="button"
        className="inline-flex h-[50px] min-w-[153px] items-center justify-center gap-3 rounded-[8px] border border-[#DFDFDF] bg-white px-8 text-[16px] font-medium tracking-[-0.5px] text-[#0A4833]"
      >
        <Eye className="h-4 w-4" />
        Preview
      </button>
    </div>
  );
}
