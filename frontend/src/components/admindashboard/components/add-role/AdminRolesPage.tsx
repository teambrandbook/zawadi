"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import Carts from "./componets/Carts";
import TableFilters from "./componets/TableFilters";
import RolesTable from "./componets/RolesTable";
import RoleDetailsCard from "./componets/RoleDetailsCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "@/redux/roleSlice";

export default function AdminRolesPage() {
  const dispatch = useDispatch();

  const roles = useSelector((state: any) => state.roles.data);
  const loading = useSelector((state: any) => state.roles.loading);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles() as any);
    }
  }, [dispatch, roles.length]);

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  useEffect(() => {
    let data = [...roles];

    if (search) {
      data = data.filter((role: any) =>
        role.role_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      data = data.filter((role: any) => role.role_status === status);
    }

    if (accessFilter !== "all") {
      data = data.filter((role: any) => role.access_level === accessFilter);
    }

    setFilteredRoles(data);
  }, [search, status, roles, accessFilter]);

  return (
    <div className="px-6 lg:px-10 space-y-6">
      <div className="w-full py-6 bg-gray-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-[#064e3b]">
            Admin Roles & Permissions
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 h-11 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064e3b]/10 bg-white text-sm text-gray-700 placeholder:text-gray-500"
              />
            </div>

            <Link
              href="/admindashboard/role/create"
              className="flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#053e2f] text-white px-5 h-11 rounded-lg transition-all font-medium text-sm shadow-md active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Create Role</span>
            </Link>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-gray-500 px-1">Loading roles...</p>
      )}

      <div className="px-1">
        <Carts roles={roles} />
      </div>

      <div className="px-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <TableFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            accessFilter={accessFilter}
            setAccessFilter={setAccessFilter}
          />

          <RolesTable
            roles={filteredRoles}
            selectedRole={selectedRole}
            onSelectRole={(role) => setSelectedRole(role)}
          />
        </div>

        <div className="w-full lg:w-[320px]">
          {selectedRole ? (
            <RoleDetailsCard role={selectedRole} />
          ) : (
            <p className="text-gray-400 text-sm text-center mt-10">
              Select a role to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}