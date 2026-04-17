"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-6 pb-12 px-4 md:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-[115rem] mx-auto bg-[#EAE3D2] rounded-[10px] pt-16 pb-10 px-6 md:px-12 lg:px-24 text-[#0A4834] shadow-md">

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

                    {/* Inner Grid */}
                    <div className="col-span-2 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-8">

                        {/* Brand */}
                        <div className="flex flex-col gap-6 lg:pr-8">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 -ml-4 -mt-4 -mb-6">
                                <Image
                                    src="/logo/zawadi-logo.webp"
                                    alt="Zewadi Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <p className="text-[#3A6B56] font-mulish text-sm md:text-base leading-relaxed max-w-[280px] opacity-80">
                                Empowering businesses with innovative solutions for sustainable growth and success.
                            </p>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 fill-[#7D7D7D]" viewBox="0 0 24 24">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.309 17.41z"/>
                                    </svg>
                                </Link>
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 fill-[#7D7D7D]" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </Link>
                                <Link href="#" className="hover:opacity-70 transition-opacity">
                                    <svg className="w-5 h-5 fill-[#7D7D7D]" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col gap-4 pl-8">
                            <h3 className="font-boldonse font-light text-sm md:text-lg tracking-widest">
                                Quick Links
                            </h3>
                            <div className="flex flex-col font-mulish gap-2">
                                <Link href="/">Home</Link>
                                <Link href="/about">About</Link>
                                <Link href="/community">Community</Link>
                                <Link href="/events">Events</Link>
                                <Link href="/contact">Contact Us</Link>
                            </div>
                        </div>

                        {/* Inner Pages */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-boldonse font-light text-sm md:text-lg tracking-widest">
                                Inner Pages
                            </h3>
                            <div className="flex flex-col font-mulish gap-2">
                                <Link href="/recipe">Recipes</Link>
                                <Link href="/product">Product</Link>
                                <Link href="/gallery">Gallery</Link>
                                <Link href="/blog">Blogs</Link>
                                <Link href="/faq">FAQ</Link>
                            </div>
                        </div>

                        {/* Support (✅ fixed responsive grid) */}
                        <div className="flex flex-col gap-4 md:pl-8 lg:pl-0">
                            <h3 className="font-boldonse font-light text-sm md:text-lg tracking-widest">
                                Support
                            </h3>

                            {/* ✅ 2x2 in mobile */}
                            <div className="flex flex-col font-mulish gap-2">
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
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-[#0A4834]/10 flex flex-col md:flex-row items-center justify-center gap-4">
                    <p className="text-sm font-boldonse font-light opacity-70 text-center">
                        © 2025 Zewadi. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}