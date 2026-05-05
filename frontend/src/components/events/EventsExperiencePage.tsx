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

export default function EventsExperiencePage() {
   useEffect(() => {
      fadeIn(".fade-in");
      imageAnimationtopdown(".image-topdown")
      zoomInStagger(".zoom-item:not(.upcoming-zoom-item)")
      zoomInStagger(".upcoming-zoom-item")
      imageAnimationLeftToRight(".left-reveal")
      leftReveal(".left-move")
    }, []);
  return (
    <div className="bg-white pb-24  text-[#0e2207]">
      <ContentSection title="Zewadi Events" subtitle="Zewadi Community Events " />
      <MomentsSection />
      <CommunitySection />
      <UpcomingEvents />
      <PastEvents />
      <EventTestimonials />
    </div>
  );
}
