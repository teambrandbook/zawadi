"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  UtensilsCrossed,
  FileText,
  MessageSquare,
  Bell,
  User,
  Settings,
} from "lucide-react";

type Props = {
  onClose?: () => void;
};

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/consultant" },
  { name: "My Consultation", icon: Calendar, href: "/consultant/consultation" },
  { name: "Appointments", icon: Calendar, href: "/consultant/appointments" },
  { name: "Clients", icon: Users, href: "/consultant/clients" },
  { name: "Diet Plans", icon: UtensilsCrossed, href: "/consultant/diet-plans" },
  { name: "Notes", icon: FileText, href: "/consultant/notes" },
  { name: "Messages", icon: MessageSquare, href: "/consultant/messages" },
  { name: "Notification", icon: Bell, href: "/consultant/notification" },
  { name: "Profile", icon: User, href: "/consultant/profile" },
  { name: "Settings", icon: Settings, href: "/consultant/settings" },
];

function ConsultantSidebar({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full md:pt-25 bg-white p-6 flex flex-col space-y-4 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.href === "/consultant"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onClose?.();
              }
            }}
            className="group flex items-center space-x-3"
          >
            {/* Icon */}
            <div
              className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full transition-all ${
                isActive
                  ? "bg-[#06402B] text-white"
                  : "bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]"
              }`}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div
              className={`flex-1 whitespace-nowrap py-3 px-4 rounded-full font-semibold text-sm transition-all ${
                isActive
                  ? "bg-[#06402B] text-white"
                  : "bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]"
              }`}
            >
              {item.name}
            </div>
          </Link>
        );
      })}
    </aside>
  );
}

export default ConsultantSidebar;
