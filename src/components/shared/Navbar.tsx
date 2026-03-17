"use client";

import Link from "next/link";
import Image from "next/image";


// Placeholder for the logo image I generated earlier or just a text placeholder
// Since I can't directly load the generated image without knowing its absolute path in the build, 
// I'll assume I can use a public asset or just a div for now. 
// Ideally I'd copy the generated image to public/ folder but I can't do that easily yet.
// I'll use a text representation for now.

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

    return (
        <nav className="absolute top-0 left-0 z-50 w-full flex justify-center">
            <div className="relative w-full max-w-7xl mx-4">
                {/* Glassmorphism Bar */}
                <div className="absolute inset-0 h-16 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl"></div>

                <div className="relative flex items-center justify-between h-16 px-4 md:px-8">
                    {/* Left Links (Desktop) */}
                    <div className="hidden md:flex gap-4 lg:gap-8">
                        {navLinksLeft.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans drop-shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Placeholder (Left) */}
                    <div className="md:hidden w-10"></div>

                    {/* Center Logo Area - Hanging down */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
                        <Link href="/" className="w-28 md:w-32 h-24 md:h-28 bg-[#F5E6CA] rounded-b-3xl shadow-xl flex flex-col items-center justify-center pt-2 pb-4 border-x border-b border-black/5 hover:bg-[#ebd8b4] transition-colors group">
                            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#0A4834] overflow-hidden mb-1 bg-white">
                                <Image
                                    src="/logo/zawadi-logo.webp"
                                    alt="ZEWADI Logo"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <span className="text-[#0A4834] font-bold tracking-widest text-[10px] md:text-xs font-display uppercase">
                                ZEWADI
                            </span>
                        </Link>
                    </div>

                    {/* Right Links & Profile (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        {navLinksRight.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans drop-shadow-sm mt-0.5"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Auth Section */}
                        <div className="flex items-center gap-4 ml-2 pl-6 border-l border-white/20 h-8">
                            <Link href="/login" className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans drop-shadow-sm">
                                Login
                            </Link>
                            <Link href="/profile" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 group">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button (Right) */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 focus:outline-none"
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
                    <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A4834] rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-300">
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
