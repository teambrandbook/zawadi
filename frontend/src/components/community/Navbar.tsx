"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";

export default function Navbar({ bgColor = "bg-[#0A4834]" }: { bgColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobilePagesOpen, setIsMobilePagesOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "AR">("EN");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"));
  };

  const navLinksLeft = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Community", href: "/community" },
  ];

  const navLinksRight = [
    { name: "Product", href: "/product" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const innerPages = [
    { name: "FAQ", href: "/faq" },
    { name: "Recipe", href: "/recipe" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
  ];

  useEffect(() => {
    const close = () => setIsPagesOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <nav className="absolute top-0 left-0 z-50 w-full flex justify-center pt-0">
      <div className="relative w-full max-w-[90rem] mx-3 ">

        {/* Navbar */}
        <div className={`relative h-20 ${bgColor} rounded-b-2xl shadow-xl flex items-center justify-between px-4 md:px-8 lg:px-12`}>

          {/* Left Links */}
          <div
            className="hidden md:flex gap-3 lg:gap-6 items-center md:pr-12 lg:pr-20"
            onMouseLeave={() => setIsPagesOpen(false)}
            onClick={() => setIsPagesOpen(false)}
          >
            {navLinksLeft.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/90 font-medium hover:text-white transition-colors text-[10px] lg:text-xs uppercase tracking-widest font-mulish"
              >
                {link.name}
              </Link>
            ))}

            {/* Pages Dropdown */}
            <div className="relative z-50">
              <button
                className="text-white/90 font-medium hover:text-white transition-colors text-[10px] lg:text-xs uppercase tracking-widest font-mulish flex items-center gap-1"
                onMouseEnter={() => setIsPagesOpen(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPagesOpen(prev => !prev);
                }}
              >
                Pages
                <svg
                  className={`w-3 h-3 transition-transform ${isPagesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`absolute left-0 top-full pt-4 z-50 transition-all duration-200 ease-out ${isPagesOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
                  }`}
              >
                <div className="w-44 bg-white border border-[#0A4834]/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                  {innerPages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="block px-6 py-3 text-[#0A4834] hover:bg-[#0A4834]/5 text-xs uppercase font-bold tracking-widest font-mulish transition-colors"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile User Icon (FIXED POSITION) */}
          <div className="md:hidden absolute left-4 top-5 pl-8">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 top-10 w-40 bg-[#0A4834] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-3 text-white hover:bg-white/10 text-xs uppercase font-bold font-mulish text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile left placeholder */}
          <div className="md:hidden w-10"></div>

          {/* Logo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <Link
              href="/"
              className="w-28 md:w-32 h-28 md:h-32 bg-[#F5E6CA] rounded-b-3xl shadow-lg flex flex-col items-center justify-center pt-2 pb-4 border-x border-b border-black/5 hover:bg-[#ebd8b4] transition-colors group"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#0A4834] overflow-hidden mb-1 bg-white">
                <Image
                  src="/logo/zawadi-logo.webp"
                  alt="ZEWADI Logo"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-[#0A4834] font-light tracking-[0.2em] text-[8px] md:text-[10px] font-boldonse mt-1">
                Zewadi
              </span>
            </Link>
          </div>

          {/* Right Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 md:pl-12 lg:pl-20">
            {navLinksRight.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/90 font-medium hover:text-white transition-colors text-[10px] lg:text-xs uppercase tracking-widest font-mulish"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={toggleLang}
              className={`flex items-center gap-2 rounded-full  ${bgColor} px-3 py-1.5 text-white shadow-md hover:bg-[#174c3b] transition`}
            >
              <Globe size={16} />
              <span className="text-sm font-medium">{lang}</span>
            </button>

            <div className="relative ml-2 pl-4 border-l border-white/20 h-6 flex items-center">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className={`absolute right-0 top-12 w-40 ${bgColor} border border-white/10 rounded-xl shadow-2xl py-2 z-50`}>
                    <Link href="/communitLogin" className="block px-6 py-3 text-white hover:bg-white/10 text-xs uppercase font-bold font-mulish">
                      Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex absolute left-61 top-5 items-center gap-2">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-2 rounded-full ${bgColor} px-3 py-1.5 text-white shadow-md hover:bg-[#174c3b] transition`}
            >
              <Globe size={16} />
              <span className="text-sm font-medium">{lang}</span>
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full mt-4 left-0 w-full bg-[#0A4834] rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col gap-4">
            {[...navLinksLeft, ...navLinksRight].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-white py-3 border-b border-white/10 text-center uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setIsMobilePagesOpen(!isMobilePagesOpen)}
              className="text-white py-3 border-b border-white/10 text-center uppercase tracking-widest flex justify-center items-center gap-2"
            >
              Pages
              <span>{isMobilePagesOpen ? "▲" : "▼"}</span>
            </button>

            {isMobilePagesOpen && (
              <div className="flex flex-col bg-white/5 rounded-lg overflow-hidden ">
                {innerPages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white py-2 border-b border-white/10 text-center text-sm"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}