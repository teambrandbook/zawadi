import { notFound } from "next/navigation";
import RecipeDetailsContent from "@/components/recipes/RecipeDetailsContent";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { type Recipe, type RecipeNutrition } from "@/components/recipes/recipeTypes";
import { getImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import ContentSection from "@/components/common/ContentSection";

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

type BackendRecipeDetailResponse =
  | BackendRecipeDetail
  | {
      data?: BackendRecipeDetail;
    };

const RECIPE_DETAIL_TIMEOUT_MS = 5000;

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-1.webp";
  return getImageUrl(value);
}

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
    id: String(recipe.id),
    slug: recipe.slug || String(recipe.id),
    title: recipe.title,
    description: recipe.short_description || "",
    image: mediaUrl(recipe.cover_image),
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

function recipeFromResponse(payload: BackendRecipeDetailResponse): BackendRecipeDetail | undefined {
  if ("id" in payload) return payload;
  return payload.data;
}

async function getRecipe(recipeId: string): Promise<Recipe | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RECIPE_DETAIL_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/recipes/published/${recipeId}/`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return undefined;

    const payload = (await response.json()) as BackendRecipeDetailResponse;
    const recipe = recipeFromResponse(payload);
    return recipe ? mapBackendRecipe(recipe) : undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

export function generateMetadata() {
  return {
    title: "Zewadi Recipe | Zewadi Recipes",
    description: "Explore delicious Zewadi buckwheat recipes.",
  };
}

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <ContentSection
        title="Zewadi Recipes"
        subtitle="Delicious Zewadi Buckwheat Recipes"
      />
      <RecipeDetailsContent recipe={recipe} />
      <Footer />
    </div>
  );
}
