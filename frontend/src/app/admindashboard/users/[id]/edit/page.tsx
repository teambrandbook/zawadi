"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import api from "@/services/api";

type UserForm = {
  full_name: string;
  phone: string;
  role: string;
  location: string;
  date_of_birth: string;
  gender: string;
  is_active: boolean;
};

const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"];

function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
      />
    </label>
  );
}

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [form, setForm] = useState<UserForm>({
    full_name: "",
    phone: "",
    role: "",
    location: "",
    date_of_birth: "",
    gender: "",
    is_active: true,
  });

  // Prefill form from API
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get(`/superadmin/users/${userId}/`);
        const data = res.data;
        setForm({
          full_name: String(data.full_name ?? data.name ?? ""),
          phone: String(data.phone ?? ""),
          role: String(data.role ?? ""),
          location: String(data.location ?? ""),
          date_of_birth: String(data.date_of_birth ?? ""),
          gender: String(data.gender ?? ""),
          is_active: Boolean(data.is_active),
        });
      } catch {
        setFetchError("Failed to load user. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  function updateField(field: keyof UserForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.full_name.trim()) { toast.error("Full name is required."); return; }

    setIsSaving(true);
    try {
      await api.patch(
        `/superadmin/users/${userId}/`,
        form
      );
      toast.success("User updated successfully! ✅");
      router.push("/admindashboard/users");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg ?? "Failed to update user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0A4833]" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="m-6 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
        {fetchError}
      </div>
    );
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[900px] space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-semibold leading-tight text-[#0A4833]">Edit User</h1>
            <p className="text-[12px] text-[#6B7280]">Update user information for ID: {userId}</p>
          </div>
          <Link
            href="/admindashboard/users"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Users
          </Link>
        </header>

        <div className="rounded-xl border border-[#E4E7EC] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#0A4833]">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full Name *"
              value={form.full_name}
              onChange={(v) => updateField("full_name", v)}
              placeholder="Full name"
            />
            <InputField
              label="Phone Number"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              placeholder="+1 (555) 123-4567"
            />
            <InputField
              label="Location"
              value={form.location}
              onChange={(v) => updateField("location", v)}
              placeholder="City, Country"
            />
            <InputField
              label="Date of Birth"
              value={form.date_of_birth}
              onChange={(v) => updateField("date_of_birth", v)}
              type="date"
            />
            <label className="block space-y-1">
              <span className="text-[11px] font-medium text-[#344054]">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
              >
                <option value="">Select gender...</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </label>
            <InputField
              label="Role"
              value={form.role}
              onChange={(v) => updateField("role", v)}
              placeholder="admin, community_user, consultant..."
            />
          </div>

          <div className="mt-4 border-t border-[#E4E7EC] pt-4">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#344054]">Account Active</p>
                <p className="text-[11px] text-[#6B7280]">Toggle whether this user account is active</p>
              </div>
              <button
                type="button"
                onClick={() => updateField("is_active", !form.is_active)}
                className={`relative h-5 w-10 rounded-full transition-colors ${form.is_active ? "bg-[#0A4833]" : "bg-[#D1D5DB]"}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 rounded-xl border border-[#E4E7EC] bg-white p-4">
          <Link
            href="/admindashboard/users"
            className="inline-flex h-9 items-center rounded-md border border-[#D0D5DD] bg-white px-4 text-[12px] text-[#344054]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-[12px] font-medium text-white disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
