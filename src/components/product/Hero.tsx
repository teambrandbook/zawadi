"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Main Image Wipe + Shimmer
        const mainImageTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-main-image",
                start: "top 85%",
                once: true
            }
        });

        mainImageTl.from(".hero-main-image", {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut"
        })
        .fromTo(".shimmer-edge", {
            left: "0%"
        }, {
            left: "100%",
            duration: 1.2,
            ease: "power3.inOut"
        }, 0);

        // Thumbnails 'High-Intensity' Swirl Reveal - Cinematic Discovery
        gsap.fromTo(".thumb-swirl", {
            opacity: 0,
            scale: 0,
            y: 50,
            rotate: -1080
        }, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 2.5,
            stagger: 0.3,
            delay: 0.4,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".thumbnails-container",
                start: "top 90%",
                once: true
            }
        });

        // Content Staggered Reveal
        const contentTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-content",
                start: "top 85%",
                once: true
            }
        });

        contentTl.from(".content-item", {
            opacity: 0,
            x: -30,
            duration: 1,
            stagger: 0.15,
            delay: 0.4,
            ease: "power3.out"
        })
        .from(".content-wipe", {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.inOut"
        }, "-=0.8");

    }, { scope: containerRef });

    // Interactive Button Scaling
    const handleSlightScale = (e: React.MouseEvent<HTMLElement>, scale: number) => {
        gsap.to(e.currentTarget, { scale, duration: 0.3, ease: "power2.out" });
    };

    return (
        <section ref={containerRef} className="w-full bg-white pt-40 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Image with Wipe Reveal */}
                <div className="flex flex-col gap-14">
                    <div className="hero-main-image w-full aspect-square relative rounded-[10px] overflow-hidden shadow-sm bg-[#f5f5f5]">
                        <Image src="/product/product-1.webp" alt="Buckwheat" fill className="object-cover w-full" />
                        
                        {/* Sandal Shimmer Edge for entrance wipe */}
                        <div className="shimmer-edge absolute inset-y-0 w-[4px] bg-[#EAE3D2] z-30 shadow-[0_0_30px_rgba(234,227,210,0.8)] pointer-events-none" />
                    </div>

                    {/* Thumbnails - PERFECT CIRCLES (Sized for Balanced High-Density Reveal) */}
                    <div className="thumbnails-container flex justify-center items-center px-2 gap-3 mt-12">
                        {[
                            { src: "/product/product-2.webp", alt: "Thumb 1" },
                            { src: "/product/product-3.webp", alt: "Thumb 2" },
                            { src: "/product/product-4.webp", alt: "Thumb 3" }
                        ].map((thumb) => (
                            <div 
                                key={thumb.alt}
                                className="thumb-swirl flex-none w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 aspect-square relative rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group bg-gray-50 ring-2 ring-white/20"
                            >
                                <Image 
                                    src={thumb.src} 
                                    alt={thumb.alt} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Staggered Content Details */}
                <div className="hero-content flex flex-col">
                    {/* Title & Price */}
                    <div className="mb-8 content-item">
                        <h1 className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-4">
                            BUCKWHEAT
                        </h1>
                        <p className="font-sans text-xl font-extrabold text-black">
                            $ 120.00 USD
                        </p>
                    </div>

                    {/* Description */}
                    <p className="content-item font-sans text-[#444] text-[15px] leading-relaxed mb-10 max-w-2xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </p>

                    {/* Benefits List Staggered */}
                    <div className="content-item mb-12">
                        <ul className="list-disc list-outside ml-5 space-y-1 font-sans text-black text-[15px] leading-relaxed font-medium">
                            <li>Only the finest local and seasonal ingredients.</li>
                            <li>Healthy, chemical-free components for every dish.</li>
                            <li>Supporting local farmers and sustainable produce.</li>
                            <li>Each ingredient carefully selected for peak flavor.</li>
                            <li>Ingredients that celebrate each season&apos;s best.</li>
                            <li>Top-quality meats, seafood, and plant-based options.</li>
                            <li>Freshly baked, handmade, or house-prepared items.</li>
                        </ul>
                    </div>

                    {/* Action Buttons: Swipe Reveal */}
                    <div className="flex gap-4 mb-20 items-center">
                        <div className="content-wipe">
                            <button
                                onMouseEnter={(e) => handleSlightScale(e, 1.05)}
                                onMouseLeave={(e) => handleSlightScale(e, 1)}
                                onMouseDown={(e) => handleSlightScale(e, 0.95)}
                                onMouseUp={(e) => handleSlightScale(e, 1.05)}
                                className="w-16 h-12 bg-[#0A4834] rounded-none flex items-center justify-center text-white hover:brightness-110 transition-all shadow-md relative overflow-hidden"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        <div className="content-wipe h-12 w-48 shadow-md">
                            <Link href="/contact" className="w-full h-full bg-[#0A4834] rounded-none flex items-center justify-center text-white font-sans font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">
                                Buy now
                            </Link>
                        </div>
                    </div>

                    {/* Zewadi Story Row 2 Staggered */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pt-12 items-start border-t border-gray-100">
                        <div className="content-item flex flex-col items-start gap-4">
                            <h4 className="font-sans text-xl font-extrabold text-black uppercase tracking-tight">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-[13px] leading-relaxed max-w-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <div className="content-wipe h-11 w-full max-w-[280px] mt-4">
                                <Link href="/recipe" className="w-full h-full bg-[#0A4834] rounded-none flex items-center justify-center text-white font-sans font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-md">
                                    Recipes
                                </Link>
                            </div>
                        </div>

                        <div className="content-item flex flex-col items-start gap-4">
                            <h4 className="font-sans text-xl font-extrabold text-black uppercase tracking-tight">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-[13px] leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
