"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilter from "@/components/recipes/RecipeFilter";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { stackRecipeCards } from "@/utils/animations";

const ALL_CATEGORY = "SHOW ALL";
const DEFAULT_CATEGORY = "BREAKFAST";

export default function RecipeList({ recipes }: { recipes: Recipe[] }) {
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
