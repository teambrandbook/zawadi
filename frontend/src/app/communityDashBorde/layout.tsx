"use client";

import Navbar from "@/components/communityUsers/commen/Navbar";
import UserDashboard from "@/components/communityUsers/commen/UserDashboard";
import { ReactNode } from "react";


type Props = {
  children: ReactNode;
};

export default function CommunityLayout({ children }:Props) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar (Top) */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <UserDashboard />
        </div>

        {/* Page Content */}
        <div className="flex-1  bg-gray-50">
          {children}
        </div>

      </div>
    </div>
  );
}
