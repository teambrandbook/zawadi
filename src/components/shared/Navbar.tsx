"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinksLeft = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Community", href: "/community" },
    ];

    const navLinksRight = [
        { name: "Product", href: "/product" },
        { name: "Events", href: "/events" },
        { name: "Contact Us", href: "/contact" },
    ];

    const innerPages = [
        { name: "FAQ", href: "/faq" },
        { name: "Recipe", href: "/recipe" },
        { name: "Gallery", href: "/gallery" },
        { name: "Blog", href: "/blog" },
    ];

    const [isPagesOpen, setIsPagesOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="absolute -top-1 left-0 z-50 w-full flex justify-center">
            <div className="relative w-full max-w-7xl mx-4">
                {/* True Glassmorphism Bar - Enhanced Discovery Overlay */}
                <div className="absolute inset-0 h-20 bg-white/25 backdrop-blur-3xl border border-white/30 shadow-2xl rounded-2xl"></div>

                <div className="relative flex items-center justify-between h-20 px-4 md:px-10">
                    {/* Left Links (Desktop) */}
                    <div className="hidden 2xl:flex gap-3 lg:gap-6 items-center lg:pr-10 xl:pr-20">
                        {navLinksLeft.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[#0A4834] font-semibold hover:text-[#0A4834]/70 transition-colors text-xs lg:text-sm uppercase tracking-widest font-sans drop-shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Pages Dropdown */}
                        <div className="relative group">
                            <button
                                onMouseEnter={() => setIsPagesOpen(true)}
                                onMouseLeave={() => setIsPagesOpen(false)}
                                className="text-[#0A4834] font-semibold hover:text-[#0A4834]/70 transition-colors text-xs lg:text-sm uppercase tracking-widest font-sans drop-shadow-sm flex items-center gap-1"
                            >
                                Pages
                                <svg className={`w-3 h-3 transition-transform ${isPagesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                onMouseEnter={() => setIsPagesOpen(true)}
                                onMouseLeave={() => setIsPagesOpen(false)}
                                className={`absolute left-0 top-full pt-4 transition-all duration-300 ${isPagesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                            >
                                <div className="w-44 bg-white border border-[#0A4834]/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                                    {innerPages.map((page) => (
                                        <Link
                                            key={page.name}
                                            href={page.href}
                                            className="block px-6 py-3 text-[#0A4834] hover:bg-[#0A4834]/5 text-xs uppercase font-bold tracking-widest transition-colors"
                                        >
                                            {page.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Placeholder (Left) */}
                    <div className="2xl:hidden w-10"></div>

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
                        <Link href="/" className="w-24 md:w-32 h-20 md:h-28 bg-[#F5E6CA] rounded-b-[1.5rem] shadow-2xl flex items-center justify-center pt-1 pb-3 border-x border-b border-black/5 hover:bg-[#ebd8b4] transition-all hover:-translate-y-1 group px-1">
                            <div className="relative w-24 h-24 md:w-32 md:h-32">
                                <Image
                                    src="/logo/zawadi-logo.webp"
                                    alt="ZEWADI Logo"
                                    fill
                                    className="object-contain group-hover:scale-105 transition-transform"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Links & User Menu (Desktop) */}
                    <div className="hidden 2xl:flex items-center gap-3 lg:gap-6 lg:pl-10 xl:pl-20">
                        {navLinksRight.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[#0A4834] font-semibold hover:text-[#0A4834]/70 transition-colors text-xs lg:text-sm uppercase tracking-widest font-sans drop-shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="relative ml-2 pl-4 border-l border-[#0A4834]/20 h-6 flex items-center">
                            {/* User Menu Trigger (Minimalist Icon Style) */}
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="text-[#0A4834] hover:opacity-70 transition-all p-1"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-12 w-40 bg-[#0A4834] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden transform transition-all">
                                        <Link
                                            href="/login"
                                            className="block px-6 py-3 text-white/90 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-6 py-3 text-white/90 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest transition-colors border-t border-white/5"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="2xl:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#0A4834] p-2 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className="2xl:hidden absolute top-20 left-0 w-full bg-[#0A4834] rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-300">
                        {[...navLinksLeft, ...navLinksRight].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-white/90 font-medium py-3 border-b border-white/10 last:border-0 text-center uppercase tracking-widest font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {/* Mobile Auth */}
                        <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-4 bg-white text-[#0A4834] font-bold rounded-xl text-center uppercase tracking-widest font-sans"
                            >
                                Login
                            </Link>
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-3 text-white py-3 font-medium uppercase tracking-widest font-sans"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
