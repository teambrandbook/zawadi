"use client";

import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
    const mainRef = useRef<HTMLElement>(null);

    const images = [
        { src: "/events/event-1.webp", alt: "Gallery 1", cols: "md:col-span-4", aspect: "aspect-[4/5]" },
        { src: "/events/event-5.webp", alt: "Gallery 2", cols: "md:col-span-8", aspect: "aspect-[16/9]" },
        { src: "/community/community-1.webp", alt: "Gallery 3", cols: "md:col-span-8", aspect: "aspect-[16/9]" },
        { src: "/events/event-2.webp", alt: "Gallery 4", cols: "md:col-span-4", aspect: "aspect-square" },
        { src: "/events/event-3.webp", alt: "Gallery 5", cols: "md:col-span-12", aspect: "aspect-[21/9]" },
        { src: "/community/community-3.webp", alt: "Gallery 6", cols: "md:col-span-5", aspect: "aspect-[4/5]" },
        { src: "/community/community-6.webp", alt: "Gallery 7", cols: "md:col-span-7", aspect: "aspect-square" },
        { src: "/community/community-8.webp", alt: "Gallery 8", cols: "md:col-span-6", aspect: "aspect-[4/5]" },
        { src: "/events/event-4.webp", alt: "Gallery 9", cols: "md:col-span-6", aspect: "aspect-[4/5]" },
    ];

    useGSAP(() => {
        // Header Reveal
        gsap.from(".gallery-title", {
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "expo.out", // Corresponds to a fast start, slow end
            scrollTrigger: {
                trigger: ".gallery-title",
                start: "top 90%", // Equivalent to viewport={{ once: true, margin: "-100px" }}
                once: true
            }
        });

        // Individual Image Reveals
        const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
        items.forEach((item) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", // Equivalent to viewport={{ once: true, margin: "-100px" }}
                    once: true
                }
            });

            // Wiper Block - THE "ACTIVE" SWEEP
            tl.fromTo(item.querySelector(".wiper-block"),
                { left: "-100%" },
                { left: "100%", duration: 1.2, ease: "power4.inOut" } // Similar to [0.76, 0, 0.24, 1] for a smooth sweep
            );

            // Image Content Reveal
            tl.fromTo(item.querySelector(".image-reveal-layer"),
                { clipPath: "inset(0 100% 0 0)", opacity: 0 },
                { clipPath: "inset(0 0 0 0)", opacity: 1, duration: 0.9, ease: "power4.inOut" }, // Similar to [0.76, 0, 0.24, 1]
                "-=1.0" // Overlap with wiper, starting 1.0 seconds before the wiper finishes
            );
        });
    }, { scope: mainRef });

    return (
        <main ref={mainRef} className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            <section className="pt-44 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <h1 
                            className="gallery-title font-display text-5xl md:text-5xl lg:text-7xl font-bold text-black tracking-tighter leading-tight"
                        >
                            Zewadi Events Gallery
                        </h1>
                    </div>

                    {/* Perfectly preserved original asymmetrical grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {images.map((img, index) => (
                            <div 
                                key={index}
                                className={`gallery-item ${img.cols} ${img.aspect} relative rounded-none overflow-hidden group cursor-pointer bg-[#F5F5F5] shadow-xl`}
                            >
                                {/* THE REVEALED IMAGE */}
                                <div 
                                    className="image-reveal-layer absolute inset-0 z-10 w-full h-full"
                                >
                                    <Image 
                                        src={img.src} 
                                        alt={img.alt} 
                                        fill 
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    />
                                </div>

                                {/* THE WIPER BLOCK - THE "ACTIVE" SWEEP AS SEEN IN WIPEBUTTON */}
                                <div 
                                    className="wiper-block absolute inset-y-0 w-full bg-[#EAE3D2] z-30 pointer-events-none"
                                />

                                {/* Subtle Overlay Border */}
                                <div className="absolute inset-0 border border-black/0 group-hover:border-black/5 transition-colors duration-500 z-40" />
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
