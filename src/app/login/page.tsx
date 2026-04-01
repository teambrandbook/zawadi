import Navbar from "@/components/community/Navbar";
import CommenLogin from "@/components/shared/CommenLogin";
import Footer from "@/components/shared/Footer";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="pb-6 ">
        <CommenLogin />
      </div>
      <Footer />
    </div>
  );
}
