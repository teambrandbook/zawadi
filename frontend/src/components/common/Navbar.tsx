"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, User, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import navData from "@/data/navigation.json";
import gsap from "@/lib/gsap";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Delay background color appearance
      const timer = setTimeout(() => {
        setIsMenuBgVisible(true);
      }, 300);

      gsap.fromTo(
        ".mobile-link",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );
      return () => clearTimeout(timer);
    } else {
      setIsMenuBgVisible(false);
      setExpandedLink(null);
    }
  }, [isMobileMenuOpen]);

  const handleCloseMenu = () => {
    setIsMenuBgVisible(false);
    setExpandedLink(null);
    // Delay closing of the menu container to allow background to disappear
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 400);
  };

  const toggleExpand = (name: string) => {
    setExpandedLink(expandedLink === name ? null : name);
  };

  const { navLinks, footer } = navData as any;
  const innerPages = footer.innerPages;

  if (!mounted) return null;

  return (

    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-[1000] transition-all duration-500",
          isMenuBgVisible || isScrolled || pathname !== "/"
            ? "bg-[#1A4331]/95 backdrop-blur-md shadow-lg"
            : "bg-[#1A4331]/95 backdrop-blur-md shadow-lg"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-14 md:h-20">
          {/* Hanging Logo Container */}
          <div className="relative z-50 w-[100px] md:w-[160px] lg:ml-20">
            <Link href="/" className="block">
              <div className={cn(
                "absolute transition-all duration-500 overflow-hidden flex items-center justify-center p-2 md:p-3",
                "bg-[#1A4331] border-x border-b border-white/10 rounded-b-xl shadow-2xl w-[85px] h-[85px] md:w-[105px] md:h-[105px] lg:w-[120px] lg:h-[120px] xl:w-[135px] xl:h-[135px] -top-10 translate-y-0 left-2 md:left-6 lg:left-1 xl:left-4 2xl:left-[-2rem]"
              )}>
                <div className="relative w-full h-full scale-100 transition-transform duration-500">
                  <Image
                    src="/logo/zewadi-logo.webp"
                    alt="Zewadi Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link: any) => (
              <div key={link.name} className="relative group py-4">
                {link.hasDropdown ? (
                  <div className="flex items-center gap-1 text-[15px] font-semibold text-white/90 hover:text-brand-primary transition-all duration-300 cursor-pointer">
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[1100]">
                      <div className="bg-[#1A4331] border border-white/10 rounded-xl shadow-2xl p-4 min-w-[200px] backdrop-blur-xl">
                        <div className="flex flex-col space-y-1">
                          {innerPages.map((item: any) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="text-white/70 hover:text-brand-primary hover:bg-white/5 px-4 py-2.5 rounded-lg transition-all text-sm font-medium whitespace-nowrap flex items-center justify-between group/item"
                            >
                              {item.name}
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[15px] font-semibold transition-all duration-300",
                      isLinkActive(link.href) ? "text-brand-primary" : "text-white/90 hover:text-brand-primary"
                    )}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/20 transition-all">
              <Globe className="text-white mr-2" size={18} />
              <span className="text-white font-bold text-sm">En</span>
            </div>

            {/* Profile Icon */}
            <Link href="/login">
  <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-brand-primary hover:text-brand-dark transition-all shadow-inner">
    <User size={22} />
  </div>
</Link>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white ml-2 z-[1001]"
              onClick={() => isMobileMenuOpen ? handleCloseMenu() : setIsMobileMenuOpen(true)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[1050] transition-opacity duration-500 lg:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={handleCloseMenu}
      />

      {/* Mobile Menu Container */}
      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-y-0 right-0 w-[85%] md:w-[60%] bg-[#1A4331] z-[1100] flex flex-col pt-32 px-10 transition-transform duration-700 lg:hidden shadow-2xl border-l border-white/10",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close Button Inside Menu */}
        <button
          className="absolute top-8 right-8 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[1200] cursor-pointer"
          onClick={handleCloseMenu}
        >
          <X size={32} />
        </button>

        <div className="flex flex-col space-y-6 relative z-10 overflow-y-auto max-h-[70vh] pr-4">
          {navLinks.map((link: any, idx: number) => (
            <div key={link.name} className="flex flex-col">
              {link.hasDropdown ? (
                <div className="flex flex-col">
                  <div
                    className="mobile-link text-2xl md:text-3xl font-playfair font-bold text-white/80 flex items-center justify-between py-2 cursor-pointer transition-colors hover:text-brand-primary"
                    onClick={() => toggleExpand(link.name)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-dm tracking-[0.3em] text-brand-primary/60 mt-2">
                        0{idx + 1}
                      </span>
                      {link.name}
                    </div>
                    <ChevronDown
                      size={20}
                      className={cn(
                        "text-brand-primary/40 transition-transform duration-300",
                        expandedLink === link.name && "rotate-180"
                      )}
                    />
                  </div>

                  {/* Sub-links in Mobile */}
                  <div
                    className={cn(
                      "flex flex-col space-y-4 pl-8 overflow-hidden transition-all duration-500 ease-in-out opacity-0",
                      expandedLink === link.name ? "max-h-[500px] mt-4 opacity-100" : "max-h-0"
                    )}
                  >
                    {innerPages.map((item: any) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-inter text-white/60 hover:text-brand-primary transition-colors flex items-center justify-between"
                        onClick={handleCloseMenu}
                      >
                        {item.name}
                        <ArrowRight size={16} className="text-brand-primary/40" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "mobile-link text-2xl md:text-3xl font-playfair font-bold transition-colors flex items-center justify-between py-2",
                    isLinkActive(link.href) ? "text-brand-primary" : "text-white/80 hover:text-brand-primary"
                  )}
                  onClick={handleCloseMenu}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-dm tracking-[0.3em] text-brand-primary/60 mt-2">
                      0{idx + 1}
                    </span>
                    {link.name}
                  </div>
                  <ArrowRight size={20} className="text-brand-primary/40" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Language Switcher */}
        <div className="mt-auto mb-10 mobile-link opacity-0 relative z-10">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/10 transition-all">
            <Globe className="text-brand-primary mr-3" size={20} />
            <span className="text-white font-bold text-lg">En - English</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
