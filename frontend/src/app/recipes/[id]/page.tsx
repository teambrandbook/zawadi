import { getRecipeById } from "@/lib/recipes";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ContentSection from "@/components/common/ContentSection";
import RecipeDetailsClient from "@/components/recipes/RecipeDetailsClient";

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

  return (
    <div>
      <Navbar/>
      <ContentSection
        title="Zewadi Recipes"
        subtitle="Delicious Zewadi Buckwheat Recipes"
      />
      <RecipeDetailsClient key={id} id={id} />
      <Footer/>
    </div>
  );
}
