"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilter from "@/components/recipes/RecipeFilter";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { stackRecipeCards } from "@/utils/animations";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const ALL_CATEGORY = "SHOW ALL";
const DEFAULT_CATEGORY = ALL_CATEGORY;

type BackendRecipe = {
  slug?: string;
  id: number | string;
  title: string;
  category?: string;
  cover_image?: string | null;
  image?: string | null;
  image_url?: string | null;
  thumbnail?: string | null;
  short_description?: string;
  video_url?: string | null;
};

type BackendRecipesResponse =
  | BackendRecipe[]
  | {
      data?: BackendRecipe[];
      results?: BackendRecipe[];
    };

type FavoriteRecipeItem = {
  id?: number | string;
  recipe?: BackendRecipe;
};

type FavoriteRecipesResponse =
  | FavoriteRecipeItem[]
  | {
      data?: FavoriteRecipeItem[];
      results?: FavoriteRecipeItem[];
    };

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-1.webp";
  return getImageUrl(value);
}

function mapBackendRecipe(recipe: BackendRecipe): Recipe {
  const category = String(recipe.category || "BREAKFAST").toUpperCase();
  return {
    id: String(recipe.id),
    slug: recipe.slug || String(recipe.id),
    title: recipe.title,
    description: recipe.short_description || "",
    image: mediaUrl(recipe.cover_image ?? recipe.image ?? recipe.image_url ?? recipe.thumbnail),
    categories: [category],
    benefits: [],
    videoUrl: recipe.video_url ?? null,
  };
}

function recipeListFromResponse(data: BackendRecipesResponse): BackendRecipe[] {
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];
}

function favoriteListFromResponse(data: FavoriteRecipesResponse): FavoriteRecipeItem[] {
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];
}

export default function RecipeList({ recipes: initialRecipes }: { recipes: Recipe[] }) {
  const { locale } = useLocale();
  const recipeText = translations[locale]?.recipesPage?.list || translations.en.recipesPage.list;
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isRehydrating = useSelector((state: RootState) => state.user.isRehydrating);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isLoading, setIsLoading] = useState(initialRecipes.length === 0);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoritePending, setFavoritePending] = useState<Record<string, boolean>>({});

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
        const raw = recipeListFromResponse(data);

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

  useEffect(() => {
    // Wait for rehydration before deciding; skip fetch if unauthenticated.
    if (isRehydrating) return;
    if (!isAuthenticated) {
      setFavorites({});
      return;
    }

    let mounted = true;

    api
      .get<FavoriteRecipesResponse>("/recipes/favorites/")
      .then(({ data }) => {
        if (!mounted) return;

        const favoriteMap = favoriteListFromResponse(data).reduce<Record<string, boolean>>(
          (acc, item) => {
            const recipeId = item.recipe?.id ?? item.id;
            if (recipeId !== undefined && recipeId !== null) {
              acc[String(recipeId)] = true;
            }
            return acc;
          },
          {}
        );
        setFavorites(favoriteMap);
      })
      .catch(() => {
        if (mounted) setFavorites({});
      });

    return () => {
      mounted = false;
    };
  }, [isRehydrating, isAuthenticated]);

  const handleToggleFavorite = async (recipeId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent("/recipes")}`);
      return;
    }

    if (favoritePending[recipeId]) return;

    const nextValue = !favorites[recipeId];
    setFavorites((prev) => ({
      ...prev,
      [recipeId]: nextValue,
    }));
    setFavoritePending((prev) => ({ ...prev, [recipeId]: true }));

    try {
      if (nextValue) {
        await api.post(`/recipes/${recipeId}/favorite/`);
        toast.success(recipeText.saved);
      } else {
        await api.delete(`/recipes/${recipeId}/favorite/`);
        toast.success(recipeText.removed);
      }
    } catch {
      setFavorites((prev) => ({
        ...prev,
        [recipeId]: !nextValue,
      }));
      toast.error(recipeText.favoriteError);
    } finally {
      setFavoritePending((prev) => ({ ...prev, [recipeId]: false }));
    }
  };

  return (
    <section className="bg-[#fffef5] pb-10 pt-16 sm:px-6 md:pb-14 md:pt-20 lg:px-23">
      <div className="mx-auto max-w-[1920px]">
        <RecipeFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
          labels={recipeText.categories}
        />

        {isLoading ? (
          <p className="mt-16 text-center text-sm text-[#6B7280]">{recipeText.loading}</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="mt-16 text-center text-sm text-[#6B7280]">{recipeText.empty}</p>
        ) : (
          <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12 md:mt-14 md:space-y-14 lg:mt-16 ">
            {filteredRecipes.map((recipe, index: number) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={!!favorites[recipe.id]}
                toggleFavorite={() => handleToggleFavorite(recipe.id)}
                reverse={index % 2 === 1}
                labels={recipeText}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
