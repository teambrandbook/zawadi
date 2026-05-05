"use client";

import React from "react";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <GalleryHero />
      <GalleryGrid />
      <Footer/>
    </div>
  );
}
