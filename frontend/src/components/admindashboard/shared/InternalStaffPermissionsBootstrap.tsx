"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import api from "@/services/api";

type Props = {
  children: ReactNode;
};

export type InternalStaffPermission = {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  can_export: boolean;
  full_access: boolean;
};

type InternalStaffPermissionsResponse = {
  permissions: InternalStaffPermission[];
};

const InternalStaffPermissionsContext = createContext<InternalStaffPermission[]>([]);

export function useInternalStaffPermissions() {
  return useContext(InternalStaffPermissionsContext);
}

type PermissionAction = "can_view" | "can_create" | "can_edit";

const internalStaffRouteRules: {
  path: string;
  module?: string;
  action?: PermissionAction;
}[] = [
  { path: "/admindashboard/users/create", module: "users", action: "can_create" },
  { path: "/admindashboard/users/", module: "users", action: "can_edit" },
  { path: "/admindashboard/products/categories", module: "products", action: "can_create" },
  { path: "/admindashboard/products/add", module: "products", action: "can_create" },
  { path: "/admindashboard/recipes/add", module: "recipes", action: "can_create" },
  { path: "/admindashboard/blog/add", module: "blogs", action: "can_create" },
  { path: "/admindashboard/events/create", module: "events", action: "can_create" },
  { path: "/admindashboard/notifications/create", module: "notifications", action: "can_create" },
  { path: "/admindashboard/nutritionist/addnutritonist", module: "nutritionists", action: "can_create" },
  { path: "/admindashboard/consultation/assign-nutritionist", module: "consultations", action: "can_edit" },
  { path: "/admindashboard/users", module: "users" },
  { path: "/admindashboard/orders", module: "orders" },
  { path: "/admindashboard/products", module: "products" },
  { path: "/admindashboard/recipes", module: "recipes" },
  { path: "/admindashboard/blog", module: "blogs" },
  { path: "/admindashboard/consultation", module: "consultations" },
  { path: "/admindashboard/nutritionist", module: "nutritionists" },
  { path: "/admindashboard/events", module: "events" },
  { path: "/admindashboard/gifts", module: "gifts" },
  { path: "/admindashboard/notifications", module: "notifications" },
  { path: "/admindashboard/reports", module: "reports" },
  { path: "/admindashboard", module: "dashboard" },
];

export function InternalStaffRouteGuard({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);
  const permissions = useInternalStaffPermissions();

  if (role !== "internal_staff") {
    return <>{children}</>;
  }

  if (pathname.startsWith("/admindashboard/profile")) {
    return <>{children}</>;
  }

  const rule = internalStaffRouteRules.find(
    ({ path }) =>
      pathname === path ||
      (path !== "/admindashboard" && pathname.startsWith(`${path}/`))
  );
  const permission = permissions.find(({ module }) => module === rule?.module);
  const action =
    pathname === "/admindashboard/users/create" && searchParams.has("userId")
      ? "can_edit"
      : pathname === "/admindashboard/products/add" && searchParams.has("id")
      ? "can_edit"
      : pathname === "/admindashboard/recipes/add" && searchParams.has("id")
      ? "can_edit"
      : pathname === "/admindashboard/blog/add" && searchParams.has("blogId")
      ? "can_edit"
      : pathname === "/admindashboard/nutritionist/addnutritonist" && searchParams.has("id")
      ? "can_edit"
      : pathname === "/admindashboard/events/create" && searchParams.has("eventId")
      ? "can_edit"
      : rule?.action ?? "can_view";
  const canAccess = Boolean(rule && permission && (permission.full_access || permission[action]));

  if (!canAccess) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-6 text-center text-sm text-[#B91C1C]">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function InternalStaffPermissionsBootstrap({ children }: Props) {
  const role = useSelector((state: RootState) => state.user.role);
  const userId = useSelector((state: RootState) => state.user.userId);
  const [staffPermissions, setStaffPermissions] = useState<{
    userId: string | null;
    permissions: InternalStaffPermission[];
  } | null>(null);

  useEffect(() => {
    if (role !== "internal_staff") {
      return;
    }

    let cancelled = false;

    async function fetchPermissions() {
      try {
        const { data } = await api.get<InternalStaffPermissionsResponse>(
          "/superadmin/internal-staff/permissions/"
        );
        if (!cancelled) {
          setStaffPermissions({ userId, permissions: data.permissions });
        }
      } catch (error) {
        console.error("Failed to load internal staff permissions:", error);
        if (!cancelled) {
          setStaffPermissions({ userId, permissions: [] });
        }
      }
    }

    fetchPermissions();

    return () => {
      cancelled = true;
    };
  }, [role, userId]);

  if (role === "internal_staff" && staffPermissions?.userId !== userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#0A4833]">
        Loading permissions...
      </div>
    );
  }

  return (
    <InternalStaffPermissionsContext.Provider
      value={role === "internal_staff" ? staffPermissions?.permissions ?? [] : []}
    >
      {children}
    </InternalStaffPermissionsContext.Provider>
  );
}
