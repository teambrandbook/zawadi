"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import History from "@/components/guestprofile/history";

export default function GuestProfileHistoryPage() {
  return (
    <div className="min-h-screen bg-[#fffef5]">
      <Navbar />
      <History />
      <Footer />
    </div>
  );
}
