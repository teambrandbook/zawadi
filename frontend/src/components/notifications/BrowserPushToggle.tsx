"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  disablePushNotifications,
  enablePushNotifications,
  isPushEnabledInThisBrowser,
  subscribePushRegistration,
} from "@/lib/firebaseMessaging";

export default function BrowserPushToggle() {
  const [enabled, setEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setEnabled(isPushEnabledInThisBrowser());
    return subscribePushRegistration(setEnabled);
  }, []);

  async function handleToggle() {
    setUpdating(true);
    try {
      if (enabled) {
        await disablePushNotifications();
        toast.success("Browser notifications disabled on this device.");
      } else {
        await enablePushNotifications();
        toast.success("Browser notifications enabled.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update browser notifications.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-[#EBE1CF4D] px-3 py-2.5">
      <div>
        <p className="text-sm font-semibold text-[#0A4833]">Browser Push Notifications</p>
        <p className="text-[11px] text-[#4B5563]">Receive alerts on this browser when Zewadi is not open</p>
      </div>
      <button
        type="button"
        disabled={updating}
        onClick={handleToggle}
        aria-pressed={enabled}
        className={`relative h-6 w-11 rounded-full transition disabled:opacity-60 ${enabled ? "bg-[#0A4833]" : "bg-[#D1D5DB]"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${enabled ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}
