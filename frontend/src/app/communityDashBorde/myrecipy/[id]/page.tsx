import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getRecipeById } from "@/lib/recipes";
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
  return value === null || value === undefined || value === "" ? "—" : String(value);
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
    steps: (recipe.steps || []).map((step) => step.description).filter(Boolean),
  };
}

async function getRecipe(id: string): Promise<Recipe | undefined> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const accessToken = (await cookies()).get("access_token")?.value;
    const response = await fetch(`${apiBase}/recipes/${id}/`, {
      cache: "no-store",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (response.ok) {
      const payload = await response.json();
      return mapBackendRecipe((payload?.data ?? payload) as BackendRecipeDetail);
    }
  } catch {
    // Fall back to bundled design data.
  }

  return getRecipeById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

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
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div>
      <RecipeDetailsContent recipe={recipe} />
    </div>
  );
}
