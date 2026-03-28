
import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/blog/Hero";
import LatestArticles from "@/components/blog/LatestArticles";
import Bloges from "@/components/blog/Bloges";

export default function BlogPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />    
            <Bloges/>
            <LatestArticles />
            <Footer />
        </main>
    );
}
