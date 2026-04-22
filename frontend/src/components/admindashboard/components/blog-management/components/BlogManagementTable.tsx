"use client";

import Image from "next/image";
import { Check, Eye, MoreVertical, Pencil } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type BlogStatus = "published" | "pending" | "draft" | string;

type BlogRow = {
  id: string;
  title: string;
  read: string;
  category: string;
  contributor: string;
  status: BlogStatus;
  published: string;
  engagement: string;
  image: string;
};

type Props = {
  rows: BlogRow[];
  onStatusChange: (id: string, newStatus: string) => void;
};

function StatusBadge({ status }: { status: BlogStatus }) {
  const isPublished = status === "published" || status === "Approved";
  if (isPublished) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F7EC] px-2.5 py-1 text-[11px] font-medium text-[#15803D]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
        Published
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
  status,
  onStatusChange,
}: {
  blogId: string;
  status: BlogStatus;
  onStatusChange: (id: string, newStatus: string) => void;
}) {
  const isPublished = status === "published" || status === "Approved";

  async function handleApprove() {
    try {
      await api.patch(`/blog/admin/${blogId}/status/`, { status: "published" });
      onStatusChange(blogId, "published");
      toast.success("Blog approved.");
    } catch {
      toast.error("Failed to update blog status. Please try again.");
    }
  }

  if (isPublished) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#EAF3EF] text-[#0A4833]">
          <Pencil className="h-3.5 w-3.5" />
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
      <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#F3F4F6] text-[#667085]">
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function BlogManagementTable({ rows, onStatusChange }: Props) {
  return (
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
                      <Image src={row.image} alt={row.title} width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="max-w-[210px]">
                        <p className="text-[13px] font-semibold text-[#0A4833]">{row.title}</p>
                        <p className="mt-1 text-[12px] text-[#6B7280]">{row.read}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-[#475467]">{row.contributor}</td>
                  <td className="px-3 py-3.5 text-[#8B5E2A]">{row.category}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3.5 text-[#475467]">{row.published}</td>
                  <td className="px-3 py-3.5 text-[#475467]">{row.engagement}</td>
                  <td className="px-3 py-3.5">
                    <RowActions blogId={row.id} status={row.status} onStatusChange={onStatusChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
