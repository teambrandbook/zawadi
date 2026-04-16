"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  ShoppingBag, 
  Package, 
  Utensils, 
  MessageSquare, 
  Stethoscope, 
  UserRound, 
  Calendar, 
  Bell, 
  BarChart3, 
  Settings, 
  ShieldCheck 
} from "lucide-react";

const navigation = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", icon: Home, href: "/admindashboard" },
      { name: "Users", icon: Users, href: "/admindashboard/users" },
      { name: "Orders", icon: ShoppingBag, href: "/admindashboard/orders" },
      { name: "Products", icon: Package, href: "/admindashboard/products" },
    ],
  },
  {
    section: "Community",
    items: [
      { name: "Recipes", icon: Utensils, href: "/admindashboard/recipes" },
      { name: "Blog", icon: MessageSquare, href: "/admindashboard/blog" },
      { name: "Consultation", icon: Stethoscope, href: "/admindashboard/consultation" },
      { name: "Nutritionist", icon: UserRound, href: "/admindashboard/nutritionist" },
      { name: "Events", icon: Calendar, href: "/admindashboard/events" },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Notifications", icon: Bell, href: "/admindashboard/notifications" },
      { name: "Reports", icon: BarChart3, href: "/admindashboard/reports" },
      { name: "Settings", icon: Settings, href: "/admindashboard/settings" },
      { name: "Admin Role", icon: ShieldCheck, href: "/admindashboard/role" },
    ],
  },
];

const AdminDashboardSidebar = () => {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admindashboard") {
      return pathname === "/admindashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-72 h-screen bg-white p-6 flex flex-col overflow-y-auto custom-scrollbar">
      {navigation.map((group, idx) => (
        <div key={idx} className="mb-8">
          {/* Section Header */}
          <h3 className="text-[#06402B] font-bold text-lg mb-6 px-2 pt-12">
            {group.section}
          </h3>

          <div className="space-y-4">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="group flex items-center space-x-3 outline-none"
                >
                  {/* Icon Circle */}
                  <div className={`
                    flex items-center justify-center w-11 h-11 rounded-full transition-all shrink-0
                    ${active 
                      ? 'bg-[#06402B] text-white' 
                      : 'bg-[#EFE7D6] text-[#06402B] group-hover:bg-[#e5dbc4]'}
                  `}>
                    <Icon size={20} />
                  </div>

                  {/* Label Pill */}
                  <div className={`
                    flex-1 py-2.5 px-6 rounded-full font-medium text-sm transition-all flex items-center justify-center
                    ${active 
                      ? 'bg-[#06402B] text-white' 
                      : 'bg-[#EFE7D6] text-[#06402B] group-hover:bg-[#e5dbc4]'}
                  `}>
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default AdminDashboardSidebar;
