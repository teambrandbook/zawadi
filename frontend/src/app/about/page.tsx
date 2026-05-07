import About from "@/components/about/about";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export const metadata = {
  title: "About | Zewadi",
  description:
    "Learn the story behind Zewadi, our approach to thoughtful food, and real customer moments.",
};

export default function AboutPage() {
  return (
    <div>
      <Navbar/>
      <About />
      <Footer/>
    </div>
  );
}
