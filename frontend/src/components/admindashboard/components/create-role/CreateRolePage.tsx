"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BasicRoleInformationCard from "./components/BasicRoleInformationCard";
import CreateRoleHeader from "./components/CreateRoleHeader";
import PermissionsMatrixCard from "./components/PermissionsMatrixCard";
import { toast } from "sonner";
import api, { getAccessToken } from "@/services/api";

type ApiError = {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, unknown>;
    };
  };
};

const permissionFields = [
  "can_view",
  "can_create",
  "can_edit",
  "can_delete",
  "can_approve",
  "can_export",
] as const;

type PermissionField = (typeof permissionFields)[number];

type Permission = Record<PermissionField, boolean> & {
  module: string;
  full_access: boolean;
};

type ApiPermission = Record<PermissionField, boolean> & {
  module: string;
  full_access: boolean;
};

type ApiRole = {
  role_name?: string;
  role_status?: string;
  access_level?: string;
  permissions?: ApiPermission[];
};

const moduleNames = [
  "Dashboard",
  "Users",
  "Orders",
  "Products",
  "Recipes",
  "Blogs",
  "Consultations",
  "Nutritionists",
  "Notifications",
  "Reports",
  "Events",
];

const createDefaultPermission = (module: string): Permission => ({
  module,
  can_view: false,
  can_create: false,
  can_edit: false,
  can_delete: false,
  can_approve: false,
  can_export: false,
  full_access: false,
});

const defaultPermissions = moduleNames.map(createDefaultPermission);

function normalizeModuleName(module: string) {
  return module.toLowerCase();
}

function formatModuleName(module: string) {
  return module
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPermissions(apiPermissions: ApiPermission[] = []) {
  const permissionsByModule = new Map(
    apiPermissions.map((permission) => [normalizeModuleName(permission.module), permission])
  );

  return defaultPermissions.map((defaultPermission) => {
    const apiPermission = permissionsByModule.get(normalizeModuleName(defaultPermission.module));
    if (!apiPermission) return defaultPermission;

    return {
      module: formatModuleName(apiPermission.module),
      can_view: Boolean(apiPermission.can_view),
      can_create: Boolean(apiPermission.can_create),
      can_edit: Boolean(apiPermission.can_edit),
      can_delete: Boolean(apiPermission.can_delete),
      can_approve: Boolean(apiPermission.can_approve),
      can_export: Boolean(apiPermission.can_export),
      full_access: Boolean(apiPermission.full_access),
    };
  });
}

function formatApiErrors(errors: Record<string, unknown>): string {
  return Object.entries(errors)
    .map(([field, detail]) => {
      if (Array.isArray(detail)) {
        return `${field}: ${detail.join(", ")}`;
      }

      if (detail && typeof detail === "object") {
        return `${field}: ${formatApiErrors(detail as Record<string, unknown>)}`;
      }

      return `${field}: ${String(detail)}`;
    })
    .join(" ");
}

export default function CreateRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEditMode = Boolean(roleId);

  const [roleName,    setRoleName]    = useState("");
  const [accessLevel, setAccessLevel] = useState("medium");
  const [roleStatus,  setRoleStatus]  = useState("active");
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading,     setLoading]     = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    if (!roleId) {
      setRoleName("");
      setAccessLevel("medium");
      setRoleStatus("active");
      setPermissions(defaultPermissions);
      setError("");
      return;
    }

    async function fetchRole() {
      setLoadingRole(true);
      setError("");

      try {
        const token = getAccessToken();
        const res = await api.get<ApiRole>(`/supperadmin/roles/${roleId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setRoleName(String(data.role_name ?? ""));
        setAccessLevel(String(data.access_level ?? "medium"));
        setRoleStatus(String(data.role_status ?? "active"));
        setPermissions(buildPermissions(data.permissions));
      } catch {
        toast.error("Failed to load role details.");
        setError("Failed to load role details.");
      } finally {
        setLoadingRole(false);
      }
    }

    void fetchRole();
  }, [roleId]);

  function handleBasicChange(field: string, value: string) {
    if (field === "role_name")    setRoleName(value);
    if (field === "access_level") setAccessLevel(value);
    if (field === "role_status")  setRoleStatus(value);
  }

  function handlePermissionChange(module: string, field: keyof Permission, value: boolean) {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.module !== module) return perm;

        if (field === "full_access") {
          return {
            ...perm,
            ...Object.fromEntries(permissionFields.map((permissionField) => [permissionField, value])),
            full_access: value,
          };
        }

        const updated = { ...perm, [field]: value };
        return {
          ...updated,
          full_access: permissionFields.every((permissionField) => updated[permissionField]),
        };
      })
    );
  }

  async function handleSave() {
    if (!roleName.trim()) {
      setError("Role name is required!");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      role_name:    roleName.trim(),
      role_status:  roleStatus,
      access_level: accessLevel,
      permissions:  permissions.map((perm) => ({
        module:      perm.module.toLowerCase(),
        can_view:    perm.can_view,
        can_create:  perm.can_create,
        can_edit:    perm.can_edit,
        can_delete:  perm.can_delete,
        can_approve: perm.can_approve,
        can_export:  perm.can_export,
        full_access: perm.full_access,
      })),
    };

    try {
      const token = getAccessToken(); // ✅ get token

      if (isEditMode) {
        await api.patch(`/supperadmin/roles/${roleId}/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post("/supperadmin/roles/", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success(isEditMode ? "Role updated successfully." : "Role created successfully.");
      router.push("/admindashboard/role");

    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorData = apiError.response?.data;
      setError(
        errorData?.message ||
        errorData?.error ||
        (errorData?.errors ? formatApiErrors(errorData.errors) : "") ||
        "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full bg-white px-6 py-6 lg:px-10">
      <div className="mx-auto max-w-[1200px] space-y-6">

        <CreateRoleHeader
          onSave={handleSave}
          loading={loading || loadingRole}
          isEditMode={isEditMode}
        />

        {error && (
          <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <BasicRoleInformationCard
          roleName={roleName}
          accessLevel={accessLevel}
          roleStatus={roleStatus}
          onChange={handleBasicChange}
        />

        <PermissionsMatrixCard
          permissions={permissions}
          onChange={handlePermissionChange}
        />

      </div>
    </section>
  );
}
