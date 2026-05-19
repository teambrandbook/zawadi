"use client";

import React from "react";
import ContentSection from "../common/ContentSection";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

const ProductHero = () => {
  const { locale } = useLocale();
  const hero = translations[locale]?.productsPage?.hero || translations.en.productsPage.hero;

  return (
    <ContentSection 
      title={hero.title} 
      subtitle={hero.subtitle} 
      sectionClassName="relative z-10"
    />
  );
};
/*  */
export default ProductHero;
