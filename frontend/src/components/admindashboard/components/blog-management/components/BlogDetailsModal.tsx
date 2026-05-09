"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Eye, Heart, Tag, X } from "lucide-react";

export type BlogDetailsRow = {
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

type Props = {
  blog: BlogDetailsRow | null;
  onClose: () => void;
};

export default function BlogDetailsModal({ blog, onClose }: Props) {
  const [coverSrc, setCoverSrc] = useState("/blog/blog-1.webp");
  const [authorSrc, setAuthorSrc] = useState<string | null>(null);

  useEffect(() => {
    setCoverSrc(blog?.image || "/blog/blog-1.webp");
    setAuthorSrc(blog?.contributorImage ?? null);
  }, [blog]);

  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#F3F4F6] text-[#475467]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt={blog.title}
            onError={() => setCoverSrc("/blog/blog-1.webp")}
            className="block h-56 w-full rounded-2xl bg-[#F3F4F6] object-cover sm:h-72"
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1 text-[11px] font-medium text-[#475467]">
              <Tag className="h-3.5 w-3.5" />
              {blog.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F7EC] px-3 py-1 text-[11px] font-medium text-[#15803D]">
              {blog.status}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-[#0A4833]">{blog.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#667085]">{blog.excerpt || "No excerpt available."}</p>

          <div className="mt-5 grid gap-3 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              {authorSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authorSrc}
                  alt={blog.contributor}
                  onError={() => setAuthorSrc(null)}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF3EF] text-sm font-semibold text-[#0A4833]">
                  {blog.contributor.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#98A2B3]">Author</p>
                <p className="text-sm font-medium text-[#344054]">{blog.contributor}</p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-[#475467]">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#0A4833]" />
                {blog.published}
              </span>
              <span>{blog.read}</span>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-[#A1844F]" />
                  {blog.likes}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-[#0A4833]" />
                  {blog.views}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E4E7EC] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#0A4833]">Blog Content</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#475467]">
              {blog.content || "No content available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
