"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountSetupSection from "./components/AccountSetupSection";
import AddressSection from "./components/AddressSection";
import BasicInfoSection from "./components/BasicInfoSection";
import CreateUserActions from "./components/CreateUserActions";
import NotesSection from "./components/NotesSection";
import PermissionsSection from "./components/PermissionsSection";
import PreferencesSection from "./components/PreferencesSection";
import ProfilePhotoSection from "./components/ProfilePhotoSection";
import RoleMembershipSection from "./components/RoleMembershipSection";

export default function UserCreatePage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    tempPassword: "",
    confirmPassword: "",
    memberId: "",
    accountStatus: "Active",
    role: "",
    wellnessInterests: "Select interests",
    dietPreference: "Select diet type",
    preferredCommunication: "Email",
    notificationPreferences: "All Notifications",
    addressLine: "",
    city: "",
    state: "",
    country: "Select country",
    postalCode: "",
    notes: "",
  });

  const [permissions, setPermissions] = useState({
    activateImmediately: true,
    sendWelcomeEmail: true,
    sendPasswordSetup: false,
    allowPlatformNotifications: true,
    markVerified: false,
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoPick(file: File | null) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Image size should be 5MB or less.");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleTogglePermission(field: keyof typeof permissions) {
    setPermissions((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleCreateUser() {
    if (!form.fullName || !form.email || !form.phone || !form.username) {
      window.alert("Please fill required fields: Full Name, Email, Phone Number, Username.");
      return;
    }
    if (form.tempPassword.length < 8 || form.tempPassword !== form.confirmPassword) {
      window.alert("Password must be at least 8 chars and match confirm password.");
      return;
    }

    window.alert("User created successfully.");
    router.push("/admindashboard/users");
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      <div className="mx-auto max-w-[760px] space-y-5">
        <BasicInfoSection values={form} onChange={updateField} />
        <ProfilePhotoSection photoPreview={photoPreview} onPick={handlePhotoPick} />
        <AccountSetupSection values={form} onChange={updateField} />
        <RoleMembershipSection role={form.role} onRoleChange={(role) => updateField("role", role)} />
        <PreferencesSection values={form} onChange={updateField} />
        <AddressSection values={form} onChange={updateField} />
        <NotesSection notes={form.notes} onChange={(value) => updateField("notes", value)} />
        <PermissionsSection values={permissions} onToggle={handleTogglePermission} />
        <CreateUserActions onCreate={handleCreateUser} />
      </div>
    </section>
  );
}
