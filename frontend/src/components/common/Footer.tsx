"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Brands from "./BrandIcons";
import navData from "@/data/navigation.json";

type SocialPlatform = "Facebook" | "Instagram" | "TikTok" | "Linkedin";

const iconMap: Record<SocialPlatform, React.ComponentType<{ size?: number; className?: string }>> = {
  Facebook: Brands.Facebook,
  Instagram: Brands.Instagram,
  TikTok: Brands.TikTok,
  Linkedin: Brands.Linkedin,
};

const Footer = () => {
  const { footer, socials } = navData;

  return (
    <footer className="relative overflow-hidden bg-[#1A4331] pb-12 pt-24 text-white">
      <div className="pointer-events-none absolute inset-0 select-none opacity-100">
        <Image
          src="/bg/world-map.png"
          alt="World Map Background"
          fill
          className="scale-100 object-contain opacity-1000"
          priority
        />
        <div className="absolute inset-0 bg-[#1A4331]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A4331] via-transparent to-[#1A4331]/40" />
      </div>

      <div className="relative z-10 w-full px-4 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Logo & Info Column */}
          <div className="lg:col-span-4 flex flex-col items-start mb-12 lg:mb-0">
            <Link href="/" className="relative w-44 h-44 md:w-52 md:h-52 lg:w-64 lg:h-64 -mb-16 md:-mb-20 lg:-mb-28 -top-16 md:-top-20 lg:-top-28 block overflow-hidden rounded-xl">
               <Image 
                src="/logo/zewadi-logo.webp"
                alt="Zewadi Logo"
                fill
                className="object-contain object-left scale-150 transition-transform duration-500 hover:scale-[1.6]"
               />
            </Link>

            <p className="mb-8 max-w-[340px] text-[15px] font-medium leading-relaxed text-white/80">
              Thoughtfully crafted food for everyday living, shared moments, and a more intentional way to nourish life.
            </p>

            <div className="flex items-center space-x-6">
              {socials.map((social, index) => {
                const Icon = iconMap[social.platform as SocialPlatform];
                if (!Icon) return null;

                const isExternal = social.href.startsWith("http");

                return (
                  <a
                    key={`${social.platform}-${index}`}
                    href={social.href}
                    className="group"
                    aria-label={social.platform}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                  >
                    <div className="flex h-5 w-5 items-center justify-center text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white">
                      <Icon size={20} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid Container */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 gap-12 lg:gap-16">
            {/* Quick Links Column - Span 2 on mobile to sit on top of the next row */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-4">
                {footer.quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors text-[15px] font-medium block h-full w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inner Pages Column */}
            <div className="col-span-1">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Inner Pages</h4>
              <ul className="space-y-4">
                {footer.innerPages.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors text-[15px] font-medium block h-full w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div className="col-span-1">
              <h4 className="text-[17px] font-bold mb-8 text-white uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Support</h4>
              <ul className="space-y-4">
                {footer.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors text-[15px] font-medium block h-full w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-10 md:flex-row">
          <p className="text-[13px] font-medium text-white/40">
            &copy; {new Date().getFullYear()} Zewadi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
