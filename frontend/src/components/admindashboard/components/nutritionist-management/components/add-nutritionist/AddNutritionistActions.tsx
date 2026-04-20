import { Plus } from "lucide-react";

type AddNutritionistActionsProps = {
  onCreate: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
};

export default function AddNutritionistActions({ onCreate, onSaveDraft, onCancel }: AddNutritionistActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pb-2">
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-11 items-center gap-2 rounded-md bg-[#0A4833] px-5 text-sm font-medium text-white"
      >
        <Plus size={14} />
        Create Nutritionist
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="h-11 rounded-md border border-[#9F8151] px-5 text-sm font-medium text-[#9F8151]"
      >
        Save as Draft
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="h-11 rounded-md border border-[#DFDFDF] px-5 text-sm font-medium text-[#4B5563]"
      >
        Cancel
      </button>
    </div>
  );
}

