"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, ChevronRight, Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContentSection from "../common/ContentSection";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

const fallbackBlogImage = "/blogs/blog-1.webp";


type BlogPost = {
  title: string;
  description: string;
  image: string;
  href: string;
  date: string;
  likes: number;
  views: number;
};

type BackendBlog = {
  slug?: string;
  id: number | string;
  title: string;
  short_excerpt?: string;
  cover_image?: string | null;
  created_at?: string;
  author_name?: string;
  total_likes?: number;
  views?: number;
};

function mediaUrl(value?: string | null) {
  if (!value) return fallbackBlogImage;
  return getImageUrl(value);
}

function formatDate(value?: string) {
  if (!value) return "October 19, 2022";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function mapBackendBlog(blog: BackendBlog): BlogPost {
  const slug = blog.slug || String(blog.id);
  return {
    title: blog.title,
    description: blog.short_excerpt || "",
    image: mediaUrl(blog.cover_image),
    href: `/blogs/${slug}`,
    date: formatDate(blog.created_at),
    likes: typeof blog.total_likes === "number" ? blog.total_likes : 0,
    views: typeof blog.views === "number" ? blog.views : 0,
  };
}

export default function Blogs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      [post.title, post.description].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [posts, searchTerm]);

  const popularPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => b.views + b.likes - (a.views + a.likes))
        .slice(0, 3),
    [posts]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".blog-article").forEach((el) => {
        const article = el as HTMLElement;
        
        // Image reveal animation
        const image = article.querySelector(".blog-main-image");
        if (image) {
          gsap.fromTo(
            image,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: article,
                start: "top 80%",
              },
            }
          );
        }

        // Staggered text fade-in animation
        const textElements = article.querySelectorAll(".blog-animate-text");
        if (textElements.length > 0) {
          gsap.fromTo(
            textElements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: textElements[0],
                start: "top 85%",
              },
            }
          );
        }
      });

      const popularPostImages = gsap.utils.toArray(".popular-post-image");
      if (popularPostImages.length > 0) {
        gsap.fromTo(
          popularPostImages,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: popularPostImages[0] as HTMLElement,
              start: "top 90%",
            },
          }
        );
      }

      const popularPostTexts = gsap.utils.toArray(".popular-post-text");
      if (popularPostTexts.length > 0) {
        gsap.fromTo(
          popularPostTexts,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: popularPostImages.length > 0 ? (popularPostImages[0] as HTMLElement) : (popularPostTexts[0] as HTMLElement),
              start: "top 90%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [filteredPosts.length, popularPosts.length]);

  useEffect(() => {
    let mounted = true;
    api.get(`/blog/?public=1`)
      .then(({ data }) => {
        const raw = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        if (mounted) {
          setPosts(raw.map(mapBackendBlog));
          setStatusMessage("");
        }
      })
      .catch(() => {
        if (mounted) {
          setPosts([]);
          setStatusMessage("Unable to load blogs right now.");
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#fffef5]">
      <ContentSection title="Blogs" subtitle="Zewadi Blogs" />

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-48">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,850px)_340px] xl:gap-24">
            <div className="space-y-16 sm:space-y-24">
              {isLoading && (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="max-w-[850px] animate-pulse">
                      <div className="h-[220px] rounded-[20px] bg-[#f3f4f6] sm:h-[300px] lg:h-[400px] xl:h-[480px]" />
                      <div className="mt-6 h-4 w-40 rounded bg-[#f3f4f6]" />
                      <div className="mt-4 h-9 w-3/4 rounded bg-[#f3f4f6]" />
                      <div className="mt-4 h-4 w-full rounded bg-[#f3f4f6]" />
                      <div className="mt-2 h-4 w-2/3 rounded bg-[#f3f4f6]" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && statusMessage ? (
                <div className="rounded-[20px] border border-[#E7EBE7] bg-[#F8FBF8] px-6 py-5 text-sm font-medium text-[#727272]">
                  {statusMessage}
                </div>
              ) : null}

              {!isLoading && !statusMessage && filteredPosts.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#E7EBE7] bg-[#F8FBF8] px-6 py-16 text-center">
                  <h2 className="text-xl font-bold text-[#1a4331]">No blogs available</h2>
                  <p className="mt-2 text-sm text-[#727272]">
                    Blogs added from the backend will appear here.
                  </p>
                </div>
              ) : null}

              {!isLoading && filteredPosts.map((post, index) => (
                <article key={post.title} className="blog-article max-w-[850px]">
                  <div className="blog-main-image relative overflow-hidden rounded-[20px] h-[220px] sm:h-[300px] lg:h-[400px] xl:h-[480px]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>

                  <div className="blog-animate-text mt-6 flex items-center gap-2 text-xs font-semibold text-[#727272]">
                    <CalendarDays size={14} className="text-[#1a4331]" />
                    <span className="font-sans">{post.date}</span>
                  </div>

                  <h2 className="blog-animate-text mt-4 font-serif font-bold text-[1.8rem] leading-tight text-black sm:text-[2.3rem] sm:leading-[1.2]">
                    {post.title}
                  </h2>

                  <p className="blog-animate-text mt-4 max-w-[95%] text-[15px] font-medium leading-[1.7] text-[#727272]">
                    {post.description}
                  </p>

                  <Link
                    href={post.href}
                    className="blog-animate-text mt-8 inline-flex items-center gap-3 rounded-full bg-[#1f4d3a] px-7 py-3 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}

              {!isLoading && filteredPosts.length > 0 && (
              <div className="flex items-center justify-center gap-3 pt-12">
                {[1, 2, 3].map((page, index) => (
                  <button
                    key={page}
                    type="button"
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-[5px] border text-lg font-bold transition-colors ${
                      index === 0
                        ? "border-[#1f4d3a] text-[#1f4d3a]"
                        : "border-[#e3dbd8] text-[#1f4d3a]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next page"
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[5px] border border-[#e3dbd8] text-[#1f4d3a] transition-colors hover:border-[#1f4d3a]"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
              )}
            </div>

            <aside className="sticky h-fit space-y-10 self-start" style={{ top: 'min(128px, calc(100vh - 100% - 24px))' }}>
              <div className="rounded-[24px] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-black/[0.03]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Search Here
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />
                <label className="mt-6 flex items-center rounded-full border border-[#e3dbd8] bg-[#fcfdfc] px-5 py-3 text-[#727272]">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search.."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#b4b4b4]"
                  />
                  <Search size={18} className="text-[#1a4331]" />
                </label>
              </div>

              <div className="rounded-[24px] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-black/[0.03]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Popular Post
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />

                <div className="mt-6 space-y-6">
                  {popularPosts.length === 0 ? (
                    <p className="text-sm leading-6 text-[#727272]">No popular posts yet.</p>
                  ) : popularPosts.map((post) => (
                    <Link
                      key={post.title}
                      href={post.href}
                      className="group flex items-center gap-4"
                    >
                      <div className="popular-post-image relative h-[75px] w-[75px] flex-shrink-0 overflow-hidden rounded-[16px] bg-[#d9d9d9]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="popular-post-text flex items-center gap-1.5 text-[11px] font-semibold text-[#727272]">
                          <CalendarDays size={13} className="text-[#1a4331]" />
                          {post.date}
                        </div>
                        <h4 className="popular-post-text mt-1.5 text-[14px] font-bold leading-snug text-[#1a4331] group-hover:text-[#1f6306]">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
