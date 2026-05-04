"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fadeUp, imageAnimation } from "../../../lib/animations";
import api from "@/services/api";

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  short_excerpt: string;
  cover_image: string | null;
  author_name: string;
  created_at: string;
};

const FALLBACK_IMAGE = "/blog/blog-placeholder.webp";

export default function Bloges() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  useEffect(() => {
    imageAnimation(".img");
    fadeUp(".fadecomponent");
  }, []);

  useEffect(() => {
    api
      .get<{ results?: BlogItem[] } | BlogItem[]>("/blog/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setBlogs(list);
      })
      .catch(() => {});
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[85rem] mx-auto flex flex-col gap-24">
        {blogs.map((blog) => (
          <div key={blog.id} className="flex flex-col items-center">
            {/* Header */}
            <div className="fadecomponent text-center max-w-4xl mb-12 flex flex-col gap-6">
              <h2 className="font-display text-3xl md:text-4xl font-light text-black tracking-tight leading-none mb-8">
                {blog.title}
              </h2>
              <p className="font-mulish text-[#555] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {blog.short_excerpt}
              </p>
            </div>

            {/* Image */}
            <div className="img w-full aspect-[16/10] rounded-sm shadow-sm relative overflow-hidden mb-16">
              <Image
                src={blog.cover_image || FALLBACK_IMAGE}
                alt={blog.title}
                fill
                className="object-cover rounded-[10px]"
              />
            </div>

            {/* Button */}
            <div className="text-center">
              <Link
                href={`/blog/${blog.slug}`}
                className="w-48 h-12 bg-[#0A4834] hover:bg-[#1A5A44] transition-colors rounded-full shadow-md inline-flex items-center justify-center text-white font-mulish font-bold text-sm uppercase tracking-widest"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
