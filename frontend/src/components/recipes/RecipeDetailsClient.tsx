"use client";

import { useEffect, useState } from "react";
import { getRecipeById } from "@/lib/recipes";
import { getImageUrl } from "@/lib/utils";
import api from "@/services/api";
import RecipeDetailsContent from "@/components/recipes/RecipeDetailsContent";
import { type Recipe, type RecipeNutrition } from "@/components/recipes/recipeTypes";

type BackendRecipeDetail = {
  slug?: string;
  id: number | string;
  title: string;
  short_description?: string;
  cover_image?: string | null;
  category?: string;
  health_benefits?: string | null;
  nutrition?: Partial<RecipeNutrition> | null;
  calories?: string | number | null;
  fat?: string | number | null;
  carbs?: string | number | null;
  protein?: string | number | null;
  video_url?: string | null;
  ingredients?: { ingredient_name: string; quantity?: string | null; unit?: string | null }[];
  steps?: { description: string }[];
};

function lines(value?: string | null) {
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function valueWithFallback(value: unknown) {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

function mapNutrition(recipe: BackendRecipeDetail): RecipeNutrition | undefined {
  const source = recipe.nutrition ?? recipe;
  const hasNutrition = ["calories", "fat", "carbs", "protein"].some((key) => {
    const value = source[key as keyof typeof source];
    return value !== null && value !== undefined && value !== "";
  });

  if (!hasNutrition) return undefined;

  return {
    calories: valueWithFallback(source.calories),
    fat: valueWithFallback(source.fat),
    carbs: valueWithFallback(source.carbs),
    protein: valueWithFallback(source.protein),
  };
}

function mapBackendRecipe(recipe: BackendRecipeDetail): Recipe {
  return {
    id: recipe.slug || String(recipe.id),
    title: recipe.title,
    description: recipe.short_description || "",
    image: recipe.cover_image ? getImageUrl(recipe.cover_image) : "/recipe/recipe-1.webp",
    categories: [String(recipe.category || "BREAKFAST").toUpperCase()],
    benefits: lines(recipe.health_benefits),
    ingredients: (recipe.ingredients || []).map((item) =>
      [item.quantity, item.unit, item.ingredient_name].filter(Boolean).join(" ")
    ),
    nutrition: mapNutrition(recipe),
    videoUrl: recipe.video_url ?? null,
    steps: (recipe.steps || []).map((step) => step.description).filter(Boolean),
  };
}

export default function RecipeDetailsClient({ id }: { id: string }) {
  const fallbackRecipe = getRecipeById(id);
  const [recipe, setRecipe] = useState<Recipe | undefined>(fallbackRecipe);
  const [isLoading, setIsLoading] = useState(!fallbackRecipe);

  useEffect(() => {
    let mounted = true;

    if (fallbackRecipe) {
      return;
    }

    api
      .get<BackendRecipeDetail>(`/recipes/${id}/`, { timeout: 5000 })
      .then(({ data }) => {
        if (mounted) setRecipe(mapBackendRecipe(data));
      })
      .catch(() => {
        if (mounted) setRecipe(undefined);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [fallbackRecipe, id]);

  if (isLoading) {
    return (
      <section className="bg-white px-4 py-20 text-center text-sm font-semibold text-[#1f4d3a]">
        Loading recipe...
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="bg-white px-4 py-20 text-center text-sm font-semibold text-[#1f4d3a]">
        Recipe not found.
      </section>
    );
  }

  return <RecipeDetailsContent recipe={recipe} />;
}
