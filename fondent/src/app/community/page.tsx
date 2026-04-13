import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/community/Hero";
import GridGallery from "@/components/community/GridGallery";
import CommunityListing from "@/components/community/CommunityListing";
import CommunityFeature from "@/components/community/CommunityFeature";

export default function CommunityPage() {
    
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <GridGallery />
            <CommunityFeature />
            <CommunityListing />
            <Footer />
        </main>
    );
}
