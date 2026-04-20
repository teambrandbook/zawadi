"use client";

import { useState } from "react";
import BasicRoleInformationCard from "./components/BasicRoleInformationCard";
import CreateRoleHeader from "./components/CreateRoleHeader";
import PermissionsMatrixCard from "./components/PermissionsMatrixCard";
import api, { getAccessToken } from "@/services/api";

const defaultPermissions = [
  { module: "Users",         can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Orders",        can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Products",      can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Recipes",       can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Blogs",         can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Consultations", can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
  { module: "Nutritionists", can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_export: false, full_access: false },
];

export default function CreateRolePage() {

  const [roleName,    setRoleName]    = useState("");
  const [accessLevel, setAccessLevel] = useState("medium");
  const [roleStatus,  setRoleStatus]  = useState("active");
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  function handleBasicChange(field: string, value: string) {
    if (field === "role_name")    setRoleName(value);
    if (field === "access_level") setAccessLevel(value);
    if (field === "role_status")  setRoleStatus(value);
  }

  function handlePermissionChange(module: string, field: string, value: boolean) {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module === module
          ? { ...perm, [field]: value }
          : perm
      )
    );
  }

  async function handleSave() {
    if (!roleName) {
      setError("Role name is required!");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      role_name:    roleName,
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

      await api.post("/supperadmin/roles/", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });

      alert("Role created successfully! ✅");

    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full bg-white px-6 py-6 lg:px-10">
      <div className="mx-auto max-w-[1200px] space-y-6">

        <CreateRoleHeader onSave={handleSave} loading={loading} />

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
