"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import OrderPlaced from "@/components/orderplaced/orderplaced";

export default function OrderPlacedPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <OrderPlaced />
      <Footer />
    </div>
  );
}
