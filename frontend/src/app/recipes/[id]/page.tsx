import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";
import RecipeDetailsContent from "@/components/recipes/RecipeDetailsContent";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { getImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

type BackendRecipeDetail = {
  slug?: string;
  id: number | string;
  title: string;
  short_description?: string;
  cover_image?: string | null;
  category?: string;
  health_benefits?: string | null;
  ingredients?: { ingredient_name: string; quantity?: string | null; unit?: string | null }[];
  steps?: { description: string }[];
};

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
    steps: (recipe.steps || []).map((step) => step.description).filter(Boolean),
  };
}

async function getRecipe(id: string): Promise<Recipe | undefined> {
  const apiBase = API_BASE_URL;
  try {
    const response = await fetch(`${apiBase}/recipes/${id}/`, { cache: "no-store" });
    if (response.ok) {
      return mapBackendRecipe((await response.json()) as BackendRecipeDetail);
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
      <Navbar/>
      <RecipeDetailsContent recipe={recipe} />
      <Footer/>
    </div>
  );
}
