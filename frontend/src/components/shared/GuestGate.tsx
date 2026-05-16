"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { upgradeToMember } from "@/redux/userSlice";
import { toast } from "sonner";
import { BookOpen, Calendar, ChefHat, Stethoscope, Users } from "lucide-react";

const BENEFITS = [
  { Icon: ChefHat,      text: "Exclusive member recipes & personalised meal plans" },
  { Icon: Stethoscope,  text: "Book one-on-one nutritionist consultations" },
  { Icon: Calendar,     text: "Join wellness events & community challenges" },
  { Icon: BookOpen,     text: "Full community dashboard with progress tracking" },
  { Icon: Users,        text: "Connect with other community members" },
];

export default function GuestGate({ children }: { children: React.ReactNode }) {
  const userType = useSelector((s: RootState) => s.user.userType);
  const dispatch = useDispatch<AppDispatch>();
  const [upgrading, setUpgrading] = useState(false);

  if (userType === "member") return <>{children}</>;

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      await dispatch(upgradeToMember()).unwrap();
      toast.success("Welcome to the Zawadi community!");
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#9f8151]/30 bg-[#fdfaf3] p-8 shadow-sm">

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a4833]/10">
            <Users className="h-7 w-7 text-[#0a4833]" />
          </div>
          <h2 className="text-xl font-bold text-[#0a4833]">Members Only</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Upgrade your free account to unlock the full Zawadi community experience.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {BENEFITS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-[#374151]">
              <Icon className="h-4 w-4 shrink-0 text-[#9f8151]" />
              {text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={upgrading}
          className="mt-8 w-full rounded-lg bg-[#0a4833] py-3 text-sm font-bold text-white transition hover:bg-[#0c5a40] disabled:opacity-60"
        >
          {upgrading ? "Upgrading…" : "Become a Community Member"}
        </button>

        <p className="mt-3 text-center text-xs text-[#9ca3af]">
          Free — no payment required
        </p>
      </div>
    </div>
  );
}
