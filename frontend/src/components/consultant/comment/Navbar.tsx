import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Search, Bell, Menu } from 'lucide-react';
import api from '@/services/api';

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

function getApiOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return apiBase.replace(/\/api\/?$/, "");
}

function normalizePhotoUrl(photo?: string | null) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return `${getApiOrigin()}${photo}`;
  return photo;
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
  const initials = useMemo(() => getInitials(displayName), [displayName]);

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
                src="/logo/zewadi-logo.webp"
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
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
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
        <div className="flex items-center lg:pl-6 lg:border-l lg:border-gray-200">
          <div className="text-right mr-3 hidden max-w-[170px] lg:block">
            <p className="truncate text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{displayName}</p>
            <p className="mt-1 truncate text-xs text-gray-400">{location || "Consultant"}</p>
          </div>
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            {photoSrc ? (
              <img src={photoSrc} alt={`${displayName} profile`} className="h-full w-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{initials}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
