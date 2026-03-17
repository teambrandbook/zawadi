import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-16 pb-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:pr-8">
                        <div className="flex flex-col items-start gap-4">
                            {/* Logo */}
                            <div className="relative w-24 h-24">
                                <Image src="/logo/zawadi-logo.webp" alt="Zewadi Logo" fill className="object-contain" />
                            </div>
                            <span className="font-display font-bold text-[#0A4834] tracking-widest text-xl uppercase">
                                ZEWADI
                            </span>
                        </div>

                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Empowering businesses with innovative solutions for sustainable growth and success.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {/* Twitter */}
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#555] hover:bg-[#0A4834] hover:text-white transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </Link>
                            {/* LinkedIn */}
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#555] hover:bg-[#0A4834] hover:text-white transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </Link>
                            {/* Facebook */}
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#555] hover:bg-[#0A4834] hover:text-white transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">

                        {/* Quick Links */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-sans font-semibold text-[#0A4834] uppercase tracking-wider text-sm">Quick Links</h3>
                            <div className="flex flex-col gap-3">
                                <Link href="/" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Home</Link>
                                <Link href="/about" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">About Us</Link>
                                <Link href="/community" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Community</Link>
                                <Link href="/product" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Product</Link>
                                <Link href="/gallery" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Events</Link>
                                <Link href="/contact" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Contact Us</Link>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-sans font-semibold text-[#0A4834] uppercase tracking-wider text-sm">Company</h3>
                            <div className="flex flex-col gap-3">
                                <Link href="/about" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Our Vision</Link>
                                <Link href="/community" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Partners</Link>
                                <Link href="/blog" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Insights & Blog</Link>
                                <Link href="/faq" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">FAQ</Link>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-sans font-semibold text-[#0A4834] uppercase tracking-wider text-sm">Legal</h3>
                            <div className="flex flex-col gap-3">
                                <Link href="#" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Terms of Service</Link>
                                <Link href="#" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Privacy Policy</Link>
                                <Link href="#" className="text-sm text-[#555] hover:text-[#0A4834] transition-colors">Cookie Policy</Link>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-gray-400">
                        © 2025 Zewadi. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}
