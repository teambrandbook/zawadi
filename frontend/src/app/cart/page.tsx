"use client";

import Cart from "@/components/cart/cart";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <Cart />
      <Footer />
    </div>
  );
}
