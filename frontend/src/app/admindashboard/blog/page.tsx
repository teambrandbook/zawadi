"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import BlogManagementFilters from "@/components/admindashboard/components/blog-management/components/BlogManagementFilters";
import BlogManagementHeaderStats from "@/components/admindashboard/components/blog-management/components/BlogManagementHeaderStats";
import BlogManagementTable from "@/components/admindashboard/components/blog-management/components/BlogManagementTable";
import BlogDetailsModal from "@/components/admindashboard/components/blog-management/components/BlogDetailsModal";

type BlogRow = {
  id: string;
  status: string;
  title: string;
  read: string;
  category: string;
  contributor: string;
  contributorImage: string | null;
  published: string;
  likes: number;
  views: number;
  image: string;
  excerpt: string;
  content: string;
};

function toMediaUrl(value?: string | null) {
  if (!value) return "/blog/blog-1.webp";
  return getImageUrl(value);
}

function formatCategory(value?: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return "—";

  return raw
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiBlog(item: Record<string, any>, index: number): BlogRow {
  const status = String(item.status ?? "pending").toLowerCase();

  return {
    id: String(item.id ?? `b-${index}`),
    status,
    title: String(item.title ?? "Untitled Blog"),
    read: item.reading_time_minutes ? `${item.reading_time_minutes} min read` : "—",
    category: formatCategory(item.category),
    contributor: String(item.author_name ?? item.author ?? item.contributor ?? "Unknown"),
    contributorImage: item.author_image ? toMediaUrl(String(item.author_image)) : null,
    published:
      status === "published" && item.published_at
        ? new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : status === "published" && item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Not Published",
    likes: Number(item.total_likes ?? 0),
    views: Number(item.views ?? 0),
    image: toMediaUrl(String(item.cover_image ?? item.image ?? "/blog/blog-1.webp")),
    excerpt: String(item.short_excerpt ?? ""),
    content: String(item.content ?? ""),
  };
}

export default function BlogManagementPage() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogRow | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRes = await api.get("/blog/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(blogsRes.data)
          ? blogsRes.data
          : Array.isArray(blogsRes.data?.results)
            ? blogsRes.data.results
            : [];
        setRows(raw.map(mapApiBlog));
      } catch {
        // Silent fail - table handles its own error state
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
        {!isLoading && (
          <>
            <BlogManagementTable
              rows={rows}
              onView={(blog) => setSelectedBlog(blog)}
              onStatusChange={(id, newStatus) => {
                setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
                setSelectedBlog((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
              }}
              onDelete={(id) => {
                setRows((prev) => prev.filter((r) => r.id !== id));
                setSelectedBlog((prev) => (prev?.id === id ? null : prev));
              }}
            />
            <BlogDetailsModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
          </>
        )}
      </div>
    </section>
  );
}
