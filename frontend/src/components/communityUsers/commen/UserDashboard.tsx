"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  UserRound, 
  Calendar, 
  Gift,
  MessageSquareDiff, 
  Settings 
} from 'lucide-react';

/* ✅ ADD THIS */
type Props = {
  onClose?: () => void;
};

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/communityDashBorde' },
  { name: 'My Recipes', icon: UtensilsCrossed, href: '/communityDashBorde/myrecipy' },
  { name: 'My Orders', icon: ShoppingBag, href: '/communityDashBorde/myorders' },
  { name: 'Consultation', icon: UserRound, href: '/communityDashBorde/consultation' },
  { name: 'My Events', icon: Calendar, href: '/communityDashBorde/events' },
  { name: 'Custom Gifts', icon: Gift, href: '/communityDashBorde/custom-gifts' },
  { name: 'Add Blog', icon: MessageSquareDiff, href: '/communityDashBorde/add-blog' },
  { name: 'Settings', icon: Settings, href: '/communityDashBorde/settings' },
];

/* ✅ ACCEPT PROPS */
const UserDashboard = ({ onClose }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white p-6 md:pt-30 flex flex-col space-y-4 overflow-y-auto">

      {/* 🔥 remove pt-20 (handled by layout now) */}

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/communityDashBorde'
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}

            /* ✅ CLOSE SIDEBAR ON MOBILE */
            onClick={() => {
              if (window.innerWidth < 1024) {
                onClose?.();
              }
            }}

            className="group flex items-center space-x-3"
          >
            {/* Icon */}
            <div
              className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all
                ${
                  isActive
                    ? 'bg-[#06402B] text-white'
                    : 'bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]'
                }
              `}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div
              className={`
                flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all
                ${
                  isActive
                    ? 'bg-[#06402B] text-white'
                    : 'bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]'
                }
              `}
            >
              {item.name}
            </div>
          </Link>
        );
      })}
    </aside>
  );
};

export default UserDashboard;