"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { borderDraw, dashBorderAnimation, imageAnimation, leftReveal } from "../../../lib/animations";
import IncreditionsTable from "./IncreditionsTable";

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
        // borderDraw(".border-box")

        // ------------------------------

        const el = document.querySelector(".border-box") as HTMLElement;

        if (el) {
            dashBorderAnimation(el);
        }

    }, [])

    return (
        <div className="sm:pt-10 w-full bg-white">
            {/* 1. Hero / Top Section */}
            <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Image with Play Button */}
                    <div className="img relative aspect-square rounded-none overflow-hidden group shadow-2xl ">
                        <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover rounded-[10px]"
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
                        <div className="bg-[#0A4834] sm:w-100 rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
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
            <IncreditionsTable count={recipe.ingredientsCount}  text={recipe.ingredientsText}/>;

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

                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            </div>


        </div>
    );
}
