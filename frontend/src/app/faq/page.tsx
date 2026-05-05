import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Faq from "@/components/faq/faq";

export const metadata = {
  title: "FAQ | Zewadi",
  description: "Frequently asked questions about Zewadi products and community.",
};

export default function FaqPage() {
  return (
  <div>
    <Navbar/>
    <Faq />
    <Footer/>
  </div>
);
}
