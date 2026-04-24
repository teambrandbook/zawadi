"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-6 pb-12 px-4 md:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-[115rem] mx-auto bg-[#D8C29A] rounded-[10px] pt-16 pb-10 px-6 md:px-12 lg:px-24 text-[#0A4834] shadow-md">

                {/* Main Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8 mb-12">

                        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 lg:pr-8">
                            <div className="relative w-44 h-44 md:w-50 md:h-50 -ml-8 -mt-8 -mb-10">
                                <Image
                                    src="/logo/zewadi-new-logo.png"
                                    alt="Zewadi Logo"
                                    fill
                                    className="object-contain scale-[1]"
                                />
                            </div>

                            <p className="text-[#0A4834] font-inter font-light text-sm md:text-base leading-relaxed max-w-[280px] opacity-100">
                                Empowering businesses with innovative solutions for sustainable growth and success.
                            </p>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 text-[#0A4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                                    </svg>
                                </Link>
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 text-[#0A4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </Link>
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 text-[#0A4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-span-1 flex flex-col gap-4">
                            <h3 className="font-inter font-light text-[#000000] text-sm md:text-lg tracking-widest">
                                Quick Links
                            </h3>
                            <div className="flex flex-col font-inter font-light gap-2">
                                <Link href="/">Home</Link>
                                <Link href="/about">About</Link>
                                <Link href="/community">Community</Link>
                                <Link href="/events">Events</Link>
                                <Link href="/contact">Contact Us</Link>
                            </div>
                        </div>

                        {/* Inner Pages */}
                        <div className="col-span-1 flex flex-col gap-4">
                            <h3 className="font-inter font-light text-[#000000] text-sm md:text-lg tracking-widest">
                                Inner Pages
                            </h3>
                            <div className="flex flex-col font-inter font-light gap-2">
                                <Link href="/recipe">Recipes</Link>
                                <Link href="/product">Product</Link>
                                <Link href="/gallery">Gallery</Link>
                                <Link href="/blog">Blogs</Link>
                                <Link href="/faq">FAQ</Link>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
                            <h3 className="font-inter font-light text-[#000000] text-sm md:text-lg tracking-widest">
                                Support
                            </h3>

                            {/* ✅ 2x2 in mobile */}
                            <div className="flex flex-col font-inter font-light gap-2">
                                <Link href="#" className="whitespace-nowrap">
                                    Terms and conditions
                                </Link>
                                <Link href="#">
                                    Privacy policy
                                </Link>
                                <Link href="#" className="whitespace-nowrap">
                                    Refund and cancellation
                                </Link>
                                <Link href="#">
                                    Shipping Policy
                                </Link>
                            </div>
                        </div>

                    </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-[#0A4834]/10 flex flex-col md:flex-row items-center justify-center gap-4">
                    <p className="text-sm font-inter font-light opacity-70 text-center">
                        © 2025 Zewadi. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}