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
import ErrorBoundary from "@/components/shared/ErrorBoundary";

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
  const [firstName = "", ...restName] = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    ...user,
    fullName,
    firstName: firstName || user.firstName,
    lastName: restName.join(" ") || user.lastName,
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
    let isMounted = true;

    async function loadProfile() {
      try {
        const { data: me } = await api.get<CommunityProfileSummary>("/account/me/");
        if (isMounted) {
          setUser((currentUser) => mergeProfileIntoUser(currentUser, me));
        }

        if (isCommunityRole(me.role || "")) {
          const { data: profile } = await api.get<CommunityProfileSummary>("/community/profile/");
          if (isMounted) {
            setUser((currentUser) => mergeProfileIntoUser(currentUser, profile));
          }
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
  }, []);

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
        <div className="relative h-20 w-[96px] flex-shrink-0 lg:w-[190px]">
          <Link
            href="/"
            className="absolute left-1/2 top-0 z-20 flex h-[96px] w-[96px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-b-[20px] bg-[#EBE1CF] p-3 shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#E3D6BE] lg:left-0 lg:h-[111px] lg:w-[124px] lg:translate-x-0 lg:p-4"
            aria-label="Go to Zewadi home"
          >
            <Image
              src="/logo/zewadi-logo.webp"
              alt="ZEWADI Logo"
              width={112}
              height={84}
              priority
              className="h-auto w-[112%] max-w-none object-contain [filter:brightness(0)_saturate(100%)_invert(22%)_sepia(36%)_saturate(868%)_hue-rotate(108deg)_brightness(91%)_contrast(93%)]"
            />
          </Link>
        </div>

        {/* Welcome Greeting (Desktop Only) */}
        <div className="hidden lg:flex flex-col min-w-0 ml-5">
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
        <ErrorBoundary fallback={null}>
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
        </ErrorBoundary>

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
