"use client";

import { useState, ReactNode } from "react";
import Navbar from "@/components/communityUsers/commen/Navbar";
import UserDashboard from "@/components/communityUsers/commen/UserDashboard";
import AuthGuard from "@/components/shared/AuthGuard";

type Props = {
  children: ReactNode;
};

export default function CommunityLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["community_user"]} allowedUserTypes={["guest", "member"]}>
    <div className="min-h-screen">

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow">
        <Navbar onMenuClick={() => setIsOpen(true)} />
      </div>
      

      {/* ✅ Desktop Sidebar */}
      <div className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r z-40">
        <UserDashboard />
      </div>

      {/* ✅ Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`relative w-64 bg-white h-full shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <UserDashboard onClose={() => setIsOpen(false)} />
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="pt-16 lg:pl-64 bg-white min-h-screen">
        {children}
      </div>
    </div>
    </AuthGuard>
  );
}
