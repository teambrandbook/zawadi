import Blogs from "@/components/blogs/blogs";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export const metadata = {
  title: "Blogs | Zewadi",
  description:
    "Read Zewadi blog stories on mindful living, community growth, and food experiences.",
};

export default function BlogsPage() {
  return (
    <div>
      <Navbar/>
      <Blogs />
      <Footer/>
    </div>
  );
}
