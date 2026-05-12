"use client";

import { useEffect, useMemo, useState } from "react";
import CommunityBlogPage, {
  type BlogPost,
  type BlogStatus,
  type WritingActivity,
} from "@/components/communityUsers/blog/CommunityBlogPage";
import api from "@/services/api";

type ApiBlog = {
  id: number;
  title: string;
  short_excerpt?: string;
  cover_image?: string | null;
  status: "published" | "draft" | "pending" | "archived" | string;
  views?: number;
  total_likes?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
};

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(
  /\/api\/?$/,
  ""
);

function toBlogStatus(status: string): BlogStatus {
  if (status === "published") return "completed";
  if (status === "pending") return "waiting_review";
  return "continue_writing";
}

function toImageUrl(image?: string | null): string {
  if (!image) return "/blogs/blog-1.webp";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
}

function toDisplayDate(value?: string | null): string {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toActivityNote(blog: ApiBlog): string {
  if (blog.status === "published") return `Published on ${toDisplayDate(blog.published_at || blog.updated_at)}`;
  if (blog.status === "pending") return `Submitted for review on ${toDisplayDate(blog.updated_at || blog.created_at)}`;
  return `Draft saved on ${toDisplayDate(blog.updated_at || blog.created_at)}`;
}

function toBlogPost(blog: ApiBlog): BlogPost {
  return {
    id: String(blog.id),
    title: blog.title,
    excerpt: blog.short_excerpt || "No summary added yet.",
    image: toImageUrl(blog.cover_image),
    status: toBlogStatus(blog.status),
    date: toDisplayDate(blog.published_at || blog.updated_at || blog.created_at),
    views: Number(blog.views ?? 0),
    comments: Number(blog.total_likes ?? 0),
  };
}

export default function CommunityBlogRoute() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [recentActivity, setRecentActivity] = useState<WritingActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBlogs() {
      try {
        const response = await api.get<ApiBlog[]>("/blog/");
        if (!isMounted) return;

        const blogs = Array.isArray(response.data) ? response.data : [];
        setPosts(blogs.map(toBlogPost));
        setRecentActivity(
          blogs.slice(0, 4).map((blog) => ({
            id: String(blog.id),
            title: blog.title,
            note: toActivityNote(blog),
            status: toBlogStatus(blog.status),
          }))
        );
        setStatusMessage("");
      } catch {
        if (isMounted) {
          setPosts([]);
          setRecentActivity([]);
          setStatusMessage("Unable to load your blogs right now.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleRecentActivity = useMemo(() => recentActivity, [recentActivity]);

  return (
    <CommunityBlogPage
      posts={posts}
      recentActivity={visibleRecentActivity}
      isLoading={isLoading}
      statusMessage={statusMessage}
    />
  );
}
