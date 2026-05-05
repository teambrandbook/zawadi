"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import contactData from "@/data/contact.json";
import gsap, { animateFadeInLeft } from "@/lib/gsap";

const ContactForm = () => {
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
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Side: Contact Info */}
          <div className="contact-stagger space-y-10">
            <div className="space-y-4">
              <span className="text-[#1A4331] font-caveat text-2xl">Contact Us</span>
              <h2 className="text-4xl md:text-5xl font-inter font-bold text-[#1A4331]">
                Get in Touch Now
              </h2>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed font-inter">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="contact-stagger space-y-8">
              {/* Phone */}
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">Have Question?</p>
                  <p className="text-[#1A4331] font-bold">Free +50 (9210) 85413</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">Write Email</p>
                  <p className="text-[#1A4331] font-bold">zewadihelp@gmail.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#1A4331] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">Our Location</p>
                  <p className="text-[#1A4331] font-bold">88 Brooklyn Golden USA</p>
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
                  placeholder="Your Name"
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Phone number"
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none placeholder:text-[#1A4331]/80 placeholder:opacity-100"
                />
              </div>
              <textarea
                placeholder="Write Message"
                rows={5}
                className="w-full bg-white border border-gray-100 rounded-lg px-6 py-4 text-sm focus:ring-1 focus:ring-[#1A4331] transition-all outline-none resize-none placeholder:text-[#1A4331]/80 placeholder:opacity-100"
              ></textarea>

              <button
                type="submit"
                className="group flex items-center gap-4 bg-[#1A4331] text-white px-10 py-4 rounded-full font-bold hover:bg-[#1A4331]/90 transition-all shadow-lg active:scale-95"
              >
                Send Message
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1A4331] group-hover:translate-x-1 transition-transform">
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
              title="Google Maps Location"
            ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
