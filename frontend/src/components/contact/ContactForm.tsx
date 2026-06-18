"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import contactData from "@/data/contact.json";
import gsap, { animateFadeInLeft } from "@/lib/gsap";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { cn } from "@/lib/utils";

const mapQuery = "88 Brooklyn Golden USA";
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

const ContactForm = () => {
  const { locale } = useLocale();
  const isRtl = locale === "ar";
  const contactText = translations[locale]?.contactPage?.form || translations.en.contactPage.form;
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
        <div className="contact-stagger mt-24 overflow-hidden rounded-[1rem] border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className={cn(isRtl ? "text-right" : "text-left")}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {contactText.locationLabel}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#1A4331]">
                {contactText.locationValue}
              </h3>
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1A4331] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1A4331]/90"
            >
              <MapPin size={16} />
              {contactText.mapTitle}
            </a>
          </div>
          <div className="relative h-[400px] w-full bg-gray-50 md:h-[500px]">
            <Image
              src={contactData.map.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <iframe
              src={mapEmbedUrl}
              className="relative z-10 h-full w-full border-0"
              allowFullScreen={true}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              title={contactText.mapTitle}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
