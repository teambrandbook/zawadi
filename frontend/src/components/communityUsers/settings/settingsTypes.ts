import type { LucideIcon } from "lucide-react";

export type SettingsSectionId = "profile" | "account" | "notifications" | "security" | "preferences" | "privacy";

export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  Icon: LucideIcon;
};

export type AccountDetail = {
  label: string;
  value: string;
  tone?: "success" | "premium";
};

export type LinkedAccount = {
  id: string;
  provider: string;
  detail: string;
  connected: boolean;
};

export type NotificationCategory = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type DeliveryChannel = {
  id: string;
  title: string;
  detail: string;
  enabled: boolean;
};

export type ReminderPreferences = {
  event: string;
  consultation: string;
  orderDelivery: string;
};

export type QuietHours = {
  enabled: boolean;
  from: string;
  to: string;
};

export type LoginActivity = {
  id: string;
  device: string;
  location: string;
  time: string;
  current?: boolean;
};

export type SecurityStatusItem = {
  id: string;
  title: string;
  detail: string;
  tone: "success" | "neutral";
};

export type PrivacyChoice = {
  id: string;
  title: string;
  description: string;
};

export type PrivacyToggleItem = {
  id: string;
  title: string;
  enabled: boolean;
};

export type AccountPrivacyControl = {
  id: string;
  title: string;
  description: string;
};

export type CommunityProfileAddress = {
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
} | null;

export type CommunityProfileData = {
  user_id: string;
  email: string;
  role: string;
  user_name: string;
  full_name: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
  photo: string | null;
  user_type: string;
  wellness_interests: string | null;
  address: CommunityProfileAddress;
};

export type CommunityProfileUpdatePayload = {
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  location: string;
  wellness_interests: string;
  address: {
    address_line: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  photoFile: File | null;
  removePhoto: boolean;
};
