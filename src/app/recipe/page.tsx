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

      {/* <div className="relative lg:h-[400vh]">
        <div className="bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-10">
          <Hero />
        </div>

        <div className="fadeupComponent bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-20">
          <VegSalad />
        </div>

        <div className="fadeupComponent bg-white lg:sticky lg:top-0 lg:min-h-screen lg:z-30">
          <Blueberry />
        </div>

        <div className="fadeupComponent bg-white relative z-40 min-h-screen">
          <Upma />
        </div>
      </div> */}
      <div>
        <Recipys/>
      </div>
 
      <Testimonials />
      <Footer />
    </main>
  );
}