"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilter from "@/components/recipes/RecipeFilter";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { stackRecipeCards } from "@/utils/animations";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

const ALL_CATEGORY = "SHOW ALL";
const DEFAULT_CATEGORY = "BREAKFAST";

type BackendRecipe = {
  slug?: string;
  id: number | string;
  title: string;
  category?: string;
  cover_image?: string | null;
  short_description?: string;
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
  };
}

export default function RecipeList({ recipes: initialRecipes }: { recipes: Recipe[] }) {
  const [recipes, setRecipes] = useState(initialRecipes);
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
    stackRecipeCards(".recipe-card");
  }, [activeCategory]);

  useEffect(() => {
    let mounted = true;
    api.get("/recipes/")
      .then(({ data }) => {
        const raw = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        if (mounted && raw.length > 0) {
          setRecipes(raw.map(mapBackendRecipe));
        }
      })
      .catch(() => {
        // Keep static design data as fallback.
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

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28 lg:space-y-[96px]">          {filteredRecipes.map((recipe, index: number) => (

          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            reverse={index % 2 === 1}
          />

        ))}
        </div>
      </div>
    </section>
  );
}
