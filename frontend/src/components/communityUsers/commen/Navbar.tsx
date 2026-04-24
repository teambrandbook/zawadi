"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell, Menu, Settings, LogOut } from 'lucide-react';
import api from "@/services/api";

interface NavbarProps {
  onMenuClick: () => void;
  settingsHref?: string;
}

interface UserInfo {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  initials: string;
}
interface MeResponse {
  user_id: string;
  email: string;
  role: string;
  full_name: string;
}

function formatRole(role: string): string {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, settingsHref = "/communityDashBorde/settings" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserInfo>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    initials: "ZM",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadMe() {
      try {
        const { data } = await api.get<MeResponse>("/account/me/");
        if (!isMounted) return;
        const names = data.full_name.trim().split(/\s+/);
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ");
        const initials =
          `${firstName[0] || ""}${lastName[0] || ""}`.trim() ||
          data.email.slice(0, 2).toUpperCase() ||
          "U";

        setUser({
          userId: data.user_id,
          firstName,
          lastName,
          email: data.email,
          role: data.role,
          initials,
        });
      } catch {
        // Keep fallback UI when session is missing/expired.
      }
    }
    void loadMe();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/account/logout/");
    } catch {
      // proceed regardless
    }
    window.location.href = "/communitLogin";
  };

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "User";

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
            <div className="relative w-12 h-12 lg:w-20 lg:h-20 rounded-full border-2 border-[#0A4834] overflow-hidden mb-1 bg-white">
              <Image
                src="/logo/zawadi-logo.webp"
                alt="ZEWADI Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[#0A4834] font-bold tracking-[0.2em] text-[7px] lg:text-[10px] uppercase mt-1">
              ZEWADI
            </span>
          </Link>
        </div>

        {/* Welcome Greeting (Desktop Only) */}
        <div className="hidden lg:flex flex-col min-w-0 ml-4">
          <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">
            Hi, {user.firstName || "there"}
          </h1>
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
        <Link
          href="/communityDashBorde/notifications"
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>

        {/* Profile Info — clickable trigger */}
        <div className="relative flex items-center lg:pl-6 lg:border-l lg:border-gray-200">
          <button
            onClick={() => setIsProfileOpen((v) => !v)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Open profile menu"
          >
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{displayName}</p>
              <p className="text-xs text-gray-400 mt-1">{user.role ? formatRole(user.role) : "Member"}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#06402B] rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-[#06402B]/20">
              <span className="text-xs font-bold text-white">{user.initials}</span>
            </div>
          </button>

          {/* Backdrop */}
          {isProfileOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileOpen(false)}
            />
          )}

          {/* Dropdown Card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

              {/* User Info Header */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-12 h-12 bg-[#06402B] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{user.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  {user.role && (
                    <span className="inline-block mt-1.5 bg-[#EBE3D1] text-[#06402B] text-[10px] uppercase tracking-widest font-semibold rounded-full px-2 py-0.5">
                      {formatRole(user.role)}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 mx-1" />

              {/* Menu Items */}
              <div className="py-1.5">
                <Link
                  href={settingsHref}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
