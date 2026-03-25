"use client"


import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { buttonAnimation, fadeUp,imageAnimation } from "../../../lib/animations";


gsap.registerPlugin(ScrollTrigger)
export default function Hero() {

    useEffect(() => {
    fadeUp(".fade-text")
    imageAnimation(".img-drop")
    buttonAnimation(".btn")

  }, [])

    return (
        <section className="w-full pt-40 bg-white py-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col gap-16">

                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="fade-text flex flex-col gap-2">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase">
                            Zewadi Community
                        </h1>
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Small Image Placeholder */}
                    <div className="img-drop w-full aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-1.webp" alt="Community Hero Small" fill className="object-cover" />
                    </div>

                    {/* Secondary Text */}
                    <p className="fade-text font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    {/* Join Now Button */}

                    <Link
                        href="/contact"
                        className="btn group relative w-20 h-14 bg-[#0A4834] rounded-full flex items-center justify-center overflow-hidden "
                    >
                        <span className="btn-text absolute left-6 text-white text-[13px] font-black uppercase tracking-widest opacity-0">
                            Join Now
                        </span>

                        <div className="btn-arrow absolute left-8 w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#0A4834] shadow-sm">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="11" width="5" height="2.5" rx="1.25" />
                                <path d="M10 8c0-1.1 1.2-1.8 2.1-1.3l6.3 3.6c.9.5.9 1.9 0 2.4l-6.3 3.6c-.9.5-2.1-.2-2.1-1.3V8z" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Right Column - Large Image */}
                <div className="img-drop w-full h-full min-h-[500px] lg:min-h-[700px] relative rounded-sm overflow-hidden shadow-sm">
                    <Image src="/community/community-2.webp" alt="Community Hero Large" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}
