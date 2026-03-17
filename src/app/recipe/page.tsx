
import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/recipe/Hero";
import VegSalad from "@/components/recipe/VegSalad";
import Blueberry from "@/components/recipe/Blueberry";
import Upma from "@/components/recipe/Upma";
import Testimonials from "@/components/recipe/Testimonials";

export default function RecipePage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <VegSalad />
            <Blueberry />
            <Upma />
            <Testimonials />
            <Footer />
        </main>
    );
}
