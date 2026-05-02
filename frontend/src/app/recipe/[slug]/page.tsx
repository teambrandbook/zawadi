import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import RecipeDetail from "@/components/recipe/RecipeDetail";
import { notFound } from "next/navigation";
import Testimonials from "@/components/shared/Testimonials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetch(`${API_BASE}/recipes/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) notFound();

    const recipe = await res.json();

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <RecipeDetail recipe={recipe} />
            <Testimonials />
            <Footer />
        </main>
    );
}
