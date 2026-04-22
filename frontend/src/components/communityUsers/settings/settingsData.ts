import { Bell, Lock, Settings2, Shield, SlidersHorizontal, User } from "lucide-react";
import type { SettingsSection } from "./settingsTypes";

export const settingsSections: SettingsSection[] = [
  { id: "profile", label: "Profile Information", Icon: User },
  { id: "account", label: "Account Settings", Icon: Settings2 },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "security", label: "Security", Icon: Shield },
  { id: "preferences", label: "Preferences", Icon: SlidersHorizontal },
  { id: "privacy", label: "Privacy", Icon: Lock },
];
