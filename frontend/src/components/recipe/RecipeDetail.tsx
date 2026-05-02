"use client";

import Image from "next/image";
import { useEffect } from "react";
import { dashBorderAnimation, imageAnimation, leftReveal } from "../../../lib/animations";
import IncreditionsTable from "./IncreditionsTable";

interface Ingredient {
    id: number;
    ingredient_name: string;
    quantity: string;
    unit: string;
    note: string;
}

interface Step {
    id: number;
    step_no: number;
    description: string;
}

interface RecipeData {
    title: string;
    short_description: string;
    cover_image: string;
    prep_time_minutes: number;
    cooking_time_minutes: number;
    servings: number;
    difficulty_level: string;
    ingredients: Ingredient[];
    steps: Step[];
}

interface RecipeDetailProps {
    recipe: RecipeData;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
    useEffect(() => {
        imageAnimation(".img")
        leftReveal(".lectRevelComponent")

        const el = document.querySelector(".border-box") as HTMLElement;
        if (el) {
            dashBorderAnimation(el);
        }
    }, [])

    const nutrition = [
        { label: "Prep Time", value: `${recipe.prep_time_minutes ?? 0} min` },
        { label: "Cook Time", value: `${recipe.cooking_time_minutes ?? 0} min` },
        { label: "Servings", value: String(recipe.servings ?? "-") },
        { label: "Difficulty", value: recipe.difficulty_level ?? "-" },
    ];

    const ingredients = recipe.ingredients ?? [];
    const ingredientsText = ingredients
        .map((i) => [i.quantity, i.unit, i.ingredient_name].filter(Boolean).join(" "))
        .join(", ");

    const steps = recipe.steps ?? [];

    return (
        <div className="sm:pt-10 w-full bg-white">
            {/* 1. Hero / Top Section */}
            <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Image */}
                    <div className="img relative aspect-square rounded-none overflow-hidden group shadow-2xl ">
                        {recipe.cover_image && (
                            <Image
                                src={recipe.cover_image}
                                alt={recipe.title}
                                fill
                                className="object-cover rounded-[10px]"
                            />
                        )}
                        {/* Play Button Overlay */}
                        <div className="absolute bottom-6 right-6 w-14 h-14 bg-[#0A4834] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Right: Content & Recipe Info */}
                    <div className="lectRevelComponent flex flex-col gap-8">
                        <div>
                            <h1 className="font-boldonse text-xl md:text-[2rem] font-light text-black leading-[1.3] mb-8" dangerouslySetInnerHTML={{ __html: recipe.title }}>
                            </h1>
                            <p className="font-mulish text-gray-600 text-lg leading-relaxed">
                                {recipe.short_description}
                            </p>
                        </div>

                        {/* Recipe Info Box */}
                        <div className="bg-[#0A4834] sm:w-100 rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
                            <h3 className="font-display text-xl font-light text-white tracking-wider">Recipe Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {nutrition.map((fact) => (
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
            <IncreditionsTable count={ingredients.length} text={ingredientsText} />

            {/* 3. How to Cook Section */}
            <div className="lectRevelComponent py-20 px-6 md:px-12 lg:px-24">
                <section className="rounded-[10px] py-14 px-6 md:px-12 lg:px-14 bg-[#EAE3D2]">
                    <div className="max-w-[85rem] mx-auto flex flex-col gap-4">

                        <h2 className="font-display text-2xl font-light text-black">
                            How to Cook :
                        </h2>

                        <div className="flex flex-col gap-3">
                            {steps.map((step, idx) => (
                                <div key={step.id ?? idx}>
                                    <span className="font-mulish font-black text-[#0A4834]">
                                        Step {step.step_no} :
                                    </span>{" "}
                                    <span className="font-mulish text-gray-700 leading-snug">
                                        {step.description}
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
