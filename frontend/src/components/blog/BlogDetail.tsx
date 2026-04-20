"use client"


import Image from "next/image";
import { useEffect } from "react";
import { fadeUp, imageAnimation } from "../../../lib/animations";

interface BlogData {
    title: string;
    description: string;
    image: string;
    content: string[];
}

interface BlogDetailProps {
    blog: BlogData;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
    useEffect(()=>{
            imageAnimation(".img")
            fadeUp(".fadecomponent")
        },[])

    return (
        <div className="w-full bg-white">
            <section className="pt-40 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto flex flex-col items-center">
                    
                    {/* Title */}
                    <div className="img text-center max-w-4xl mb-24">
                        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-black tracking-tight leading-none mb-24">
                            {blog.title}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    <div className="img w-full aspect-[21/9] relative rounded-none overflow-hidden shadow-2xl mb-24">
                        <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill 
                            className="object-cover" 
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="fadecomponent max-w-4xl mx-auto flex flex-col gap-10">
                        {blog.content.map((paragraph, idx) => (
                            <p key={idx} className="font-mulish text-gray-700 text-lg md:text-xl leading-relaxed text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}
