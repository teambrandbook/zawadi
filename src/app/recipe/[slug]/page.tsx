import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import RecipeDetail from "@/components/recipe/RecipeDetail";
import { notFound } from "next/navigation";
import Testimonials from "@/components/recipe/Testimonials";
import { recipeDetaila } from "../../../../lib/datafile";



export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const recipe = recipeDetaila[slug as keyof typeof recipeDetaila];

    if (!recipe) {
        notFound();
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <RecipeDetail recipe={recipe} />
            <Testimonials />
            <Footer />
        </main>
    );
}
