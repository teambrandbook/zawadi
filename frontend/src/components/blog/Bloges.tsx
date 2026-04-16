"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { fadeUp, imageAnimation } from "../../../lib/animations";
import { blogs } from "../../../lib/datafile"

export default function Bloges() {

  useEffect(() => {
    imageAnimation(".img");
    fadeUp(".fadecomponent");
  }, []);

  const blogArray = Object.entries(blogs);

  return (
    <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[85rem] mx-auto flex flex-col gap-24">

        {blogArray.map(([slug, blog]) => (
          <div key={slug} className="flex flex-col items-center">

            {/* Header */}
            <div className="fadecomponent text-center max-w-4xl mb-12 flex flex-col gap-6">
              <h2 className="font-display text-4xl md:text-5xl font-black text-black tracking-tight leading-none">
                {blog.title}
              </h2>
              <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {blog.description}
              </p>
            </div>

            {/* Image */}
            <div className="img w-full aspect-[16/10] rounded-sm shadow-sm relative overflow-hidden mb-16">
              <Image src={blog.image} alt={blog.title} fill className="object-cover rounded-[10px]" />
            </div>

            {/* Content */}
            <div className="text-center max-w-4xl mx-auto flex flex-col items-center gap-8">
              
              <div className="fadecomponent flex flex-col gap-6">
                {blog.content.slice(0, 2).map((para, index) => (
                  <p
                    key={index}
                    className="font-sans text-[#555] text-sm md:text-base leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Button */}
              <Link
                href={`/blog/${slug}`}
                className="w-48 h-12 bg-[#0A4834] hover:bg-[#1A5A44] transition-colors rounded-full shadow-md flex items-center justify-center text-white font-sans font-bold text-sm uppercase tracking-widest"
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