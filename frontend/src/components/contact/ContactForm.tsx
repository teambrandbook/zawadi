"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import contactData from "@/data/contact.json";
import gsap, { animateFadeInLeft } from "@/lib/gsap";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { cn } from "@/lib/utils";

const ContactForm = () => {
  const { locale } = useLocale();
  const isRtl = locale === "ar";
  const contactText = translations[locale]?.contactPage?.form || translations.en.contactPage.form;
  const { map } = contactData;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateFadeInLeft(".contact-stagger", {
        duration: 1.5,
        stagger: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="py-24 bg-[#fffef5] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Side: Contact Info */}
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={cn("contact-stagger space-y-10", isRtl ? "text-right" : "text-left")}
          >
            <div className="space-y-4">
              <span className="text-[#1A4331] font-caveat text-2xl">{contactText.eyebrow}</span>
              <h2 className="text-4xl md:text-5xl font-inter font-bold text-[#1A4331]">
                {contactText.title}
              </h2>
              <p className={cn("w-full text-gray-500 text-sm max-w-md leading-relaxed font-inter", isRtl ? "text-right" : "text-left")}>
                {contactText.description}
              </p>
            </div>

            <div className="contact-stagger space-y-8">
              {/* Phone */}
              <div className={cn("flex items-center gap-5 group", isRtl ? "flex-row-reverse justify-end" : "justify-start")}>
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone size={20} />
                </div>
                <div className={cn("min-w-0", isRtl ? "text-right" : "text-left")}>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">{contactText.phoneLabel}</p>
                  <p className="text-[#1A4331] font-bold">{contactText.phoneValue}</p>
                </div>
              </div>

              {/* Email */}
              <div className={cn("flex items-center gap-5 group", isRtl ? "flex-row-reverse justify-end" : "justify-start")}>
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} />
                </div>
                <div className={cn("min-w-0", isRtl ? "text-right" : "text-left")}>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">{contactText.emailLabel}</p>
                  <p className="text-[#1A4331] font-bold">{contactText.emailValue}</p>
                </div>
              </div>

              {/* Location */}
              <div className={cn("flex items-center gap-5 group", isRtl ? "flex-row-reverse justify-end" : "justify-start")}>
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={20} />
                </div>
                <div className={cn("min-w-0", isRtl ? "text-right" : "text-left")}>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">{contactText.locationLabel}</p>
                  <p className="text-[#1A4331] font-bold">{contactText.locationValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="contact-stagger bg-[#F9F9F7] p-8 md:p-12 rounded-[1.5rem]">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder={contactText.namePlaceholder}
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100 rtl:text-right"
                />
                <input
                  type="email"
                  placeholder={contactText.emailPlaceholder}
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100 rtl:text-right"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder={contactText.phonePlaceholder}
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100 rtl:text-right"
                />
                <input
                  type="text"
                  placeholder={contactText.subjectPlaceholder}
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100 rtl:text-right"
                />
              </div>
              <textarea
                placeholder={contactText.messagePlaceholder}
                rows={5}
                className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none resize-none placeholder:text-[#1A4331]/80 placeholder:opacity-100 rtl:text-right"
              ></textarea>

              <button
                type="submit"
                className="group flex items-center gap-4 bg-[#1A4331] text-white px-10 py-4 rounded-full font-bold hover:bg-[#1A4331]/90 transition-all shadow-lg active:scale-95"
              >
                {contactText.submit}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1A4331] transition-transform ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                  <ArrowRight size={18} />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Map Section Container */}
        <div className="mt-24 relative w-full h-[400px] md:h-[500px] rounded-[1rem] overflow-hidden bg-gray-50 border border-gray-100 group shadow-sm flex items-center justify-center">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d98169.78498569176!2d-105.2835841698285!3d39.74401336929289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b981287686cf7%3A0x14c64654208055dc!2sGolden%2C%20CO%2C%20USA!5e0!3m2!1sen!2sin!4v1777295173458!5m2!1sen!2sin" 
              className="w-full h-full border-0" 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={contactText.mapTitle}
            ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
