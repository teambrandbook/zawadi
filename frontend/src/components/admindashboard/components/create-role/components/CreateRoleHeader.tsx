import { Save } from "lucide-react";
import Link from "next/link";

type Props = {
  onSave: () => void;   // ✅ function to call when clicked
  loading: boolean;     // ✅ show loading state
};

export default function CreateRoleHeader({ onSave, loading }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold leading-none text-[#06402B]">Create Role</h1>
        <p className="mt-2 text-base leading-6 text-[#5C8A79]">
          Define a new admin role, configure permissions, and control platform access securely.
        </p>
      </div>

      <button
        onClick={onSave}      // ✅ call save function
        disabled={loading}    // ✅ disable while saving
        className="inline-flex h-12 min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#06402B] px-5 text-sm font-semibold text-white transition hover:bg-[#075438] disabled:opacity-50"
      >
        <Save size={16} />
        <span>{loading ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  );
}