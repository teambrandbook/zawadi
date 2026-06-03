import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell, Menu, Settings, LogOut } from 'lucide-react';
import api from '@/services/api';
import { getImageUrl } from '@/lib/utils';
import { subscribeLiveNotifications } from "@/lib/liveNotifications";

interface NavbarProps {
  onMenuClick: () => void;
}

type ConsultantProfile = {
  full_name?: string | null;
  user_name?: string | null;
  email?: string | null;
  location?: string | null;
  photo?: string | null;
  role?: string | null;
};

type ConsultantBooking = {
  id: number;
  status?: string;
};

const CONSULTANT_PROFILE_UPDATED_EVENT = "consultant-profile-updated";

function normalizePhotoUrl(photo?: string | null) {
  if (!photo) return "";
  return getImageUrl(photo);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ConsultantProfile>("/consultant/profile/")
      .then((response) => {
        if (isMounted) setProfile(response.data);
      })
      .catch(() => {
        if (isMounted) setProfile(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => subscribeLiveNotifications(() => {
    setUnreadCount((current) => current + 1);
  }), []);

  useEffect(() => {
    function handleProfileUpdated(event: Event) {
      const updatedProfile = (event as CustomEvent<ConsultantProfile>).detail;
      if (updatedProfile) {
        setProfile((current) => ({ ...current, ...updatedProfile }));
      }
    }

    window.addEventListener(CONSULTANT_PROFILE_UPDATED_EVENT, handleProfileUpdated);
    return () => {
      window.removeEventListener(CONSULTANT_PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = () => {
      Promise.allSettled([
        api.get<{ count: number }>("/notifications/inbox/unread-count/"),
        api.get<ConsultantBooking[]>("/consultant/bookings/"),
      ])
        .then(([notificationsResponse, bookingsResponse]) => {
          if (!isMounted) return;

          const notificationCount =
            notificationsResponse.status === "fulfilled"
              ? Number(notificationsResponse.value.data.count ?? 0)
              : 0;
          const pendingBookingCount =
            bookingsResponse.status === "fulfilled" && Array.isArray(bookingsResponse.value.data)
              ? bookingsResponse.value.data.filter((booking) => String(booking.status ?? "").toLowerCase() === "pending").length
              : 0;

          setUnreadCount(notificationCount + pendingBookingCount);
        })
        .catch(() => {
          if (isMounted) setUnreadCount(0);
        });
    };

    loadUnreadCount();
    const intervalId = window.setInterval(loadUnreadCount, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const displayName = profile?.full_name || profile?.user_name || "Consultant";
  const location = profile?.location?.trim();
  const photoSrc = normalizePhotoUrl(profile?.photo);
  const [hasPhotoError, setHasPhotoError] = useState(false);
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const handleLogout = async () => {
    try {
      await api.post("/account/logout/");
    } catch {
      // Proceed to login even if the server session has already expired.
    }
    window.location.href = "/login";
  };

  useEffect(() => {
    setHasPhotoError(false);
  }, [photoSrc]);

  return (
    <nav className="relative flex items-center justify-between px-4 lg:px-6 h-20 bg-white border-b border-gray-100">
      
      {/* Menu Icon (Mobile + Tablet) */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={onMenuClick}
          className="cursor-pointer p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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
            className="absolute left-1/2 top-0 z-20 flex h-[96px] w-[96px] -translate-x-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-b-[20px] bg-[#EBE1CF] p-3 shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#E3D6BE] lg:left-0 lg:h-[111px] lg:w-[124px] lg:translate-x-0 lg:p-4"
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
          <h1 className="text-xl font-bold text-[#0A4833] leading-tight truncate">Hai, {displayName}!</h1>
          <p className="text-sm text-gray-500 whitespace-nowrap">Manage appointments, support clients, and guide healthier wellness journeys.</p>
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
          href="/consultant/notification"
          className="relative cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B42318] px-1.5 text-[10px] font-bold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Link>

        {/* Profile Info */}
        <div className="relative flex items-center lg:pl-6 lg:border-l lg:border-gray-200">
          <button
            type="button"
            onClick={() => setIsProfileOpen((current) => !current)}
            className="flex cursor-pointer items-center transition-opacity hover:opacity-80 focus:outline-none"
            aria-label="Open consultant profile menu"
          >
            <div className="text-right mr-3 hidden max-w-[170px] lg:block">
              <p className="truncate text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{displayName}</p>
              <p className="mt-1 truncate text-xs text-gray-400">{location || "Consultant"}</p>
            </div>
            <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
              {photoSrc && !hasPhotoError ? (
                <Image
                  src={photoSrc}
                  alt={`${displayName} profile`}
                  fill
                  unoptimized
                  className="h-full w-full object-cover"
                  onError={() => setHasPhotoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">{initials}</span>
                </div>
              )}
            </div>
          </button>

          {isProfileOpen && (
            <div
              className="fixed inset-0 z-40 cursor-pointer"
              onClick={() => setIsProfileOpen(false)}
            />
          )}

          {isProfileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                  {photoSrc && !hasPhotoError ? (
                    <Image
                      src={photoSrc}
                      alt={`${displayName} profile`}
                      fill
                      unoptimized
                      className="h-full w-full object-cover"
                      onError={() => setHasPhotoError(true)}
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-600">{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">{displayName}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{profile?.email || location || "Consultant"}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-[#EBE3D1] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#06402B]">
                    Consultant
                  </span>
                </div>
              </div>

              <div className="mx-1 border-t border-gray-100" />

              <div className="py-1.5">
                <Link
                  href="/consultant/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mx-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
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
