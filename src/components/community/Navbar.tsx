import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const navLinksLeft = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Community", href: "/community" },
    ];

    const navLinksRight = [
        { name: "Product", href: "/product" },
        { name: "Events", href: "/gallery" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <nav className="absolute top-0 left-0 z-50 w-full flex justify-center pt-0">
            <div className="relative w-full max-w-[90rem] mx-6">

                {/* Dark Bar Container */}
                <div className="relative h-20 bg-[#0A4834] rounded-b-2xl rounded-t-none shadow-xl flex items-center justify-between px-8 md:px-12">

                    {/* Left Links */}
                    <div className="hidden md:flex gap-10">
                        {navLinksLeft.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Center Logo Area - Hanging down */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 transform z-10">
                        <div className="w-32 h-32 bg-[#F5E6CA] rounded-b-3xl shadow-lg flex flex-col items-center justify-center pt-2 pb-4 border-t-0 border-x border-b border-black/5">
                            {/* Logo Circle */}
                            <div className="relative w-20 h-20 rounded-full border-2 border-[#0A4834] overflow-hidden mb-1 bg-white">
                                <Image
                                    src="/logo.png"
                                    alt="ZEWADI Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[#0A4834] font-bold tracking-[0.2em] text-[10px] font-display uppercase mt-1">
                                ZEWADI
                            </span>
                        </div>
                    </div>

                    {/* Right Links */}
                    <div className="hidden md:flex gap-10">
                        {navLinksRight.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Icon (Visible on small screens) */}
                    <div className="md:hidden flex items-center">
                        <button className="text-white p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
