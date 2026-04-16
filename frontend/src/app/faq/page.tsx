import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/faq/Hero";
import Questions from "@/components/faq/Questions";

export default function FAQPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Questions />
            <Footer />
        </main>
    );
}
