"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Payment from "@/components/payment/payment";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <Payment />
      <Footer />
    </div>
  );
}
