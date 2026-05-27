import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell, Menu } from 'lucide-react';
import api from '@/services/api';
import { getImageUrl } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
}

type ConsultantProfile = {
  full_name?: string | null;
  user_name?: string | null;
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
        <Link
          href="/consultant/profile"
          className="flex cursor-pointer items-center lg:pl-6 lg:border-l lg:border-gray-200"
          aria-label="Open consultant profile"
        >
          <div className="text-right mr-3 hidden max-w-[170px] lg:block">
            <p className="truncate text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{displayName}</p>
            <p className="mt-1 truncate text-xs text-gray-400">{location || "Consultant"}</p>
          </div>
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            {photoSrc && !hasPhotoError ? (
              <img
                src={photoSrc}
                alt={`${displayName} profile`}
                className="h-full w-full object-cover"
                onError={() => setHasPhotoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{initials}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
