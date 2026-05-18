import React, { Suspense } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductDetails from "@/components/products/ProductDetails";

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
            Loading product...
          </div>
        }
      >
        <ProductDetails />
      </Suspense>
      <Footer />
    </div>
  );
}
