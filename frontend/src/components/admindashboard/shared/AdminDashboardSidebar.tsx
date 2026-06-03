"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useInternalStaffPermissions } from "./InternalStaffPermissionsBootstrap";
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
  Gift,
  Bell, 
  BarChart3, 
  Settings, 
  ShieldCheck 
} from "lucide-react";

/* ✅ ADD THIS */
type Props = {
  onClose?: () => void;
};

type NavItem = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  module?: string;
  children?: { name: string; href: string; requiredPermission?: "can_create" }[];
};

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", icon: Home, href: "/admindashboard", module: "dashboard" },
      { name: "Users", icon: Users, href: "/admindashboard/users", module: "users" },
      { name: "Orders", icon: ShoppingBag, href: "/admindashboard/orders", module: "orders" },
      {
        name: "Products",
        icon: Package,
        href: "/admindashboard/products",
        module: "products",
        children: [
          {
            name: "Create category",
            href: "/admindashboard/products/categories",
            requiredPermission: "can_create",
          },
        ],
      },
    ],
  },
  {
    section: "Community",
    items: [
      { name: "Recipes", icon: Utensils, href: "/admindashboard/recipes", module: "recipes" },
      { name: "Blog", icon: MessageSquare, href: "/admindashboard/blog", module: "blogs" },
      { name: "Consultation", icon: Stethoscope, href: "/admindashboard/consultation", module: "consultations" },
      { name: "Nutritionist", icon: UserRound, href: "/admindashboard/nutritionist", module: "nutritionists" },
      { name: "Events", icon: Calendar, href: "/admindashboard/events", module: "events" },
      { name: "Gifts", icon: Gift, href: "/admindashboard/gifts", module: "gifts" },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Notifications", icon: Bell, href: "/admindashboard/notifications", module: "notifications" },
      { name: "Reports", icon: BarChart3, href: "/admindashboard/reports", module: "reports" },
      { name: "Settings", icon: Settings, href: "/admindashboard/settings" },
      { name: "Admin Role", icon: ShieldCheck, href: "/admindashboard/role" },
    ],
  },
];

/* ✅ ACCEPT PROPS HERE */
const AdminDashboardSidebar = ({ onClose }: Props) => {
  const pathname = usePathname();
  const role = useSelector((state: RootState) => state.user.role);
  const internalStaffPermissions = useInternalStaffPermissions();
  const visibleNavigation = navigation
    .map((group) => ({
      ...group,
      items: group.items.flatMap((item) => {
        if (role !== "internal_staff") return [item];
        if (!item.module) return [];

        const permission = internalStaffPermissions.find(
          (candidate) => candidate.module === item.module
        );
        if (!permission || (!permission.can_view && !permission.full_access)) {
          return [];
        }

        return [{
          ...item,
          children: item.children?.filter(
            (child) =>
              !child.requiredPermission ||
              permission.full_access ||
              permission[child.requiredPermission]
          ),
        }];
      }),
    }))
    .filter((group) => group.items.length > 0);

  function isActive(href: string) {
    if (href === "/admindashboard") {
      return pathname === "/admindashboard";
    }
    if (href === "/admindashboard/products") {
      return pathname.startsWith("/admindashboard/products") && !pathname.startsWith("/admindashboard/products/categories");
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="sidebar-scrollbar-hidden w-72 h-full overflow-y-auto bg-white p-5 flex flex-col">
      {visibleNavigation.map((group, idx) => (
        <div key={group.section} className={`${idx === visibleNavigation.length - 1 ? "" : "mb-5"} ${idx === 0 ? "pt-4" : ""}`}>
          
          <h3 className="text-[#06402B] font-bold text-sm mb-3 px-2">
            {group.section}
          </h3>

          <div className="space-y-2.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              const children = item.children ?? [];
              const showChildren = children.length > 0 && pathname.startsWith(item.href);

              return (
                <div key={item.name}>
                <Link 
                  href={item.href} 

                  /* ✅ CLOSE SIDEBAR ON CLICK */
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose?.();
                    }
                  }}

                  className="group flex cursor-pointer items-center space-x-3 outline-none"
                >
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-full transition-all shrink-0
                    ${active 
                      ? 'bg-[#06402B] text-white' 
                      : 'bg-[#EFE7D6] text-[#06402B] group-hover:bg-[#e5dbc4]'}
                  `}>
                    <Icon size={18} />
                  </div>

                  {/* Label */}
                  <div className={`
                    flex-1 py-2 px-5 rounded-full font-medium text-sm transition-all flex items-center justify-center
                    ${active 
                      ? 'bg-[#06402B] text-white' 
                      : 'bg-[#EFE7D6] text-[#06402B] group-hover:bg-[#e5dbc4]'}
                  `}>
                    {item.name}
                  </div>
                </Link>
                {showChildren ? (
                  <div className="ml-[52px] mt-2 space-y-2">
                    {children.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              onClose?.();
                            }
                          }}
                          className={`
                            flex min-h-9 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-medium transition-all
                            ${childActive
                              ? "bg-[#06402B] text-white"
                              : "bg-[#EFE7D6] text-[#06402B] hover:bg-[#e5dbc4]"}
                          `}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default AdminDashboardSidebar;
