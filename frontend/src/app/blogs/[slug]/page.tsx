import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Search } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ContentSection from "@/components/common/ContentSection";
import { getImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

type BackendBlogDetail = {
  id?: number;
  slug?: string;
  title: string;
  short_excerpt?: string;
  cover_image?: string | null;
  content?: string;
  author_name?: string | null;
  total_likes?: number;
  views?: number;
  created_at?: string;
  published_at?: string | null;
};


function mediaUrl(value?: string | null) {
  if (!value) return "/blogs/blog-1.webp";
  return getImageUrl(value);
}

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function getBlog(slug: string) {
  const apiBase = API_BASE_URL;
  try {
    const response = await fetch(`${apiBase}/blog/${slug}/`, { cache: "no-store" });
    if (response.ok) return (await response.json()) as BackendBlogDetail;
  } catch {
    return null;
  }
  return null;
}

async function getPopularBlogs(currentSlug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/?public=1`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const blogs = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    return (blogs as BackendBlogDetail[])
      .filter((blog) => String(blog.slug || blog.id) !== currentSlug)
      .sort((a, b) => Number(b.views ?? 0) + Number(b.total_likes ?? 0) - (Number(a.views ?? 0) + Number(a.total_likes ?? 0)))
      .slice(0, 3);
  } catch {
    return [];
  }
}

function contentParagraphs(content?: string) {
  return String(content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const popularBlogs = await getPopularBlogs(slug);
  const paragraphs = contentParagraphs(blog.content);

  return (
    <div className="bg-[#fffef5]">
      <Navbar />
      <ContentSection title="Blogs" subtitle="Zewadi Blogs" />

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-48">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,850px)_340px] xl:gap-24">
            <article className="max-w-[850px]">
              <div className="mb-4 flex w-full gap-[4px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[3px] flex-1 overflow-hidden bg-[#d8d6d1]">
                    <div
                      className="blog-detail-progress h-full bg-[#1f4d3a]"
                      style={{ animationDelay: `${index * 120}ms` }}
                    />
                  </div>
                ))}
              </div>

              <div className="relative h-[250px] overflow-hidden rounded-[20px] sm:h-[360px] lg:h-[416px]">
                <Image
                  src={mediaUrl(blog.cover_image)}
                  alt={blog.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                />
              </div>

              <h1 className="mt-6 font-serif font-bold text-[2rem] leading-tight text-black sm:text-[3.125rem] sm:leading-[1.2]">
                {blog.title}
              </h1>

              {blog.short_excerpt ? (
                <p className="mt-4 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  {blog.short_excerpt}
                </p>
              ) : null}

              <div className="mt-8 space-y-6">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line text-[15px] font-medium leading-[1.8] text-[#496456]">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[15px] font-medium leading-[1.8] text-[#496456]">
                    No blog content added yet.
                  </p>
                )}
              </div>
            </article>

            <aside className="sticky h-fit space-y-10 self-start" style={{ top: "min(128px, calc(100vh - 100% - 24px))" }}>
              <div className="rounded-[24px] border border-black/[0.03] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Search Here
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />
                <label className="mt-6 flex items-center rounded-full border border-[#e3dbd8] bg-[#fcfdfc] px-5 py-3 text-[#727272]">
                  <input
                    type="text"
                    placeholder="Search.."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#b4b4b4]"
                  />
                  <Search size={18} className="text-[#1a4331]" />
                </label>
              </div>

              <div className="rounded-[24px] border border-black/[0.03] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Popular Post
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />
                <div className="mt-6 space-y-6">
                  {popularBlogs.length === 0 ? (
                    <p className="text-sm leading-6 text-[#727272]">No popular posts yet.</p>
                  ) : (
                    popularBlogs.map((post) => (
                      <Link
                        key={String(post.slug || post.id)}
                        href={`/blogs/${post.slug || post.id}`}
                        className="group flex items-center gap-4"
                      >
                        <div className="relative h-[75px] w-[75px] flex-shrink-0 overflow-hidden rounded-[16px] bg-[#d9d9d9]">
                          <Image
                            src={mediaUrl(post.cover_image)}
                            alt={post.title}
                            fill
                            unoptimized
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#727272]">
                            <CalendarDays size={13} className="text-[#1a4331]" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          <h4 className="mt-1.5 text-[14px] font-bold leading-snug text-[#1a4331] group-hover:text-[#1f6306]">
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
