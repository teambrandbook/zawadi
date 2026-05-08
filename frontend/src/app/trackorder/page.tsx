"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import TrackOrder from "@/components/trackorder/trackorder";

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <TrackOrder />
      <Footer />
    </div>
  );
}
