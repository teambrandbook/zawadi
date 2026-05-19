"use client"

import CommunitySection from "@/components/events/CommunitySection";
import EventHeader from "@/components/events/EventHeader";
import EventTestimonials from "@/components/events/EventTestimonials";
import MomentsSection from "@/components/events/MomentsSection";
import PastEvents from "@/components/events/PastEvents";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import ContentSection from "../common/ContentSection";
import { useEffect } from "react";
import { fadeIn, imageAnimationLeftToRight, imageAnimationtopdown, leftReveal, zoomInStagger } from "@/utils/animations";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

export default function EventsExperiencePage() {
   const { locale } = useLocale();
   const eventsText = translations[locale]?.eventsPage || translations.en.eventsPage;

   useEffect(() => {
      fadeIn(".fade-in");
      imageAnimationtopdown(".image-topdown")
      zoomInStagger(".zoom-item:not(.upcoming-zoom-item)")
      zoomInStagger(".upcoming-zoom-item")
      imageAnimationLeftToRight(".left-reveal")
      leftReveal(".left-move")
    }, []);
  return (
    <div className="bg-[#fffef5] pb-24 max-sm:px-5 text-[#0e2207]">
      <ContentSection title={eventsText.hero.title} subtitle={eventsText.hero.subtitle} />
      <MomentsSection />
      <CommunitySection />
      <UpcomingEvents /> 
      <PastEvents />
      <EventTestimonials />
    </div>
  );
}
