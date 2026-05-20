"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Download, FileText, Plus, Star, ThumbsUp } from "lucide-react";

type BlogRow = {
  status: string;
};

type Props = {
  rows?: BlogRow[];
};

export default function BlogManagementHeaderStats({ rows = [] }: Props) {
  const total = rows.length;
  const published = rows.filter((r) => r.status === "published" || r.status === "Approved").length;
  const pending = rows.filter((r) => r.status === "pending" || r.status === "Pending").length;
  const featured = rows.filter((r) => r.status === "featured").length;
  const approved = published;
  const rejected = rows.filter((r) => r.status === "rejected").length;
  const draft = rows.filter((r) => r.status === "draft").length;

  // One week ago rough estimate: we don't have timestamps from props, so show total pending
  const thisWeek = pending;

  const primaryStats = [
    { label: "Total Blogs", value: total > 0 ? String(total) : "—", note: "+12%", icon: FileText, noteColor: "text-[#16A34A]", iconWrap: "bg-[#EAF3EF]", iconColor: "text-[#0A4833]" },
    { label: "Pending Review", value: pending > 0 ? String(pending) : "—", note: "Review", icon: Clock3, noteColor: "text-[#A1844F]", iconWrap: "bg-[#F7F3EA]", iconColor: "text-[#A1844F]" },
    { label: "Published Blogs", value: published > 0 ? String(published) : "—", note: "Live", icon: CheckCircle2, noteColor: "text-[#16A34A]", iconWrap: "bg-[#EAF3EF]", iconColor: "text-[#16A34A]" },
    { label: "Featured Blogs", value: featured > 0 ? String(featured) : "—", note: "Featured", icon: Star, noteColor: "text-[#A1844F]", iconWrap: "bg-[#F7F3EA]", iconColor: "text-[#A1844F]" },
  ];

  const quickStats = [
    { label: "Approved Blogs", value: approved > 0 ? String(approved) : "—", dot: "bg-[#22C55E]" },
    { label: "Rejected Blogs", value: rejected > 0 ? String(rejected) : "—", dot: "bg-[#EF4444]" },
    { label: "Draft Blogs", value: draft > 0 ? String(draft) : "—", dot: "bg-[#6B7280]" },
    { label: "This Week", value: thisWeek > 0 ? String(thisWeek) : "—", dot: "bg-[#A1844F]" },
  ];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-[32px] font-semibold leading-tight text-[#0A4833]">Blogs Management</h1>
          <p className="text-[13px] text-[#6B7280]">Manage wellness stories, user experiences, and editorial blog content across the ZEWADI platform.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D9DEE3] bg-white px-3 text-[13px] text-[#0A4833]">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#0A4833] bg-white px-3 text-[13px] text-[#0A4833]">
            <ThumbsUp className="h-4 w-4" />
            Bulk Review
          </button>
          <Link href="/admindashboard/blog/add" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0A4833] px-3 text-[13px] text-white">
            <Plus className="h-4 w-4" />
            Add Blog
          </Link>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="h-[126px] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className={`grid h-8 w-8 place-items-center rounded-md ${stat.iconWrap}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </span>
                <span className={`truncate text-[11px] font-medium ${stat.noteColor}`}>{stat.note}</span>
              </div>
              <p className="truncate text-[28px] font-semibold leading-none text-[#0A4833]">{stat.value}</p>
              <p className="mt-2 truncate text-[13px] text-[#667085]">{stat.label}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-[#E4E7EC] bg-white p-3.5">
            <p className="mb-1 text-[12px] text-[#6B7280]">{stat.label}</p>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${stat.dot}`} />
              <p className="text-[24px] font-semibold leading-none text-[#0A4833]">{stat.value}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
