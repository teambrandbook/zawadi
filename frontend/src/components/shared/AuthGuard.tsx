"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { clearCredentials, setCredentials } from "@/redux/userSlice";
import api from "@/services/api";

type GuardRole = "admin" | "consultant" | "community_user";

type MeResponse = {
  user_id?: string;
  email?: string;
  role?: string;
  full_name?: string;
};

const roleHome: Record<GuardRole, string> = {
  admin: "/admindashboard",
  consultant: "/consultant",
  community_user: "/communityDashBorde",
};

function normalizeRole(role?: string | null): GuardRole | null {
  const normalized = String(role ?? "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "consultant") return "consultant";
  if (normalized === "community_user") return "community_user";
  return null;
}

export default function AuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: GuardRole[];
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <BrowserAuthGuard allowedRoles={allowedRoles}>{children}</BrowserAuthGuard>;
}

function BrowserAuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: GuardRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  const allowedKey = allowedRoles.join("|");
  const allowed = useMemo(() => new Set(allowedKey.split("|") as GuardRole[]), [allowedKey]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const { data } = await api.get<MeResponse>("/account/me/");
        if (cancelled) return;

        const role = normalizeRole(data.role);
        dispatch(
          setCredentials({
            userId: data.user_id,
            role: role ?? data.role,
            email: data.email,
            fullName: data.full_name,
          })
        );

        if (!role) {
          dispatch(clearCredentials());
          router.replace("/communitLogin");
          return;
        }

        if (!allowed.has(role)) {
          router.replace(roleHome[role]);
          return;
        }

        setStatus("allowed");
      } catch {
        if (cancelled) return;
        dispatch(clearCredentials());
        router.replace(`/communitLogin?next=${encodeURIComponent(pathname)}`);
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [allowed, allowedKey, dispatch, pathname, router]);

  if (status !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#0A4833]">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
