"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRoles } from "@/redux/roleSlice";
import { toast } from "sonner";
import AccountSetupSection from "./components/AccountSetupSection";
import AddressSection from "./components/AddressSection";
import BasicInfoSection from "./components/BasicInfoSection";
import CreateUserActions from "./components/CreateUserActions";
import PermissionsSection from "./components/PermissionsSection";
import PreferencesSection from "./components/PreferencesSection";
import ProfilePhotoSection from "./components/ProfilePhotoSection";
import RoleMembershipSection from "./components/RoleMembershipSection";
import api, { getAccessToken } from "@/services/api";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

// ✅ FIXED TYPE
export type FormType = {
  full_name: string;
  email: string;
  phone: string;
  user_name: string;
  date_of_birth: string;
  gender: string;
  location: string;
  photo: string;
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

const initialForm: FormType = {
  full_name: "",
  email: "",
  phone: "",
  user_name: "",
  date_of_birth: "",
  gender: "",
  location: "",
  photo: "",
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
};

export default function UserCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: RootState) => state.roles.data);
  const editUserId = searchParams.get("userId");
  const isEditMode = Boolean(editUserId);

  const { upload: uploadPhoto, isUploading: isPhotoUploading } = useCloudinaryUpload("profile_photo");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [form, setForm] = useState<FormType>(initialForm);

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles.length]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!editUserId) return;

      setIsLoadingUser(true);
      try {
        const res = await api.get(`/superadmin/users/${editUserId}/`);
        const data = res.data as Record<string, unknown>;

        setForm((prev) => ({
          ...prev,
          full_name: String(data.full_name ?? ""),
          email: String(data.email ?? ""),
          phone: String(data.phone ?? ""),
          user_name: String(data.user_name ?? ""),
          date_of_birth: String(data.date_of_birth ?? ""),
          gender: String(data.gender ?? ""),
          location: String(data.location ?? ""),
          password: "",
          is_active: Boolean(data.is_active),
          role: String(data.role ?? ""),
          role_obj:
            typeof data.role_obj === "number"
              ? data.role_obj
              : typeof data.role_obj === "string" && data.role_obj
                ? Number(data.role_obj)
                : null,
        }));

        if (typeof data.photo === "string" && data.photo) {
          setPhotoPreview(data.photo);
          setForm((prev) => ({ ...prev, photo: data.photo as string }));
        }
      } catch {
        toast.error("Failed to load user details.");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [editUserId]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoPick(file: File | null) {
    if (!file) return;
    if (isPhotoUploading) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be 5MB or less.");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setPhotoPreview(blobUrl);
    try {
      const url = await uploadPhoto(file);
      setForm((prev) => ({ ...prev, photo: url }));
      setPhotoPreview(url);
      URL.revokeObjectURL(blobUrl);
    } catch {
      /* hook sets error internally */
    }
  }

  function handleTogglePermission(field: string, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateUser() {
    if (!form.full_name || !form.email || !form.phone || !form.user_name) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isEditMode && form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (isPhotoUploading) {
      toast.error("Photo is still uploading, please wait.");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    try {
      setIsSubmitting(true);
      const token = getAccessToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      if (isEditMode && editUserId) {
        await api.patch(`/superadmin/users/${editUserId}/`, formData, config);
        toast.success("User updated successfully.");
      } else {
        await api.post("/account/register/", formData, config);
        toast.success("User created successfully.");
      }
      router.push("/admindashboard/users");
    } catch {
      toast.error(isEditMode ? "Failed to update user." : "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      <div className="mx-auto max-w-[760px] space-y-5">
        {isLoadingUser && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading user details...
          </div>
        )}

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

        <CreateUserActions
          onCreate={handleCreateUser}
          loading={isSubmitting}
          mode={isEditMode ? "edit" : "create"}
        />
      </div>
    </section>
  );
}
