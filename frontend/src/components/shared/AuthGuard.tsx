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
  user_type?: string;
};

const roleHome: Record<GuardRole, string> = {
  admin: "/admindashboard",
  consultant: "/consultant",
  community_user: "/communityDashBoard",
};

function getRoleHome(role: GuardRole, userType?: "guest" | "member" | null): string {
  if (role === "community_user" && userType === "guest") {
    return "/guestprofile";
  }
  return roleHome[role];
}

function normalizeRole(role?: string | null): GuardRole | null {
  const normalized = String(role ?? "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "consultant") return "consultant";
  if (normalized === "community_user") return "community_user";
  return null;
}

export default function AuthGuard({
  allowedRoles,
  allowedUserTypes,
  children,
}: {
  allowedRoles: GuardRole[];
  allowedUserTypes?: ("guest" | "member")[];
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <BrowserAuthGuard allowedRoles={allowedRoles} allowedUserTypes={allowedUserTypes}>
      {children}
    </BrowserAuthGuard>
  );
}

function BrowserAuthGuard({
  allowedRoles,
  allowedUserTypes,
  children,
}: {
  allowedRoles: GuardRole[];
  allowedUserTypes?: ("guest" | "member")[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  const allowedKey = allowedRoles.join("|");
  const userTypesKey = allowedUserTypes?.join("|") ?? "";
  const allowed = useMemo(() => new Set(allowedKey.split("|") as GuardRole[]), [allowedKey]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const { data } = await api.get<MeResponse>("/account/me/");
        if (cancelled) return;

        const role = normalizeRole(data.role);
        const userType = (data.user_type as "guest" | "member") ?? null;

        // Guard: invalid role → clear and redirect before dispatching anything
        if (!role) {
          dispatch(clearCredentials());
          router.replace("/login");
          return;
        }

        // Role is valid — now dispatch credentials
        dispatch(
          setCredentials({
            userId: data.user_id,
            role: role,
            email: data.email,
            fullName: data.full_name,
            userType,
          })
        );

        if (!allowed.has(role)) {
          router.replace(getRoleHome(role, userType));
          return;
        }

        // Role is allowed — now check userType restriction if provided
        if (allowedUserTypes && allowedUserTypes.length > 0) {
          if (!userType || !allowedUserTypes.includes(userType)) {
            router.replace(getRoleHome(role, userType));
            return;
          }
        }

        setStatus("allowed");
      } catch {
        if (cancelled) return;
        dispatch(clearCredentials());
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, allowedKey, userTypesKey, dispatch, pathname, router]);

  if (status !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#0A4833]">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
