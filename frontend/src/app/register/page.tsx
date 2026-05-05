import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import CommenLogin from "@/components/shared/CommenLogin";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow">
        <CommenLogin />
      </div>
      <Footer />
    </div>
  );
}
