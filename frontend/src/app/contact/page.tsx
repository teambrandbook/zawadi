"use client";

import React from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <ContactHero />
      <ContactForm />
      <Footer/>
    </div>
  );
}
