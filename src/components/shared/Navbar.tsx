import Link from "next/link";
import Image from "next/image";


// Placeholder for the logo image I generated earlier or just a text placeholder
// Since I can't directly load the generated image without knowing its absolute path in the build, 
// I'll assume I can use a public asset or just a div for now. 
// Ideally I'd copy the generated image to public/ folder but I can't do that easily yet.
// I'll use a text representation for now.

export default function Navbar() {
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

                <div className="relative flex items-center justify-between h-16 px-8">
                    {/* Left Links */}
                    <div className="flex gap-8">
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

                    {/* Center Logo Area - Hanging down */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
                        <div className="w-32 h-28 bg-[#F5E6CA] rounded-b-3xl shadow-xl flex flex-col items-center justify-center pt-2 pb-4">
                            <div className="relative w-16 h-16 rounded-full border-2 border-[#2F4848] overflow-hidden mb-1">
                                {/* Replace '/logo.png' with your actual logo file in the public folder */}
                                <Image
                                    src="/logo.png"
                                    alt="ZEWADI Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[#2F4848] font-bold tracking-widest text-xs font-display">
                                ZEWADI
                            </span>
                        </div>
                    </div>

                    {/* Right Links */}
                    <div className="flex gap-8">
                        {navLinksRight.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 font-medium hover:text-white transition-colors text-sm uppercase tracking-wide font-sans drop-shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
