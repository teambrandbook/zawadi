"use client";

import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Recipys from "@/components/recipe/Recipys"
import Testimonials from "@/components/shared/Testimonials";
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

      
      <div>
        <Recipys/>
      </div>
 
      <Testimonials />
      <Footer />
    </main>
  );
}