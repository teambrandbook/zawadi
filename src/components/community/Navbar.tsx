"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
        { name: "Contact", href: "/contact" },
    ];

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="absolute top-0 left-0 z-50 w-full flex justify-center pt-0">
            <div className="relative w-full max-w-[90rem] mx-4 md:mx-6">

                {/* Dark Bar Container */}
                <div className="relative h-20 bg-[#0A4834] rounded-b-xl rounded-t-none shadow-xl flex items-center justify-between px-4 md:px-8 lg:px-12">

                    {/* Left Links */}
                    <div className="hidden 2xl:flex gap-3 lg:gap-6 xl:gap-10 items-center md:pr-12 lg:pr-24">
                        {navLinksLeft.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/80 font-medium hover:text-white transition-all text-[10px] lg:text-xs uppercase tracking-[0.2em] font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button Placeholder (Left) - for balance */}
                    <div className="2xl:hidden w-10"></div>

                    {/* Center Logo Area - Balanced High-Density Branding */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 transform z-10">
                        <Link href="/" className="w-24 md:w-32 h-24 md:h-32 bg-[#EAE3D2] rounded-b-2xl shadow-2xl flex flex-col items-center justify-center pt-2 pb-2 border-t-0 border-x border-b border-black/5 hover:brightness-95 transition-all group overflow-visible">
                            {/* Larger Logo on a compact container as requested */}
                            <div className="relative w-22 h-22 md:w-32 md:h-32">
                                <Image
                                    src="/logo/zawadi-logo.webp"
                                    alt="ZEWADI Logo"
                                    fill
                                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Links & User Menu (Desktop) */}
                    <div className="hidden 2xl:flex items-center gap-3 lg:gap-6 xl:gap-10 md:pl-12 lg:pl-24">
                        {navLinksRight.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/80 font-medium hover:text-white transition-all text-[10px] lg:text-xs uppercase tracking-[0.2em] font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* User Breadcrumb Icon Menu - Compact & Professional */}
                        <div className="relative ml-2 pl-4 border-l border-white/10 h-6 flex items-center">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 group overflow-hidden"
                            >
                                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-12 w-44 bg-[#0A4834] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden transform transition-all">
                                        <Link 
                                            href="/login" 
                                            className="block px-6 py-4 text-white/80 hover:bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            href="/profile" 
                                            className="block px-6 py-4 text-white/80 hover:bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors border-t border-white/5"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button (Right) */}
                    <div className="2xl:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>

                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className="2xl:hidden absolute top-24 left-0 w-full bg-[#0A4834] rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-300">
                        {[...navLinksLeft, ...navLinksRight].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 font-medium py-4 border-b border-white/5 last:border-0 text-center uppercase tracking-[0.2em] font-sans text-xs"
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
