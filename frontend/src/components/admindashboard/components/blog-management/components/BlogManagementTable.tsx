"use client";
import { useState } from "react";
import { Check, Eye, Heart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import BlogDeleteConfirmModal from "@/components/admindashboard/components/blog-management/components/BlogDeleteConfirmModal";

type BlogStatus = "published" | "pending" | "draft" | string;

type BlogRow = {
  id: string;
  title: string;
  read: string;
  category: string;
  contributor: string;
  contributorImage: string | null;
  status: BlogStatus;
  published: string;
  likes: number;
  views: number;
  image: string;
  excerpt: string;
  content: string;
};

type Props = {
  rows: BlogRow[];
  onView: (blog: BlogRow) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
};

function StatusBadge({ status }: { status: BlogStatus }) {
  const isPublished = status === "published" || status === "Approved";
  const isDraft = status === "draft" || status === "Draft";
  if (isPublished) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F7EC] px-2.5 py-1 text-[11px] font-medium text-[#15803D]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
        Published
      </span>
    );
  }
  if (isDraft) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-medium text-[#475467]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6B7280]" />
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6D8] px-2.5 py-1 text-[11px] font-medium text-[#A16207]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#A16207]" />
      Pending Review
    </span>
  );
}

function RowActions({
  blogId,
  blog,
  status,
  onView,
  onStatusChange,
  onDelete,
}: {
  blogId: string;
  blog: BlogRow;
  status: BlogStatus;
  onView: (blog: BlogRow) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const isPublished = status === "published" || status === "Approved";
  const isDraft = status === "draft" || status === "Draft";

  async function handleApprove() {
    try {
      await api.patch(`/blog/admin/${blogId}/status/`, { status: "published" });
      onStatusChange(blogId, "published");
      toast.success("Blog approved.");
    } catch {
      toast.error("Failed to update blog status. Please try again.");
    }
  }

  async function handleDelete() {
    onDelete(blogId);
  }

  function handleEdit() {
    router.push(`/admindashboard/blog/add?blogId=${blogId}`);
  }

  if (isPublished || isDraft) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onView(blog)} className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={handleEdit} className="grid h-7 w-7 place-items-center rounded-md bg-[#EAF3EF] text-[#0A4833]">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={handleDelete} className="grid h-7 w-7 place-items-center rounded-md bg-[#FEEDEE] text-[#DC2626]">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleApprove}
        className="inline-flex items-center gap-1 rounded-md bg-[#E7F7EC] px-2.5 py-1 text-[11px] font-medium text-[#15803D]"
      >
        <Check className="h-3 w-3" />
        Approve
      </button>
      <button type="button" onClick={handleDelete} className="grid h-7 w-7 place-items-center rounded-md bg-[#FEEDEE] text-[#DC2626]">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function BlogManagementTable({ rows, onView, onStatusChange, onDelete }: Props) {
  const [pendingDelete, setPendingDelete] = useState<BlogRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/blog/${pendingDelete.id}/`);
      onDelete(pendingDelete.id);
      toast.success("Blog deleted.");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-[#0A4833]">All Blogs</h2>
            <span className="text-[12px] text-[#98A2B3]">{rows.length} total</span>
          </div>
          <button type="button" className="text-[12px] font-medium text-[#0A4833]">
            Bulk Actions
          </button>
        </div>

        {rows.length === 0 && (
          <div className="p-8 text-center text-sm text-[#6B7280]">No blogs found.</div>
        )}

        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F9FAFB] text-[12px] text-[#475467]">
                <tr>
                  <th className="w-10 px-3 py-2.5">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#D0D5DD]" />
                  </th>
                  <th className="px-3 py-2.5">Blog</th>
                  <th className="px-3 py-2.5">Contributor</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Published</th>
                  <th className="px-3 py-2.5">Engagement</th>
                  <th className="px-3 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[#F2F4F7]">
                    <td className="px-3 py-3.5">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#D0D5DD]" />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.image} alt={row.title} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="max-w-[210px]">
                          <p className="text-[13px] font-semibold text-[#0A4833]">{row.title}</p>
                          <p className="mt-1 text-[12px] text-[#6B7280]">{row.read}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        {row.contributorImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.contributorImage} alt={row.contributor} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EAF3EF] text-[11px] font-semibold text-[#0A4833]">
                            {row.contributor.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <p className="text-[#475467]">{row.contributor}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#8B5E2A]">{row.category}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-[#475467]">{row.published}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-4 text-[#475467]">
                        <span className="inline-flex items-center gap-1 text-[12px]">
                          <Heart className="h-3.5 w-3.5 text-[#A1844F]" />
                          {row.likes}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px]">
                          <Eye className="h-3.5 w-3.5 text-[#0A4833]" />
                          {row.views}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <RowActions
                        blogId={row.id}
                        blog={row}
                        status={row.status}
                        onView={onView}
                        onStatusChange={onStatusChange}
                        onDelete={(id) => setPendingDelete(rows.find((item) => item.id === id) ?? null)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {pendingDelete && (
        <BlogDeleteConfirmModal
          blogTitle={pendingDelete.title}
          isDeleting={isDeleting}
          onCancel={() => {
            if (!isDeleting) setPendingDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
