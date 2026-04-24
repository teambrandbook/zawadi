"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import BlogManagementFilters from "@/components/admindashboard/components/blog-management/components/BlogManagementFilters";
import BlogManagementHeaderStats from "@/components/admindashboard/components/blog-management/components/BlogManagementHeaderStats";
import BlogManagementTable from "@/components/admindashboard/components/blog-management/components/BlogManagementTable";

type BlogRow = {
  id: string;
  status: string;
  title: string;
  read: string;
  category: string;
  contributor: string;
  published: string;
  engagement: string;
  image: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiBlog(item: Record<string, any>, index: number): BlogRow {
  const status = String(item.status ?? "pending").toLowerCase();
  return {
    id: String(item.id ?? `b-${index}`),
    title: String(item.title ?? "Untitled Blog"),
    read: item.reading_time ? `${item.reading_time} min read` : "—",
    category: String(item.category ?? "—"),
    contributor: String(item.author ?? item.contributor ?? item.author_name ?? "Unknown"),
    status,
    published:
      status === "published" && item.published_at
        ? new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : status === "published" && item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Not Published",
    engagement: item.views ? `${item.views} | ${item.comments ?? 0}` : "—",
    image: String(item.cover_image ?? item.image ?? "/blog/blog-1.webp"),
  };
}

export default function BlogManagementPage() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blog/admin/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRows(raw.map(mapApiBlog));
      } catch {
        // Silent fail — table handles its own error state
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="w-full bg-[#F7F8FA] p-3 lg:p-5">
      <div className="mx-auto max-w-[1180px] space-y-3">
        <BlogManagementHeaderStats rows={rows} />
        <BlogManagementFilters />
        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading blogs...
          </div>
        )}
        {!isLoading && <BlogManagementTable rows={rows} onStatusChange={(id, newStatus) => {
          setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
        }} />}
      </div>
    </section>
  );
}
