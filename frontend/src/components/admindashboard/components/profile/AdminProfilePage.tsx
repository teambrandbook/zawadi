"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Camera, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import type { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/userSlice";
import api from "@/services/api";

type MeResponse = {
  email: string;
  role: string;
  full_name: string;
  phone: string;
  photo?: string | null;
};

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-[#D9D9D9] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#06402B]";

export default function AdminProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { upload, isUploading } = useCloudinaryUpload("profile_photo");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { data } = await api.get<MeResponse>("/account/me/");
        if (cancelled) return;
        setEmail(data.email ?? "");
        setRole(data.role ?? "");
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setPhoto(data.photo ?? "");
      } catch {
        toast.error("Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePhotoChange(file?: File) {
    if (!file) return;
    try {
      const uploadedUrl = await upload(file);
      setPhoto(uploadedUrl);
      toast.success("Profile photo uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload profile photo.");
    }
  }

  async function handleSaveProfile() {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.patch<MeResponse>("/account/me/", {
        full_name: fullName.trim(),
        phone: phone.trim(),
        photo,
      });
      dispatch(
        setCredentials({
          email: data.email,
          role: data.role,
          fullName: data.full_name,
          photo: data.photo ?? null,
        }),
      );
      toast.success("Profile updated.");
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Enter current and new password.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/account/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed.");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
        "Could not change password.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F6F7F9] text-sm text-[#06402B]">
        Loading profile...
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[960px] space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#06402B]">Profile Settings</h1>
          <p className="mt-1 text-sm text-[#4B5563]">Manage your personal admin account details.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-base font-bold text-[#06402B]">Account Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#374151]">
                Full Name
                <input className={inputClass} value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </label>
              <label className="text-sm font-medium text-[#374151]">
                Phone
                <input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label className="text-sm font-medium text-[#374151]">
                Email
                <input className={`${inputClass} bg-[#F9FAFB] text-[#6B7280]`} value={email} disabled />
              </label>
              <label className="text-sm font-medium text-[#374151]">
                Role
                <input className={`${inputClass} bg-[#F9FAFB] text-[#6B7280] capitalize`} value={role.replace("_", " ")} disabled />
              </label>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving || isUploading}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[#06402B] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </section>

          <section className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-base font-bold text-[#06402B]">Profile Photo</h2>
            <div className="mt-5 flex flex-col items-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#06402B]">
                {photo ? (
                  <Image src={photo} alt={fullName || "Profile photo"} fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {(fullName || email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#D9D9D9] px-4 text-sm font-semibold text-[#06402B]">
                <Camera className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(event) => void handlePhotoChange(event.target.files?.[0])}
                />
              </label>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-base font-bold text-[#06402B]">Password</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#374151]">
              Current Password
              <input
                className={inputClass}
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-[#374151]">
              New Password
              <input
                className={inputClass}
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={saving}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-[#06402B] px-4 text-sm font-semibold text-[#06402B] disabled:opacity-60"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </button>
        </section>
      </div>
    </section>
  );
}
