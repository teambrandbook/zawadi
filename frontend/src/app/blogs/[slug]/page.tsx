import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ContentSection from "@/components/common/ContentSection";
import { getImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

type BackendBlogDetail = {
  title: string;
  short_excerpt?: string;
  cover_image?: string | null;
  content?: string;
  created_at?: string;
};

function mediaUrl(value?: string | null) {
  if (!value) return "/blogs/blog-1.webp";
  return getImageUrl(value);
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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <div className="bg-white">
      <Navbar />
      <ContentSection title="Blogs" subtitle="Zewadi Blogs" />
      <main className="container mx-auto max-w-[960px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative h-[260px] overflow-hidden rounded-[20px] sm:h-[420px]">
          <Image
            src={mediaUrl(blog.cover_image)}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <h1 className="mt-8 font-serif text-[2.25rem] font-bold leading-tight text-black sm:text-[3rem]">
          {blog.title}
        </h1>
        {blog.short_excerpt ? (
          <p className="mt-4 text-[16px] font-semibold leading-7 text-[#1f4d3a]">
            {blog.short_excerpt}
          </p>
        ) : null}
        <article className="prose prose-zinc mt-8 max-w-none whitespace-pre-line text-[#496456]">
          {blog.content}
        </article>
      </main>
      <Footer />
    </div>
  );
}
