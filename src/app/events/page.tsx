import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/events/Hero";
import StoryCheckerboard from "@/components/events/StoryCheckerboard";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import Testimonials from "@/components/events/Testimonials";

export default function EventsPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <Hero />
            <StoryCheckerboard />
            <UpcomingEvents />
            <Testimonials />
            <Footer />
        </main>
    );
}
