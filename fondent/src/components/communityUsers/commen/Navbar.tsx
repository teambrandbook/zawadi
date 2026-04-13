import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="relative flex items-center justify-between px-6 h-20 bg-white border-b border-gray-100">

      {/* Left Section */}
      {/* Left Section */}
      <div className="flex items-center">
        {/* Logo Wrapper - INCREASE THIS WIDTH TO ADD DISTANCE */}
        {/* Using w-48 (12rem) on small and w-60 (15rem) on medium screens */}
        <div className="relative w-48 md:w-60 flex-shrink-0">
          <Link
            href="/"
            className="absolute top-[-40px] left-0 w-28 md:w-32 h-32 md:h-36 bg-[#F5E6CA] rounded-b-3xl shadow-lg flex flex-col items-center justify-center pt-8 pb-4 border-x border-b border-black/5 hover:bg-[#ebd8b4] transition-colors group z-20"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#0A4834] overflow-hidden mb-1 bg-white">
              <Image
                src="/logo/zawadi-logo.webp"
                alt="ZEWADI Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[#0A4834] font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase mt-1">
              ZEWADI
            </span>
          </Link>
        </div>

        {/* Welcome Greeting - This will now sit further to the right */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Hi, Zara</h1>
          <p className="text-xs md:text-sm text-gray-500 whitespace-nowrap">Welcome back to your health journey.</p>
        </div>
      </div>

      {/* Right Section: Search, Notification, and Profile */}
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Search Bar - Hidden on small mobile to prevent overlap */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {/* Setting the icon to black as well for consistency */}
            <Search className="w-4 h-4 text-black" strokeWidth={2.5} />
          </span>
          <input
            type="text"
            className="block w-40 lg:w-64 pl-10 pr-3 py-2 border-none bg-gray-100 rounded-full text-sm placeholder:text-black placeholder:opacity-100 focus:ring-2 focus:ring-[#0A4834]/20 outline-none"
            placeholder="Search"
          />
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 md:w-6 h-6" />
        </button>

        {/* Profile Info */}
        <div className="flex items-center pl-4 md:pl-6 border-l border-gray-200">
          <div className="text-right mr-3 hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">Zara Mehak</p>
            <p className="text-xs text-gray-400 mt-1">Premium Member</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-300 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">ZM</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;