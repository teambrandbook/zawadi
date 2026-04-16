"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import AccountSetupSection from "./components/AccountSetupSection";
import AddressSection from "./components/AddressSection";
import BasicInfoSection from "./components/BasicInfoSection";
import CreateUserActions from "./components/CreateUserActions";
import NotesSection from "./components/NotesSection";
import PermissionsSection from "./components/PermissionsSection";
import PreferencesSection from "./components/PreferencesSection";
import ProfilePhotoSection from "./components/ProfilePhotoSection";
import RoleMembershipSection from "./components/RoleMembershipSection";
import { clearRegisterState, registerUser } from "@/redux/userSlice";
import { AppDispatch, RootState } from "@/redux/store";

export default function UserCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.users.loading);
  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_name: "",
    date_of_birth: "",
    gender: "",
    location: "",
    photo: "",
    password: "",
    memberId: "",
    accountStatus: "active",
    role: "",
    role_obj: null as null | Record<string, unknown>,
    user_type: "",
    wellness_interests: "",
    diet_preference: "",
    preferred_communication: "email",
    notification_preferences: "l",
    address_line: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    activate_immediately: true,
    send_welcome_email: true,
    send_password_setup: false,
    allow_notifications: true,
    markVerified: false,
    notes: "",
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

  function handleTogglePermission(field: string, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateUser() {
    if (!form.full_name || !form.email || !form.phone || !form.user_name) {
      window.alert("Please fill required fields: Full Name, Email, Phone Number, Username.");
      return;
    }
    if (form.password.length < 8) {
      window.alert("Password must be at least 8 chars.");
      return;
    }

    const payload = form;
    try {
      await dispatch(registerUser(payload)).unwrap();
      window.alert("User created successfully.");
      dispatch(clearRegisterState());
      router.push("/admindashboard/users");
    } catch (error: unknown) {
      const message = typeof error === "string" ? error : "Failed to create user.";
      window.alert(message);
    }
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
        <PermissionsSection values={form} onToggle={handleTogglePermission} />
        <CreateUserActions onCreate={handleCreateUser} loading={loading} />
      </div>
    </section>
  );
}



