// import Navbar from "@/components/shared/Navbar";
import Navbar from "@/components/community/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Community from "@/components/home/Community";
import Story from "@/components/home/Story";
import Developing from "@/components/home/Developing";
import Product from "@/components/home/Product";
import Events from "@/components/home/Events";
import Health from "@/components/home/Health";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* <Navbar /> */}
      <Navbar bgColor="bg-white/10 border-white/20"/>
      <Hero />
      <About />
      <Community />
      <Story />
      <Developing />
      <Product />
      <Events />
      <Health />
      <Newsletter />
      <Footer />
    </main>
  );
}
