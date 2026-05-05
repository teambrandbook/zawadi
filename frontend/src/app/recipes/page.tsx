"use client";

import ContentSection from "@/components/common/ContentSection";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import RecipeList from "@/components/recipes/RecipeList";
import { recipes } from "@/lib/recipes";

// export const metadata = {
//   title: "Zewadi Recipes | Delicious Zewadi Buckwheat Recipes",
//   description:
//     "Explore delicious Zewadi buckwheat recipes for breakfast, lunch, dessert, and dinner.",
// };

export default function RecipesPage() {
  return (
    <main className="bg-white text-[#0e2207]">
      <Navbar/>
     <ContentSection title="Zewadi Recipes" subtitle="Delicious Zewadi Buckwheat Recipes"/> 
      <RecipeList recipes={recipes} />
      <Footer/>
    </main>
  );
}
