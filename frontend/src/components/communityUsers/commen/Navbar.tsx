"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, Settings, LogOut, ShoppingCart } from 'lucide-react';
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCartCount } from "@/redux/userSlice";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

interface NavbarProps {
  onMenuClick: () => void;
  settingsHref?: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  userType: string;
  initials: string;
  photo: string | null;
}

type CommunityProfileSummary = {
  full_name?: string;
  user_name?: string;
  email?: string;
  role?: string;
  user_type?: string;
  photo?: string | null;
};

const fallbackUserInfo: UserInfo = {
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  userType: "member",
  initials: "U",
  photo: null,
};

function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function formatRole(role: string): string {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isCommunityRole(role: string): boolean {
  return role.toLowerCase() === "community_user";
}

function getInitials(name: string, email: string): string {
  const nameInitials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return nameInitials || email.slice(0, 2).toUpperCase() || "U";
}


function mergeProfileIntoUser(user: UserInfo, profile: CommunityProfileSummary): UserInfo {
  const hasProfileName = "full_name" in profile || "user_name" in profile;
  const profileName = profile.full_name?.trim() || profile.user_name?.trim();
  const fullName = hasProfileName ? profileName || "" : user.fullName;
  const email = profile.email || user.email;
  const role = profile.role || user.role;
  const userType = profile.user_type || user.userType;

  return {
    ...user,
    fullName,
    email,
    role,
    userType,
    initials: getInitials(fullName, email),
    photo: profile.photo ? getImageUrl(profile.photo) : user.photo,
  };
}

function getUserFromTokenCookie(): UserInfo {
  if (typeof document === "undefined") {
    return fallbackUserInfo;
  }

  const match = document.cookie.split("; ").find((c) => c.startsWith("access_token="));
  if (!match) {
    return fallbackUserInfo;
  }

  const token = decodeURIComponent(match.split("=")[1]);
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return fallbackUserInfo;
  }

  const firstName: string = payload.first_name || "";
  const lastName: string = payload.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const email: string = payload.email || "";
  const role: string = payload.role || "";
  const initials = getInitials(fullName, email);
  const userType = isCommunityRole(role) ? "member" : "";

  return { fullName, firstName, lastName, email, role, userType, initials, photo: null };
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, settingsHref = "/communityDashBoard/settings" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<UserInfo>(getUserFromTokenCookie);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const cartCount = useSelector((s: RootState) => s.user.cartCount);
  const isCommunityUser = isCommunityRole(user.role);
  // ref kept for future use (e.g. click-outside on bell area)
  const _bellRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!isCommunityUser) return;
    try {
      const { data } = await api.get<{ count: number }>("/notifications/inbox/unread-count/");
      setUnreadCount(data.count ?? 0);
    } catch {
      // silently ignore
    }
  }, [isCommunityUser]);

  useEffect(() => {
    void fetchUnreadCount();
    const interval = setInterval(() => { void fetchUnreadCount(); }, 60_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!isCommunityUser) return;

    let isMounted = true;

    async function loadProfile() {
      try {
        const { data } = await api.get<CommunityProfileSummary>("/community/profile/");
        if (isMounted) {
          setUser((currentUser) => mergeProfileIntoUser(currentUser, data));
        }
      } catch {
        // keep token fallback details
      }
    }

    function handleProfileUpdated(event: Event) {
      const profile = (event as CustomEvent<CommunityProfileSummary>).detail;
      if (profile) {
        setUser((currentUser) => mergeProfileIntoUser(currentUser, profile));
      }
    }

    void loadProfile();
    window.addEventListener("community-profile-updated", handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("community-profile-updated", handleProfileUpdated);
    };
  }, [isCommunityUser]);

  useEffect(() => {
    if (!isCommunityUser) {
      return;
    }
    dispatch(fetchCartCount());
  }, [pathname, isCommunityUser, dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("/account/logout/");
    } catch {
      // proceed regardless
    }
    window.location.href = "/login";
  };

  const displayName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "User";
  const displayRole = user.userType ? formatRole(user.userType) : user.role ? formatRole(user.role) : "Member";

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

        {/* Notification bell */}
        <div className="relative" ref={_bellRef}>
          <button
            onClick={() => {
              setShowNotifications((v) => !v);
              if (!showNotifications) setUnreadCount(0);
            }}
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B48745] px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <Link
          href="/communityDashBoard/cart"
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
          {cartCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0A4833] px-1 text-[10px] font-bold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
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
              <p className="text-xs text-gray-400 mt-1">{displayRole}</p>
            </div>
            <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-[#06402B] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-[#06402B]/20">
              {user.photo ? (
                <Image src={user.photo} alt={displayName} fill unoptimized className="object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">{user.initials}</span>
              )}
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
                <div className="relative w-12 h-12 bg-[#06402B] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.photo ? (
                    <Image src={user.photo} alt={displayName} fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-white">{user.initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  <span className="inline-block mt-1.5 bg-[#EBE3D1] text-[#06402B] text-[10px] uppercase tracking-widest font-semibold rounded-full px-2 py-0.5">
                    {displayRole}
                  </span>
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
