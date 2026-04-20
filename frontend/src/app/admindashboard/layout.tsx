"use client";

import { useState, ReactNode } from "react";
import AdminDashboardSidebar from "@/components/admindashboard/shared/AdminDashboardSidebar";
import Navbar from "@/components/communityUsers/commen/Navbar";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow">
        <Navbar onMenuClick={() => setIsOpen(true)} />
      </div>

      {/* ✅ Desktop Sidebar ONLY (lg and above) */}
      <div className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r z-40">
        <AdminDashboardSidebar />
      </div>

      {/* ✅ Mobile + Tablet Sidebar */}
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
          <AdminDashboardSidebar onClose={() => setIsOpen(false)} />
        </div>
      </div>

      {/* ✅ Content */}
      <div className="pt-16 lg:pl-64 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}