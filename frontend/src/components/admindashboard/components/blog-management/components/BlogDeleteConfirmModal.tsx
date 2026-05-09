"use client";

type Props = {
  blogTitle: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function BlogDeleteConfirmModal({ blogTitle, isDeleting, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-[#0A4833]">Delete Blog</h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Are you sure you want to delete <span className="font-medium text-[#344054]">{blogTitle}</span>?
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-[#D0D5DD] bg-white px-4 py-2 text-sm text-[#344054] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
