"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buttonAnimation, fadeUp, imageAnimation } from "../../../lib/animations";
import WipeButton from "../shared/WipeButton";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
    useEffect(() => {
        fadeUp(".fade-text")
        imageAnimation(".img-drop")
        buttonAnimation(".btn")
    }, [])
    return (
        <section className="w-full bg-white pt-56 pb-12 md:pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="fade-text flex flex-col gap-2">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase">
                            Zewadi Community
                        </h1>
                        
                        {/* Static Paragraph */}
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                        </p>
                    </div>

                    {/* Image Section - Static */}
                    <div className="img-drop w-full aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm group">
                        <Image 
                            src="/community/community-1.webp" 
                            alt="Community Hero Small" 
                            fill 
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105" 
                        />
                    </div>

                    {/* Secondary Text and Button */}
                    <div className="flex flex-col gap-8">
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        <div>
                            <WipeButton
                                href="/contact"
                                label="Join Now"
                                className="w-52 h-14"
                                showIcon={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Large Image - Static */}
                <div className="img-drop w-full h-full min-h-[500px] lg:min-h-[700px] relative rounded-sm overflow-hidden shadow-sm group">
                    <Image 
                        src="/community/community-2.webp" 
                        alt="Community Hero Large" 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    />
                </div>
            </div>
        </section>
    );
}
