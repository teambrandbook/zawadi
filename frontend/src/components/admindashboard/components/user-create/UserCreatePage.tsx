"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRoles } from "@/redux/roleSlice";
import { registerUser } from "@/redux/userSlice";

import AccountSetupSection from "./components/AccountSetupSection";
import AddressSection from "./components/AddressSection";
import BasicInfoSection from "./components/BasicInfoSection";
import CreateUserActions from "./components/CreateUserActions";
import PermissionsSection from "./components/PermissionsSection";
import PreferencesSection from "./components/PreferencesSection";
import ProfilePhotoSection from "./components/ProfilePhotoSection";
import RoleMembershipSection from "./components/RoleMembershipSection";

// ✅ FIXED TYPE
type FormType = {
  full_name: string;
  email: string;
  phone: string;
  user_name: string;
  date_of_birth: string;
  gender: string;
  location: string;
  photo: File | null; // ✅ IMPORTANT
  password: string;
  is_active: boolean;

  role: string;
  role_obj: number | null;
  user_type: string;

  wellness_interests: string;
  diet_preference: string;

  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  preferred_communication: string;
  notification_preferences: string;

  activate_immediately: boolean;
  send_welcome_email: boolean;
  send_password_setup: boolean;
  allow_notifications: boolean;
  is_verified_member: boolean;
};

export default function UserCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: RootState) => state.roles.data);

  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState<FormType>({
    full_name: "",
    email: "",
    phone: "",
    user_name: "",
    date_of_birth: "",
    gender: "",
    location: "",
    photo: null, // ✅ FIXED
    password: "",
    is_active: true,

    role: "",
    role_obj: null,
    user_type: "",

    wellness_interests: "",
    diet_preference: "",

    preferred_communication: "email",
    notification_preferences: "all",

    address_line: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",

    activate_immediately: false,
    send_welcome_email: true,
    send_password_setup: false,
    allow_notifications: true,
    is_verified_member: false,
  });

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles.length]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ✅ FIXED PHOTO HANDLER
  function handlePhotoPick(file: File | null) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be 5MB or less.");
      return;
    }

    // ✅ store file in form
    setForm((prev) => ({
      ...prev,
      photo: file,
    }));

    // ✅ preview
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleTogglePermission(field: string, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ✅ FIXED SUBMIT
  async function handleCreateUser() {
    if (!form.full_name || !form.email || !form.phone || !form.user_name) {
      alert("Please fill required fields.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 chars.");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value as any);
      }
    });

    try {
      await dispatch(registerUser(formData)); // ✅ send FormData
      alert("User created successfully.");
      router.push("/admindashboard/users");
    } catch {
      alert("Failed to create user.");
    }
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      <div className="mx-auto max-w-[760px] space-y-5">

        <BasicInfoSection values={form} onChange={updateField} />

        <ProfilePhotoSection
          photoPreview={photoPreview}
          onPick={handlePhotoPick}
        />

        <AccountSetupSection values={form} onChange={updateField} />

        <RoleMembershipSection
          setForm={setForm}
          role={form.role}
          role_obj={form.role_obj}
          roles={roles}
        />

        <PreferencesSection values={form} onChange={updateField} />
        <AddressSection values={form} onChange={updateField} />

        <PermissionsSection
          values={form}
          onToggle={handleTogglePermission}
        />

        <CreateUserActions onCreate={handleCreateUser} />

      </div>
    </section>
  );
}
