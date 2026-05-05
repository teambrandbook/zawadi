import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";
import RecipeDetailsContent from "@/components/recipes/RecipeDetailsContent";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);

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
  const recipe = getRecipeById(id);

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
