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

                            <p className="text-[#3A6B56] text-sm md:text-base leading-relaxed max-w-[280px] opacity-80">
                                Empowering businesses with innovative solutions for sustainable growth and success.
                            </p>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <Link href="#" className="hover:scale-110 transition">
                                    <svg className="w-5 h-5 fill-current"><path d="M23.953 4.57..." /></svg>
                                </Link>
                                <Link href="#" className="hover:scale-110 transition">
                                    <svg className="w-5 h-5 fill-current"><path d="M20.447 20.452..." /></svg>
                                </Link>
                                <Link href="#" className="hover:scale-110 transition">
                                    <svg className="w-5 h-5 fill-current"><path d="M24 12.073..." /></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col gap-4 pl-8">
                            <h3 className="font-bold text-sm md:text-lg uppercase tracking-widest">
                                Quick Links
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/">Home</Link>
                                <Link href="/about">About</Link>
                                <Link href="/community">Community</Link>
                                <Link href="/events">Events</Link>
                                <Link href="/contact">Contact Us</Link>
                            </div>
                        </div>

                        {/* Inner Pages */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-sm md:text-lg uppercase tracking-widest">
                                Inner Pages
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/recipe">Recipes</Link>
                                <Link href="/product">Product</Link>
                                <Link href="/gallery">Gallery</Link>
                                <Link href="/blog">Blogs</Link>
                                <Link href="/faq">FAQ</Link>
                            </div>
                        </div>

                        {/* Support (✅ fixed responsive grid) */}
                        <div className="flex flex-col gap-4 md:pl-8 lg:pl-0">
                            <h3 className="font-bold text-sm md:text-lg uppercase tracking-widest">
                                Support
                            </h3>

                            {/* ✅ 2x2 in mobile */}
                            <div className="flex flex-col gap-2">
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
                    <p className="text-sm font-semibold opacity-70 text-center">
                        © 2025 Zewadi. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}