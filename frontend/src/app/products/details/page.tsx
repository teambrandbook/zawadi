"use client";

import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductDetails from "@/components/products/ProductDetails";

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetails />
      <Footer />
    </div>
  );
}
