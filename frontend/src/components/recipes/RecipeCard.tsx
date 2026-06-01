"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Heart } from "lucide-react";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { translations } from "@/locales/translations";

type RecipeCardLabels = typeof translations.en.recipesPage.list;
type RecipeNutritionLabels = typeof translations.en.recipesPage.detail;

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: () => void;
  reverse?: boolean;
  labels: RecipeCardLabels;
  nutritionLabels: RecipeNutritionLabels;
}

export default function RecipeCard({
  recipe,
  isFavorite,
  toggleFavorite,
  reverse = false,
  labels,
  nutritionLabels,
}: RecipeCardProps) {
  const benefits = recipe.benefits ?? [];
  const [imageSrc, setImageSrc] = useState(recipe.image || "/recipe/recipe-1.webp");

  useEffect(() => {
    setImageSrc(recipe.image || "/recipe/recipe-1.webp");
  }, [recipe.image]);

  return (
    <article
      className={`recipe-card grid min-h-[520px] origin-top items-start gap-6 bg-[#fffef5] px-4 pt-6 sm:gap-7 sm:px-6 sm:pt-8 md:gap-8 md:pt-10 lg:min-h-[680px] lg:grid-cols-[490px_minmax(0,1fr)] lg:gap-[100px] lg:px-20 lg:pt-0
      ${
        reverse
          ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1"
          : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative mx-auto h-[360px] w-full max-w-[380px] overflow-hidden rounded-[12px] sm:h-[420px] lg:h-[600px] lg:max-w-[490px]">
        <Image
          src={imageSrc}
          alt={recipe.title}
          fill
          unoptimized
          onError={() => setImageSrc("/recipe/recipe-1.webp")}
          className="object-cover"
        />

        {/* Video Button */}
        {recipe.videoUrl ? (
          <a
            href={recipe.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.watchVideo.replace("{title}", recipe.title)}
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4d3a] text-white shadow-lg transition hover:scale-105 hover:bg-[#163a2b] rtl:left-4 rtl:right-auto"
          >
            <PlayCircle className="h-5 w-5" />
          </a>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="max-w-[560px] pt-1 text-left rtl:text-right md:max-w-none lg:max-w-[560px]">
        {/* Title */}
        <h2 className="font-[600] text-[30px] leading-[38px] text-black md:text-[46px] md:leading-[52px] [font-family:'Playfair_Display']">
          {recipe.title}
        </h2>

        {/* Description */}
        <p className="mt-10 text-[13px] font-[700] leading-[1.2] text-[#1F4D3A] md:text-[16px] [font-family:'Inter']">
          {recipe.description}
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <>
            <h3 className="mt-5 text-[16px] font-[800] text-black md:text-[18px] [font-family:'Inter']">
              {labels.benefits}
            </h3>

            <ul className="mt-3 space-y-1 text-[13px] font-[700] leading-[1.2] text-[#1F4D3A] md:text-[16px] [font-family:'Inter']">
              {benefits.map((benefit: string) => (
                <li key={benefit} className="flex gap-2">
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F4D3A]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {recipe.nutrition && (
          <div className="mt-7">
            <h3 className="font-['Playfair_Display'] text-[18px] font-semibold text-[#1F4D3A] md:text-[20px]">
              {nutritionLabels.nutritionFacts}
            </h3>
            <p className="mt-1 text-[13px] font-[800] leading-[1.2] text-black md:text-[15px] [font-family:'Inter']">
              {recipe.nutrition.calories} {nutritionLabels.calories},{" "}
              {recipe.nutrition.fat} {nutritionLabels.fat},{" "}
              {recipe.nutrition.carbs} {nutritionLabels.carbs},{" "}
              {recipe.nutrition.protein} {nutritionLabels.protein}
            </p>
          </div>
        )}

        {/* Action Row: Learn More & Favorite */}
        <div className="mt-8 flex items-center gap-15">
          <Link
            href={`/recipes/${recipe.id}`}
            className="relative inline-flex items-center rounded-full bg-[#1f4d3a] py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#163a2b] ltr:pl-6 ltr:pr-16 rtl:pl-16 rtl:pr-6"
          >
            <span>{labels.learnMore}</span>

            <span className="absolute flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-white bg-[#1f4d3a] ltr:right-[-18px] rtl:left-[-18px]">
              <ArrowRight className="h-4 w-4 text-white rtl:rotate-180" />
            </span>
          </Link>

          <button
            type="button"
            aria-label={(isFavorite ? labels.removeFavorite : labels.addFavorite).replace("{title}", recipe.title)}
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f4d3a] text-white transition hover:bg-[#163a2b]"
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-white stroke-white"
                  : "stroke-white fill-transparent"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
