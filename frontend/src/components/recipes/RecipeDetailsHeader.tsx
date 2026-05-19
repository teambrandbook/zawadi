"use client";

import ContentSection from "@/components/common/ContentSection";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

export default function RecipeDetailsHeader() {
  const { locale } = useLocale();
  const heroText = translations[locale]?.recipesPage?.hero || translations.en.recipesPage.hero;

  return <ContentSection title={heroText.title} subtitle={heroText.subtitle} />;
}
