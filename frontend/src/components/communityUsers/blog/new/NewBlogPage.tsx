"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import BlogContentEditor from "./BlogContentEditor";
import BlogCoverImage from "./BlogCoverImage";
import BlogInformationForm from "./BlogInformationForm";
import BlogPreviewCard from "./BlogPreviewCard";
import BlogTagsField from "./BlogTagsField";
import NewBlogActions from "./NewBlogActions";
import NewBlogHeader from "./NewBlogHeader";
import PublicationStatusCard from "./PublicationStatusCard";
import ReviewProcessCard from "./ReviewProcessCard";
import WritingInspirationCard from "./WritingInspirationCard";

export default function NewBlogPage() {
  const router = useRouter();
  const { upload: uploadCoverImage, isUploading: isImageUploading } = useCloudinaryUpload("blog_cover");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("healthy_living");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitBlog() {
    if (!title.trim()) { toast.error("Blog title is required."); return; }
    if (!excerpt.trim()) { toast.error("Short excerpt is required."); return; }
    if (!content.trim()) { toast.error("Blog content is required."); return; }
    if (isImageUploading) { toast.error("Image is still uploading, please wait."); return; }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("short_excerpt", excerpt.trim());
    formData.append("category", category);
    formData.append("content", content.trim());
    formData.append("reading_time_minutes", String(Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220))));
    formData.append("show_in_community_blog", "true");
    formData.append("allow_comments", "true");
    if (coverImageUrl) formData.append("cover_image", coverImageUrl);
    if (tags.trim()) formData.append("internal_notes", `User tags: ${tags.trim()}`);

    setIsSubmitting(true);
    try {
      await api.post("/blog/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Blog submitted for review.");
      router.push("/communityDashBoard/add-blog");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail = Object.entries(data ?? {})
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
        .join(" | ");
      toast.error(detail || "Failed to submit blog.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCoverImageChange(file: File | null) {
    setCoverImage(file);
    if (!file) { setCoverImageUrl(""); return; }
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
    } catch {
      // error handled in hook
    }
  }

  function saveDraft() {
    localStorage.setItem(
      "zawadi-community-blog-draft",
      JSON.stringify({ title, excerpt, category, content, tags, savedAt: new Date().toISOString() })
    );
    toast.success("Draft saved locally.");
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <NewBlogHeader />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <BlogCoverImage fileName={coverImage?.name ?? ""} onChange={handleCoverImageChange} />
            <BlogInformationForm
              title={title}
              excerpt={excerpt}
              category={category}
              onTitleChange={setTitle}
              onExcerptChange={setExcerpt}
              onCategoryChange={setCategory}
            />
            <BlogContentEditor value={content} onChange={setContent} />
            <BlogTagsField value={tags} onChange={setTags} />
          </div>

          <aside className="space-y-6">
            <PublicationStatusCard />
            <BlogPreviewCard />
            <WritingInspirationCard />
            <ReviewProcessCard />
          </aside>
        </div>

        <NewBlogActions isSubmitting={isSubmitting} onSubmit={submitBlog} onSaveDraft={saveDraft} />
      </div>
    </main>
  );
}
