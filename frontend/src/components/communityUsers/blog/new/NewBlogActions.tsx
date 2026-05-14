import Link from "next/link";
import { Eye, Save, Send } from "lucide-react";

export default function NewBlogActions({
  isSubmitting,
  onSubmit,
  onSaveDraft,
}: {
  isSubmitting: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button type="button" onClick={onSubmit} disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#06402B] text-sm font-semibold text-white hover:bg-[#053020] disabled:opacity-60">
        <Send className="h-4 w-4" />
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </button>
      <button type="button" onClick={onSaveDraft} disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#A88751] text-sm font-semibold text-white hover:bg-[#8E7346] disabled:opacity-60">
        <Save className="h-4 w-4" />
        Save as Draft
      </button>
      <Link
        href="/communityDashBoard/add-blog"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#D1D5DB] bg-white text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
      >
        <Eye className="h-4 w-4" />
        Preview Blog
      </Link>
    </div>
  );
}
