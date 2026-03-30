"use client"


import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { zoomInItems } from "../../../lib/animations";

export default function LatestArticles() {
    useEffect(() => {

        zoomInItems('.latestBlogComponent')

    }, [])

    const articles = [
        { id: 1, image: "/recipe/recipe-4.webp", slug: "recipe-4" },
        { id: 2, image: "/product/product-5.webp", slug: "product-5" },
        { id: 3, image: "/recipe/recipe-2.webp", slug: "recipe-2" },
    ];
    return (
        <section className="w-full bg-white py-5 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Section Header */}
                <h2 className="font-display text-4xl md:text-5xl font-black text-black tracking-tight mb-16">
                    Latest articles
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {articles.map((article) => (
                        <div key={article.id} className="latestBlogComponent rounded-[10px]">
                            <Link  href={`/blog/${article.slug}`} className=" bg-[#0A4834] p-4 flex flex-col gap-4 shadow-lg border border-[#0A4834] group hover:scale-[1.02] transition-transform rounded-[10px]">
                                {/* Image Placeholder Frame */}
                                <div className=" relative aspect-[4/5] w-full overflow-hidden ">
                                    <Image
                                        src={article.image}
                                        alt="Latest Article"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-[10px]"
                                    />
                                </div>

                                {/* Card Title */}
                                <div className="flex flex-col gap-2 px-2 pb-2">
                                    <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                                        Discover the rich flavors<br />that inspire our kitchen
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/80 font-sans text-xs uppercase tracking-widest font-bold mt-2">
                                        <span>Read More</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
