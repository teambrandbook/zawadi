"use client";

import React, { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import CommunitySection from "@/components/home/CommunitySection";
import LearnMoreSection from "@/components/home/LearnMoreSection";
import HistorySection from "@/components/home/HistorySection";
import MeaningSection from "@/components/home/MeaningSection";
import ProductSection from "@/components/home/ProductSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { fadeIn, imageAnimationtopdown, zoomInStagger } from "@/utils/animations";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function Home() {
  useEffect(() => {
    fadeIn(".fade-in");
    zoomInStagger(".zoom-item");
    imageAnimationtopdown(".image-topdown")
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Navbar/>
      <HeroSection />
      <CommunitySection />
      <LearnMoreSection />
      <div id="history-section">
        <HistorySection />
      </div>
      <MeaningSection />
      <ProductSection />
      <ExperienceSection />
      <NewsletterSection />
      <Footer/>
    </div>
  );
}
