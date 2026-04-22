import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <nav className="relative flex items-center justify-between px-4 lg:px-6 h-20 bg-white border-b border-gray-100">
      
      {/* Menu Icon (Mobile + Tablet) */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex items-center">
        <div className="relative w-24 lg:w-60 flex-shrink-0">
          <Link
            href="/"
            className="absolute top-[-40px] left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-24 lg:w-32 h-28 lg:h-36 bg-[#F5E6CA] rounded-b-3xl shadow-lg flex flex-col items-center justify-center pt-8 pb-4 border-x border-b border-black/5 hover:bg-[#ebd8b4] transition-colors group z-20"
          >
            <div className="relative w-16 h-16 lg:w-24 lg:h-24 overflow-hidden mb-1">
              <Image
                src="/logo/zewadi-new-logo.png"
                alt="ZEWADI Logo"
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
          </Link>
        </div>

        {/* Welcome Greeting (Desktop Only) */}
        <div className="hidden lg:flex flex-col min-w-0 ml-4">
          <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">Hi, Zara</h1>
          <p className="text-sm text-gray-500 whitespace-nowrap">Welcome back to your health journey.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 lg:space-x-4">
        
        {/* Search Bar (Desktop Only) */}
        <div className="relative hidden lg:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Profile Info */}
        <div className="flex items-center lg:pl-6 lg:border-l lg:border-gray-200">
          <div className="text-right mr-3 hidden lg:block">
            <p className="text-sm font-bold text-gray-900 leading-none whitespace-nowrap">Zara Mehak</p>
            <p className="text-xs text-gray-400 mt-1">Premium</p>
          </div>
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
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