"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilter from "@/components/recipes/RecipeFilter";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { stackRecipeCards } from "@/utils/animations";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

const ALL_CATEGORY = "SHOW ALL";
const DEFAULT_CATEGORY = ALL_CATEGORY;
const FALLBACK_IMAGES = [
  "/recipe/recipe-1.webp",
  "/recipe/recipe-2.webp",
  "/recipe/recipe-3.webp",
  "/recipe/recipe-4.webp",
  "/recipe/lunch-1.webp",
  "/recipe/lunch-2.webp",
  "/recipe/lunch-3.webp",
  "/recipe/lunch-4.webp",
  "/recipe/dessert-1.webp",
  "/recipe/dessert-2.webp",
  "/recipe/dessert-3.webp",
  "/recipe/dessert-4.webp",
  "/recipe/dinner-1.webp",
  "/recipe/dinner-2.webp",
  "/recipe/dinner-3.webp",
  "/recipe/dinner-4.webp",
];

type BackendRecipe = {
  slug?: string;
  id: number | string;
  title: string;
  category?: string;
  cover_image?: string | null;
  cover_image_url?: string | null;
  image?: string | null;
  short_description?: string;
  video_url?: string | null;
};

type BackendRecipesResponse =
  | BackendRecipe[]
  | {
      data?: BackendRecipe[];
      results?: BackendRecipe[];
    };

function fallbackImage(index = 0) {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function mediaUrl(recipe: BackendRecipe, index = 0) {
  const value = recipe.cover_image || recipe.cover_image_url || recipe.image;
  if (!value) return fallbackImage(index);
  return getImageUrl(value);
}

function mapBackendRecipe(recipe: BackendRecipe, index = 0): Recipe {
  const category = String(recipe.category || "BREAKFAST").toUpperCase();
  return {
    id: recipe.slug || String(recipe.id),
    title: recipe.title,
    description: recipe.short_description || "",
    image: mediaUrl(recipe, index),
    categories: [category],
    benefits: [],
    videoUrl: recipe.video_url ?? null,
  };
}

export default function RecipeList({ recipes: initialRecipes = [] }: { recipes?: Recipe[] }) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isLoading, setIsLoading] = useState(initialRecipes.length === 0);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);

  const categories = Array.from(
    new Set([
      ALL_CATEGORY,
      ...recipes.flatMap((recipe) => recipe.categories),
    ])
  );

  const filteredRecipes =
    activeCategory === ALL_CATEGORY
      ? recipes
      : recipes.filter((recipe) =>
        recipe.categories.includes(activeCategory)
      );


  useEffect(() => {
    // Wait one tick so React has flushed the new cards to the DOM
    const id = setTimeout(() => stackRecipeCards(".recipe-card"), 0);
    return () => clearTimeout(id);
  }, [activeCategory, filteredRecipes.length]);

  useEffect(() => {
  let mounted = true;

  api
    .get<BackendRecipesResponse>("/recipes/published/")
    .then(({ data }) => {

      const raw = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.results)
            ? data.results
            : [];

      if (mounted) {
        setRecipes(raw.map(mapBackendRecipe));
      }
    })
    .catch((error) => {
      console.error("Failed to load published recipes:", error);
      if (mounted && initialRecipes.length === 0) setRecipes([]);
    })
    .finally(() => {
      if (mounted) setIsLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);

  return (
    <section className="bg-[#FFFEF5] px- pb-24 pt-16 sm:px-6 md:pb-32 md:pt-20 lg:px-23">
      <div className="mx-auto max-w-[1920px]">
        <RecipeFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        {isLoading ? (
          <p className="mt-16 text-center text-sm text-[#6B7280]">Loading recipes...</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="mt-16 text-center text-sm text-[#6B7280]">No published recipes found.</p>
        ) : (
          <div className="mt-16 space-y-20 md:mt-20 md:space-y-28 lg:space-y-[96px]">
            {filteredRecipes.map((recipe, index: number) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
