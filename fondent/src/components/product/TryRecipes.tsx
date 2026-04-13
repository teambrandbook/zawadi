"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TryRecipes() {
    const containerRef = useRef<HTMLDivElement>(null);

    const recipes = [
        { id: 1, image: "/product/product-2.webp" },
        { id: 2, image: "/product/product-4.webp" },
        { id: 3, image: "/product/product-5.webp" },
    ];

    useGSAP(() => {
        // Section Header Reveal
        gsap.from(".try-recipes-header", {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".try-recipes-header",
                start: "top 85%",
                once: true
            }
        });

        // Staggered Cards Reveal
        gsap.from(".recipe-card", {
            opacity: 0,
            scale: 0.85,
            y: 20,
            duration: 1,
            stagger: 0.2, // "One by one" delay
            ease: "back.out(1.7)", // Luxury Spring for playful arrival
            scrollTrigger: {
                trigger: ".recipes-grid",
                start: "top 85%",
                once: true
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="try-recipes-header">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black text-center mb-16 uppercase tracking-tighter">
                        Try Recipes
                    </h2>
                </div>
                
                <div className="recipes-grid grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {recipes.map((recipe) => (
                        <div 
                            key={recipe.id} 
                            className="recipe-card bg-[#0A4834] p-4 flex flex-col gap-6 shadow-2xl relative group cursor-pointer"
                        >
                            {/* RECIPE IMAGE CONTAINER */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
                                <Image 
                                    src={recipe.image} 
                                    alt="Recipe" 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                />
                                
                                {/* Overlay glow on hover */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                            </div>

                            <p className="font-display text-white text-lg lg:text-xl font-bold leading-tight px-2 pb-2">
                                Discover the rich flavors<br />that inspire our kitchen
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
