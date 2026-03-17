import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/about/Hero";
import StoryCarousel from "@/components/about/StoryCarousel";
import StoryGrid from "@/components/about/StoryGrid";
import Testimonials from "@/components/about/Testimonials";

export default function AboutPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <StoryCarousel />
            <StoryGrid />
            <Testimonials />
            <Footer />
        </main>
    );
}
