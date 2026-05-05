import { Metadata } from "next";
import EventsExperiencePage from "@/components/events/EventsExperiencePage";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Zewadi Events | Join our community",
  description:
    "Zewadi events are spaces where people come together, connect, and try something new.",
};

export default function EventsPage() {
  return (
    <div>
      <Navbar/>
      <EventsExperiencePage />
      <Footer/>
    </div>
  );
}
