import React from "react";
import contactData from "@/data/contact.json";
import ContentSection from "../common/ContentSection";

const ContactHero = () => {
  const { hero } = contactData;

  return (
    <ContentSection 
      title={hero.title} 
      subtitle={hero.subtitle} 
      sectionClassName="relative z-10"
    />
  );
};

export default ContactHero;
