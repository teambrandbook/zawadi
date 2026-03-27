"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-6 pb-12 px-4 md:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-[115rem] mx-auto bg-[#EAE3D2] rounded-[10px] pt-16 pb-10 px-8 md:px-16 lg:px-24 text-[#0A4834] shadow-md transform transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:pr-8">
                        <div className="flex flex-col items-start gap-0">
                            {/* Even Larger Logo - focused purely on the brand mark */}
                            <div className="relative w-36 h-36 md:w-44 md:h-44 -ml-4 -mt-4 -mb-8">
                                <Image src="/logo/zawadi-logo.webp" alt="Zewadi Logo" fill className="object-contain" />
                            </div>
                            {/* Text removed as it's redundant (present in logo asset) */}
                        </div>

                        <p className="font-sans text-[#3A6B56] text-[14px] md:text-[15px] leading-relaxed max-w-[280px] opacity-80 mt-2">
                            Empowering businesses with innovative solutions for sustainable growth and success.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-2">
                            {/* Twitter */}
                            <Link href="#" className="text-[#3A6B56] hover:text-[#0A4834] transition-colors transform hover:scale-110">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </Link>
                            {/* LinkedIn */}
                            <Link href="#" className="text-[#3A6B56] hover:text-[#0A4834] transition-colors transform hover:scale-110">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </Link>
                            {/* Facebook */}
                            <Link href="#" className="text-[#3A6B56] hover:text-[#0A4834] transition-colors transform hover:scale-110">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">

                        {/* Quick Links */}
                        <div className="flex flex-col gap-6">
                            <h3 className="font-sans font-bold text-[#0A4834] text-lg opacity-80 uppercase tracking-widest">
                                Quick Links
                            </h3>
                            <div className="flex flex-col gap-3">
                                <Link href="/">Home</Link>
                                <Link href="/about">About</Link>
                                <Link href="/community">Community</Link>
                                <Link href="/events">Events</Link>
                                <Link href="/contact">Contact Us</Link>
                            </div>
                        </div>

                        {/* Inner Pages */}
                        <div className="flex flex-col gap-6">
                            <h3 className="font-sans font-bold text-[#0A4834] text-lg opacity-80 uppercase tracking-widest">
                                Inner Pages
                            </h3>
                            <div className="flex flex-col gap-3">
                                <Link href="/recipe">Recipes</Link>
                                <Link href="/product">Product</Link>
                                <Link href="/gallery">Gallery</Link>
                                <Link href="/blog">Blogs</Link>
                                <Link href="/faq">FAQ</Link>
                            </div>
                        </div>

                        {/* Support (🔥 important part) */}
                        <div className="flex flex-col gap-6 col-span-2 lg:col-span-1 items-center text-center lg:items-start lg:text-left">
                            <h3 className="font-sans font-bold text-[#0A4834] text-lg opacity-80 uppercase tracking-widest">
                                Support
                            </h3>
                            <div className="grid grid-cols-1 max-sm:grid-cols-2 gap-y-3  max-sm:gap-x-18">
                                <Link href="#" className="whitespace-nowrap">Terms and conditions</Link>
                                <Link href="#" >Privacy policy</Link>
                                <Link href="#" className="whitespace-nowrap ">Refund and cancellation</Link>
                                <Link href="#">Shipping Policy</Link>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#0A4834]/10 flex flex-col md:flex-row items-center justify-center gap-4">
                    <p className="text-sm font-semibold opacity-70">
                        © 2025 Zewadi . All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
