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
  Bell,
  User,
  Settings,
  Stethoscope,
} from "lucide-react";

type Props = {
  onClose?: () => void;
};

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/consultant" },
  { name: "My Consultation", icon: Stethoscope, href: "/consultant/consultation" },
  { name: "Appointments", icon: Calendar, href: "/consultant/appointments" },
  { name: "Clients", icon: Users, href: "/consultant/clients" },
  { name: "Diet Plans", icon: UtensilsCrossed, href: "/consultant/diet-plans" },
  { name: "Notes", icon: FileText, href: "/consultant/notes" },
  { name: "Notification", icon: Bell, href: "/consultant/notification" },
  { name: "Profile", icon: User, href: "/consultant/profile" },
  { name: "Settings", icon: Settings, href: "/consultant/settings" },
];

function ConsultantSidebar({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside className="sidebar-scrollbar-hidden w-72 h-full overflow-y-auto bg-white p-5 md:pt-20 flex flex-col space-y-3 shrink-0">
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
            className="group flex cursor-pointer items-center space-x-3"
          >
            {/* Icon */}
            <div
              className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-full transition-all ${
                isActive
                  ? "bg-[#06402B] text-white"
                  : "bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]"
              }`}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div
              className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
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
