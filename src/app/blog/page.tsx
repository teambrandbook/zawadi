
import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/blog/Hero";
import DishStory from "@/components/blog/DishStory";
import LatestArticles from "@/components/blog/LatestArticles";

export default function BlogPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <DishStory image="/product/product-5.webp" slug="product-5" />
            <DishStory image="/recipe/recipe-4.webp" slug="recipe-4" />
            <LatestArticles />
            <Footer />
        </main>
    );
}
