"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import GuestProfile from "@/components/guestprofile/guestprofile";

export default function GuestProfilePage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <GuestProfile />
      <Footer />
    </div>
  );
}
