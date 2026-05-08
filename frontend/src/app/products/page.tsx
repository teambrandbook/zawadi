"use client";

import React from "react";
import ProductHero from "@/components/products/ProductHero";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductCards from "@/components/productcards/productcards";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <ProductHero />
      <ProductCards />
      <Footer/>
    </div>
  );
}
