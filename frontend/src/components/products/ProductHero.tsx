import React from "react";
import productsData from "@/data/products.json";
import ContentSection from "../common/ContentSection";

const ProductHero = () => {
  const { hero } = productsData;

  return (
    <ContentSection 
      title={hero.title} 
      subtitle={hero.subtitle} 
      sectionClassName="relative z-10"
    />
  );
};

export default ProductHero;
