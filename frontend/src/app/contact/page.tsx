import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/contact/Hero";
import ContactInfo from "@/components/contact/ContactInfo";
import FAQ from "@/components/contact/FAQ";

export default function ContactPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <ContactInfo />
            <FAQ />
            <Footer />
        </main>
    );
}
