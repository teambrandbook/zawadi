"use client";

import ContentSection from "@/components/common/ContentSection";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import RecipeList from "@/components/recipes/RecipeList";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

// export const metadata = {
//   title: "Zewadi Recipes | Delicious Zewadi Buckwheat Recipes",
//   description:
//     "Explore delicious Zewadi buckwheat recipes for breakfast, lunch, dessert, and dinner.",
// };

export default function RecipesPage() {
  const { locale } = useLocale();
  const recipeText = translations[locale]?.recipesPage || translations.en.recipesPage;

  return (
    <main className="bg-[#fffef5] text-[#0e2207]">
      <Navbar/>
     <ContentSection title={recipeText.hero.title} subtitle={recipeText.hero.subtitle}/> 
      <RecipeList recipes={[]} />
      <Footer/>
    </main>
  );
}
