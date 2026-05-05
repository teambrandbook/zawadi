import React from "react";
import galleryData from "@/data/gallery.json";
import ContentSection from "../common/ContentSection";

const GalleryHero = () => {
  const { hero } = galleryData;

  return (
    <ContentSection 
      title={hero.title} 
      subtitle={hero.subtitle} 
      sectionClassName="relative z-10"
    />
  );
};

export default GalleryHero;
