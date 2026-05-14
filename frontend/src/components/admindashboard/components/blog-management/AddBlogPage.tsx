"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ImagePlus, Plus } from "lucide-react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

const CATEGORIES = [
  { label: "Nutrition", value: "nutrition" },
  { label: "Wellness", value: "wellness" },
  { label: "Healthy Living", value: "healthy_living" },
  { label: "Diet Tips", value: "diet_tips" },
  { label: "Community", value: "community" },
  { label: "Other", value: "other" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-3.5">
      <h3 className="mb-3 text-[12px] font-semibold text-[#0A4833]">{title}</h3>
      {children}
    </section>
  );
}

function toMediaUrl(value?: string | null) {
  if (!value) return null;
  return getImageUrl(value);
}

export default function AddBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");
  const isEditMode = Boolean(blogId);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Admin Stories", "Nutrition", "Wellness Tips"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const selectedCategoryLabel = CATEGORIES.find((item) => item.value === category)?.label ?? category;

  useEffect(() => {
    if (!blogId) return;

    let mounted = true;

    const fetchBlog = async () => {
      setIsLoadingBlog(true);
      try {
        const res = await api.get(`/blog/${blogId}/`);
        if (!mounted) return;

        const data = res.data ?? {};
        setTitle(String(data.title ?? ""));
        setExcerpt(String(data.short_excerpt ?? ""));
        setCategory(String(data.category ?? ""));
        setContent(String(data.content ?? ""));
        setCoverPreview(toMediaUrl(String(data.cover_image ?? "")));
        setCoverImageFile(null);
      } catch {
        toast.error("Failed to load blog details.");
      } finally {
        if (mounted) setIsLoadingBlog(false);
      }
    };

    fetchBlog();

    return () => {
      mounted = false;
    };
  }, [blogId]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || tags.includes(tag)) return;
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function submitBlog(status: "draft" | "published") {
    if (!title.trim()) { toast.error("Blog title is required."); return; }
    if (!category) { toast.error("Please select a category."); return; }
    if (!content.trim()) { toast.error("Blog content is required."); return; }

    const trimmedTitle = title.trim();
    const trimmedExcerpt = excerpt.trim() || trimmedTitle;
    const trimmedContent = content.trim();

    const fd = new FormData();
    fd.append("title", trimmedTitle);
    fd.append("short_excerpt", trimmedExcerpt);
    fd.append("category", category);
    fd.append("content", trimmedContent);
    fd.append("status", status);
    fd.append("mark_as_featured", "false");
    fd.append("publish_schedule", "immediate");
    fd.append("show_in_community_blog", "true");
    fd.append("allow_comments", "true");
    fd.append("internal_notes", "");
    if (coverImageFile) fd.append("cover_image", coverImageFile);
    tags.forEach((tag) => fd.append("tags", tag));

    setIsSubmitting(true);
    try {
      if (isEditMode && blogId) {
        await api.patch(`/blog/${blogId}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(status === "draft" ? "Blog draft updated." : "Blog updated successfully!");
      } else {
        await api.post("/blog/create/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(status === "draft" ? "Blog saved as draft." : "Blog created successfully!");
      }
      router.push("/admindashboard/blog");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail
        ?? (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-3 lg:p-5">
      <div className="mx-auto max-w-[1180px] space-y-3">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight text-[#0A4833]">
              {isEditMode ? "Edit Blog" : "Add Blog"}
            </h1>
            <p className="text-[12px] text-[#6B7280]">Create and publish engaging wellness stories for the ZEWADI community.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admindashboard/blog" className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054]">
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <button
              type="button"
              disabled={isSubmitting || isLoadingBlog}
              onClick={() => submitBlog("draft")}
              className="inline-flex h-9 items-center rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054] disabled:opacity-50"
            >
              Save Draft
            </button>
          </div>
        </header>

        {isLoadingBlog && (
          <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 text-sm text-[#667085]">
            Loading blog details...
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            <Section title="Basic Information">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Blog Title *</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter compelling blog title..."
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Short Excerpt</span>
                  <input
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the blog..."
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Category *</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </label>
              </div>
            </Section>

            <Section title="Cover Image">
              <input
                type="file"
                ref={coverImageRef}
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
              <div className="grid place-items-center rounded-md border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverPreview} alt="Cover preview" className="mb-3 h-32 w-full rounded-md object-cover" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5 text-[#A1844F]" />
                    <p className="mt-2 text-[12px] font-medium text-[#344054]">Upload Cover Image</p>
                    <p className="text-[11px] text-[#98A2B3]">Recommended size: 1200x600px (JPG, PNG)</p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => coverImageRef.current?.click()}
                  className="mt-3 rounded-md bg-[#0A4833] px-3 py-1.5 text-[11px] font-medium text-white"
                >
                  {coverPreview ? "Change File" : "Choose File"}
                </button>
              </div>
            </Section>

            <Section title="Tags & Categories">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-[#F2F4F7] px-2 py-1 text-[11px] text-[#475467]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-[#9CA3AF] hover:text-[#374151]"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Enter new tag..."
                    className="h-9 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="grid h-9 w-9 place-items-center rounded-md bg-[#0A4833] text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Blog Content *">
              <div className="rounded-md border border-[#E4E7EC]">
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E7EC] bg-[#F9FAFB] px-2 py-1.5 text-[11px] text-[#475467]">
                  {["B", "I", "U"].map((f) => (
                    <button key={f} type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">{f}</button>
                  ))}
                  <span className="h-3 w-px bg-[#D0D5DD]" />
                  {["H2", "Bullet"].map((f) => (
                    <button key={f} type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">{f}</button>
                  ))}
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your blog content here..."
                  className="h-56 w-full resize-none rounded-b-md border-0 bg-white px-3 py-2 text-[13px] text-[#667085] outline-none"
                />
              </div>
              <p className="text-[10px] text-[#98A2B3]">Use sub headings and short paragraphs to make it readable.</p>
            </Section>
          </div>

          <aside className="rounded-lg border border-[#E4E7EC] bg-white p-3.5">
            <h3 className="mb-3 text-[12px] font-semibold text-[#0A4833]">Blog Preview</h3>
            {coverPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="Preview" className="mb-3 h-32 w-full rounded-md object-cover" />
            )}
            {!coverPreview && <div className="mb-3 h-32 rounded-md border border-[#E4E7EC] bg-[#F9FAFB]" />}
            <div className="space-y-2 text-[11px] text-[#475467]">
              <p><span className="font-semibold text-[#344054]">Blog Title:</span> {title || "..."}</p>
              <p><span className="font-semibold text-[#344054]">Excerpt:</span> {excerpt || "..."}</p>
              <p><span className="font-semibold text-[#344054]">Category:</span> {selectedCategoryLabel || "..."}</p>
              <p><span className="font-semibold text-[#344054]">Tags:</span> {tags.join(", ") || "..."}</p>
              <p><span className="font-semibold text-[#344054]">Status:</span> {isEditMode ? "Editing" : "Draft"}</p>
            </div>
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-[#E4E7EC] bg-white p-3">
          <Link href="/admindashboard/blog" className="inline-flex h-8 items-center rounded-md border border-[#D0D5DD] bg-white px-3 text-[11px] text-[#344054]">
            Cancel
          </Link>
          <button
            type="button"
            disabled={isSubmitting || isLoadingBlog}
            onClick={() => submitBlog("draft")}
            className="h-8 rounded-md border border-[#D0D5DD] bg-white px-3 text-[11px] text-[#344054] disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting || isLoadingBlog}
            onClick={() => submitBlog("published")}
            className="h-8 rounded-md bg-[#0A4833] px-3 text-[11px] text-white disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Blog" : "Create Blog")}
          </button>
        </div>
      </div>
    </section>
  );
}
