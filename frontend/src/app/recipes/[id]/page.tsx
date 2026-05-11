import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";
import RecipeDetailsContent from "@/components/recipes/RecipeDetailsContent";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { type Recipe, type RecipeNutrition } from "@/components/recipes/recipeTypes";
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

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-1.webp";
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  if (value.startsWith("http")) return value;
  if (value.startsWith("/media/")) return `${apiBase.replace(/\/api\/?$/, "")}${value}`;
  if (value.startsWith("/")) return value;
  return `${apiBase.replace(/\/api\/?$/, "")}/${value.replace(/^\/+/, "")}`;
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
    id: recipe.slug || String(recipe.id),
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

// Fetch all published recipes from the API and map them to frontend types
async function getAllRecipes(): Promise<Recipe[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const response = await fetch(`${apiBase}/recipes/published/`, { cache: "no-store" });
  const payload = await response.json();
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.results)
    ? payload.results
    : [];
  return raw.map(mapBackendRecipe);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allRecipes = await getAllRecipes();
  const recipe = allRecipes.find((r) => r.id === id);

  if (!recipe) {
    return {
      title: "Recipe Not Found | Zewadi Recipes",
    };
  }

  return {
    title: `${recipe.title} | Zewadi Recipes`,
    description: recipe.description,
  };
}

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allRecipes = await getAllRecipes();
  const recipe = allRecipes.find((r) => r.id === id);

  if (!recipe) {
    notFound();
  }

  return (
    <div>
      <Navbar/>
      <ContentSection
        title="Zewadi Recipes"
        subtitle="Delicious Zewadi Buckwheat Recipes"
      />
      <RecipeDetailsContent recipe={recipe} />
      <Footer/>
    </div>
  );
}
