"use client"


import Image from "next/image";
import { useEffect } from "react";
import { borderDraw, imageAnimation, leftReveal } from "../../../lib/animations";

interface RecipeData {
    title: string;
    description: string;
    image: string;
    nutrition: { label: string; value: string }[];
    ingredientsCount: number;
    ingredientsText: string;
    steps: string[];
}

interface RecipeDetailProps {
    recipe: RecipeData;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {

    useEffect(() => {
        imageAnimation(".img")
        leftReveal(".lectRevelComponent")
        borderDraw(".border-box")
    }, [])

    return (
        <div className="w-full bg-white">
            {/* 1. Hero / Top Section */}
            <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Image with Play Button */}
                    <div className="img relative aspect-square rounded-none overflow-hidden group shadow-2xl">
                        <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute bottom-6 right-6 w-14 h-14 bg-[#0A4834] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Right: Content & Nutrition */}
                    <div className="lectRevelComponent flex flex-col gap-8">
                        <div>
                            <h1 className="font-display text-5xl md:text-6xl font-black text-black leading-[1.1] uppercase mb-6" dangerouslySetInnerHTML={{ __html: recipe.title }}>
                            </h1>
                            <p className="font-sans text-gray-600 text-lg leading-relaxed">
                                {recipe.description}
                            </p>
                        </div>

                        {/* Nutrition Facts Box */}
                        <div className="bg-[#0A4834] rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
                            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Nutrition Facts</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {recipe.nutrition.map((fact) => (
                                    <div key={fact.label} className="bg-[#D9D9D9] p-4 flex flex-col items-center justify-center rounded-sm">
                                        <span className="text-[#0A4834] font-black text-xl">{fact.value}</span>
                                        <span className="text-[#0A4834] font-medium text-xs uppercase tracking-widest">{fact.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Ingredient Section */}
            <section className="py-12 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto">
                    <div className="border-box rounded-[10px] border-2 border-dashed border-[#0A4834] p-10 flex flex-col gap-6">                        <div className="flex items-center gap-4">
                        <span className="font-display text-3xl font-black text-black">{recipe.ingredientsCount}</span>
                        <h2 className="font-display text-3xl font-black text-black uppercase">Ingredient</h2>
                    </div>
                        <p className="font-sans text-gray-600 leading-relaxed max-w-4xl">
                            {recipe.ingredientsText}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. How to Cook Section */}
            <div className="lectRevelComponent  py-20 px-6 md:px-12 lg:px-24">
                <section className="rounded-[10px] py-14 px-6 md:px-12 lg:px-14 bg-[#EAE3D2]">
                    <div className="max-w-[85rem] mx-auto flex flex-col gap-4">

                        <h2 className="font-display text-3xl font-black text-black uppercase">
                            How to Cook :
                        </h2>

                        <div className="flex flex-col gap-3">
                            {recipe.steps.map((step, idx) => (
                                <div key={idx}>

                                    <span className="font-sans font-black text-[#0A4834]">
                                        Step {idx + 1} :
                                    </span>{" "}

                                    <span className="font-sans text-gray-700 leading-snug">
                                        {step}
                                    </span>

            {/* 4. Testimonials Section - Synced with main Recipe Page Standard */}
            <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
                
                {/* 1. BACKGROUND SWIPE ENTRANCE (Direct Reveal over white) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.div 
                        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                        className="relative w-full h-full"
                    >
                        <Image 
                            src="/about/about-6.6.webp" 
                            alt="Testimonials Background" 
                            fill 
                            className="object-cover brightness-[0.85] transform scale-105" 
                        />
                    </motion.div>
                </div>
                
                <div className="relative z-10 w-full max-w-[90rem]">
                    {/* 2-Card Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
                        
                        {/* Testimonial Card 1 - Zoom In Entrance */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                            className="bg-white flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden"
                        >
                            {/* Left Integrated Nav */}
                            <div className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                                <span className="text-2xl text-white font-light">&lt;</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8">
                                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                                </p>
                                <div className="flex items-center gap-5 mt-auto">
                                    <div className="w-14 h-14 bg-[#9F8151] rounded-sm shrink-0 overflow-hidden relative">
                                        <Image src="/about/about.webp" alt="Avatar" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-display font-bold text-black text-base uppercase tracking-tight leading-none mb-1">Abdul Hakkem</span>
                                        <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80">Our Guest</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Integrated Nav (Visible on Mobile only) */}
                            <div className="lg:hidden w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                                <span className="text-2xl text-white font-light">&gt;</span>
                            </div>
                        </motion.div>

                        {/* Testimonial Card 2 - Zoom In Entrance (Staggered) */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                            className="bg-white hidden lg:flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden"
                        >
                            {/* Content */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8">
                                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                                </p>
                                <div className="flex items-center gap-5 mt-auto">
                                    <div className="w-14 h-14 bg-[#9F8151] rounded-sm shrink-0 overflow-hidden relative">
                                        <Image src="/about/about.webp" alt="Avatar" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-display font-bold text-black text-base uppercase tracking-tight leading-none mb-1">Abdul Hakkem</span>
                                        <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80">Our Guest</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Integrated Nav */}
                            <div className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                                <span className="text-2xl text-white font-light">&gt;</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
