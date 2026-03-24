"use client";

import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/recipe/Hero";
import VegSalad from "@/components/recipe/VegSalad";
import Blueberry from "@/components/recipe/Blueberry";
import Upma from "@/components/recipe/Upma";
import Testimonials from "@/components/recipe/Testimonials";
import RecipeFilter from "@/components/recipe/RecipeFilter";
import { useEffect } from "react";
import { fadeUp } from "../../../lib/animations";

export default function RecipePage() {
  useEffect(()=>{
    fadeUp(".fadeupComponent")
  },[])
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <RecipeFilter />

      <div className="relative lg:h-[400vh]">
        <div className="bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-10">
          <Hero />
        </div>

        <div className="fadeupComponent bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-20">
          <VegSalad />
        </div>

        <div className="fadeupComponent bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-30">
          <Blueberry />
        </div>

        <div className="fadeupComponent bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-40">
          <Upma />
        </div>
      </div>

      <Testimonials />
      <Footer />
    </main>
  );
}