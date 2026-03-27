
import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/product/Hero";
import TryRecipes from "@/components/product/TryRecipes";
import Testimonials from "@/components/shared/Testimonials";

export default function ProductPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <TryRecipes />
            <Testimonials />
            <Footer />
        </main>
    );
}
