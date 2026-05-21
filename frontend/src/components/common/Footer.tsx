"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Brands from "./BrandIcons";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type SocialPlatform = "Facebook" | "Instagram" | "X" | "Linkedin";

const iconMap: Record<SocialPlatform, React.ComponentType<{ size?: number; className?: string }>> = {
  Facebook: Brands.Facebook,
  Instagram: Brands.Instagram,
  X: Brands.X,
  Linkedin: Brands.Linkedin,
};

const Footer = () => {
  const { locale } = useLocale();

  // Select target dataset object dictionary securely
  const dict = translations[locale] || translations.en;
  const { footer, socials, meaningSection } = dict;

  const getHref = (path: string) => {
    if (path === "#") return "#";
    return path;
  };

  return (
    <footer className="relative overflow-hidden bg-[#1A4331] pb-12 pt-24 text-white">
      {/* Background World Map Graphic */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-100">
        <Image
          src="/bg/world-map.png"
          alt="World Map Background"
          fill
          className="scale-100 object-contain opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-[#1A4331]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A4331] via-transparent to-[#1A4331]/40" />
      </div>

      <div className="relative z-10 w-full px-4 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Logo & Info Description Area */}
          <div className="lg:col-span-4 flex flex-col items-start mb-12 lg:mb-0">
            <Link 
              href={getHref("/")} 
              className="relative w-44 h-44 md:w-52 md:h-52 lg:w-64 lg:h-64 -mb-16 md:-mb-20 lg:-mb-28 -top-16 md:-top-20 lg:-top-28 block overflow-hidden rounded-xl"
            >
               <Image 
                src="/logo/zewadi-logo.webp"
                alt="Zewadi Logo"
                fill
                className="object-contain object-left scale-150 transition-transform duration-500 hover:scale-[1.6]"
               />
            </Link>

            <p className="mb-8 max-w-[340px] text-[15px] font-medium leading-relaxed text-white/80">
              {meaningSection.description1}
            </p>

            {/* Social Icons Container with Direction-Agnostic Flex Gap */}
            <div className="flex items-center gap-6">
              {socials.map((social, index) => {
                const Icon = iconMap[social.platform as SocialPlatform];
                if (!Icon) return null;

                return (
                  <a
                    key={`${social.platform}-${index}`}
                    href={social.href}
                    className="group"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex h-5 w-5 items-center justify-center text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white">
                      <Icon size={20} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigational Links Configuration Columns */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-12 lg:col-span-8 lg:gap-16">
            
            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                {footer.headers.quickLinks}
              </h4>
              <ul className="space-y-4">
                {footer.quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={getHref(item.href)}
                      className="block h-full w-full text-[14px] font-medium text-white/60 transition-colors hover:text-white sm:text-[15px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inner Pages Links */}
            <div className="col-span-1">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                {footer.headers.innerPages}
              </h4>
              <ul className="space-y-4">
                {footer.innerPages.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={getHref(item.href)}
                      className="block h-full w-full text-[14px] font-medium text-white/60 transition-colors hover:text-white sm:text-[15px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Rules Links */}
            <div className="col-span-1 col-start-1 row-start-2 md:col-start-auto md:row-start-auto">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
                {footer.headers.support}
              </h4>
              <ul className="space-y-4">
                {footer.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={getHref(item.href)}
                      className="block h-full w-full whitespace-nowrap text-[13px] font-medium text-white/60 transition-colors hover:text-white sm:text-[15px] md:whitespace-normal"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic Timestamp Legal & Copyright Area */}
        <div className="mt-24 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-10 md:flex-row">
          <p className="text-[13px] font-medium text-white/40">
            &copy; {new Date().getFullYear()} Zewadi. {footer.headers.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
