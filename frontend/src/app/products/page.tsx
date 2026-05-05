"use client";

import React from "react";
import ProductHero from "@/components/products/ProductHero";
import ProductDetails from "@/components/products/ProductDetails";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <ProductHero />
      <ProductDetails />
      <Footer/>
    </div>
  );
}
