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

type BackendRecipe = {
  slug?: string;
  id: number | string;
  title: string;
  category?: string;
  cover_image?: string | null;
  short_description?: string;
  video_url?: string | null;
};

type BackendRecipesResponse =
  | BackendRecipe[]
  | {
      data?: BackendRecipe[];
      results?: BackendRecipe[];
    };

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-1.webp";
  return getImageUrl(value);
}

function mapBackendRecipe(recipe: BackendRecipe): Recipe {
  const category = String(recipe.category || "BREAKFAST").toUpperCase();
  return {
    id: recipe.slug || String(recipe.id),
    title: recipe.title,
    description: recipe.short_description || "",
    image: mediaUrl(recipe.cover_image),
    categories: [category],
    benefits: [],
    videoUrl: recipe.video_url ?? null,
  };
}

export default function RecipeList({ recipes: initialRecipes }: { recipes: Recipe[] }) {
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

      console.log("RECIPES API DATA:", data);

      const raw = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.results)
            ? data.results
            : [];

      console.log("RAW RECIPES:", raw);

      if (mounted) {
        setRecipes(raw.map(mapBackendRecipe));
      }
    })
    .catch((error) => {

      console.log("API ERROR:", error);

      if (mounted) setRecipes([]);
    })
    .finally(() => {
      if (mounted) setIsLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);

  return (
    <section className="bg-white px- pb-24 pt-16 sm:px-6 md:pb-32 md:pt-20 lg:px-23">
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
