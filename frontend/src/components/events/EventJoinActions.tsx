"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import api, { getAccessToken } from "@/services/api";
import { setCredentials } from "@/redux/userSlice";
import type { RootState } from "@/redux/store";

const COMMUNITY_EVENTS_URL = "https://app.zewadi.com/communityDashBoard/events";

type AccountProfile = {
  user_type?: "guest" | "member" | string | null;
  role?: string | null;
};

export default function EventJoinActions() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userType = useSelector((state: RootState) => state.user.userType);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [showMemberPrompt, setShowMemberPrompt] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  function goToLogin() {
    router.push(`/login?next=${encodeURIComponent(pathname || "/events")}`);
  }

  function goToCommunityEvents() {
    window.location.assign(COMMUNITY_EVENTS_URL);
  }

  async function getCurrentUserType() {
    if (!getAccessToken() && !isAuthenticated) return null;
    if (userType) return userType;

    const response = await api.get<AccountProfile>("/account/me/");
    const nextUserType = response.data.user_type === "guest" || response.data.user_type === "member"
      ? response.data.user_type
      : null;

    dispatch(
      setCredentials({
        role: response.data.role ?? undefined,
        userType: nextUserType,
      })
    );

    return nextUserType;
  }

  async function handleJoin() {
    if (!getAccessToken() && !isAuthenticated) {
      goToLogin();
      return;
    }

    setIsChecking(true);
    try {
      const nextUserType = await getCurrentUserType();

      if (nextUserType === "member") {
        goToCommunityEvents();
        return;
      }

      setShowMemberPrompt(true);
    } catch {
      goToLogin();
    } finally {
      setIsChecking(false);
    }
  }

  async function handleBecomeMember() {
    if (!getAccessToken() && !isAuthenticated) {
      goToLogin();
      return;
    }

    setIsUpgrading(true);
    try {
      await api.patch("/account/upgrade/");
      dispatch(setCredentials({ userType: "member" }));
      toast.success("Welcome to the community!");
      goToCommunityEvents();
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleJoin}
        disabled={isChecking}
        className="h-12 w-full rounded-full bg-[#1f4d3a] px-8 font-['Inter'] text-[14px] font-medium uppercase text-white transition hover:bg-[#183c2d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[185px] lg:h-[58px]"
      >
        {isChecking ? "Checking..." : "Join Now"}
      </button>

      {showMemberPrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowMemberPrompt(false);
          }}
        >
          <section className="w-full max-w-[560px] rounded-[14px] border border-[#d8c29a]/70 bg-white px-6 py-6 shadow-2xl sm:px-8">
            <h2 className="font-['Inter'] text-[20px] font-bold leading-8 text-[#1f4d3a]">
              Become a community member
            </h2>
            <p className="mt-2 font-['Inter'] text-[15px] font-medium leading-7 text-[#33443d]">
              To join this event, you need to be part of the Zewadi community. Become a member to access community events and continue your wellness journey with us.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleBecomeMember}
                disabled={isUpgrading}
                className="h-[50px] rounded-[8px] bg-[#A88751] px-7 font-['Inter'] text-[16px] font-bold text-white transition hover:bg-[#8F7348] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[177px]"
              >
                {isUpgrading ? "Converting..." : "Become a Member"}
              </button>
              <button
                type="button"
                onClick={() => setShowMemberPrompt(false)}
                className="h-[50px] rounded-[8px] border border-[#d8c29a] px-7 font-['Inter'] text-[16px] font-semibold text-[#1f4d3a] transition hover:bg-[#f7f3ea]"
              >
                Join Later
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
