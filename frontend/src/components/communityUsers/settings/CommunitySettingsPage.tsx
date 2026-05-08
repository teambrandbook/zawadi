"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import AccountSettingsPanel from "./AccountSettingsPanel";
import NotificationsPanel from "./NotificationsPanel";
import PreferencesPanel from "./PreferencesPanel";
import type { PreferencesPanelData } from "./PreferencesPanel";
import PrivacyPanel from "./PrivacyPanel";
import ProfileInformationPanel from "./ProfileInformationPanel";
import SecurityPanel from "./SecurityPanel";
import SettingsHeader from "./SettingsHeader";
import SettingsPlaceholderPanel from "./SettingsPlaceholderPanel";
import SettingsSideNav from "./SettingsSideNav";
import { settingsSections } from "./settingsData";
import type {
  AccountDetail,
  DeliveryChannel,
  LinkedAccount,
  LoginActivity,
  NotificationCategory,
  AccountPrivacyControl,
  PrivacyChoice,
  PrivacyToggleItem,
  QuietHours,
  ReminderPreferences,
  SecurityStatusItem,
  SettingsSectionId,
  CommunityProfileData,
  CommunityProfileUpdatePayload,
} from "./settingsTypes";

const accountDetails: AccountDetail[] = [
  { label: "Member ID", value: "#ZW-2024-5891" },
  { label: "Joined Date", value: "March 15, 2024" },
  { label: "Account Status", value: "Active", tone: "success" },
  { label: "Membership", value: "Premium Member", tone: "premium" },
];

const COMMUNITY_PROFILE_UPDATED_EVENT = "community-profile-updated";

const initialLinkedAccounts: LinkedAccount[] = [
  { id: "google", provider: "Google Account", detail: "sarah.johnson@gmail.com", connected: true },
  { id: "facebook", provider: "Facebook", detail: "Not connected", connected: false },
];

const initialNotificationCategories: NotificationCategory[] = [
  { id: "orders", title: "Order Updates", description: "Notifications about order status and delivery", enabled: true },
  { id: "events", title: "Event Reminders", description: "Upcoming wellness events and workshops", enabled: true },
  { id: "consultations", title: "Consultation Reminders", description: "Upcoming nutritionist appointments", enabled: true },
  { id: "diet", title: "Diet Plan Updates", description: "New meal plans and dietary recommendations", enabled: false },
  { id: "recipes", title: "Recipe Approval Notifications", description: "Updates on your submitted recipes", enabled: true },
  { id: "blog", title: "Blog Review Notifications", description: "Status updates on your blog posts", enabled: false },
  { id: "community", title: "Community Announcements", description: "Important updates from ZEWADI team", enabled: true },
  { id: "promos", title: "Promotional Updates", description: "Special offers and discounts", enabled: false },
];

const initialDeliveryChannels: DeliveryChannel[] = [
  { id: "email", title: "Email", detail: "sarah@example.com", enabled: true },
  { id: "sms", title: "SMS", detail: "+1 (555) 123-4567", enabled: false },
  { id: "push", title: "Push Notifications", detail: "Mobile device notifications", enabled: true },
  { id: "inapp", title: "In-app", detail: "Notifications within ZEWADI", enabled: true },
];

const reminderPreferences: ReminderPreferences = {
  event: "1 day before",
  consultation: "1 day before",
  orderDelivery: "On delivery day",
};

const initialQuietHours: QuietHours = {
  enabled: true,
  from: "22:00",
  to: "08:00",
};

const loginActivity: LoginActivity[] = [
  { id: "login-1", device: "MacBook Pro", location: "Chrome • New York, US", time: "2 hours ago", current: true },
  { id: "login-2", device: "iPhone 14", location: "Safari • New York, US", time: "Yesterday" },
  { id: "login-3", device: "iPad Air", location: "Safari • Boston, US", time: "3 days ago" },
];

const securityStatus: SecurityStatusItem[] = [
  { id: "protected", title: "Account Protected", detail: "Your account security is up to date", tone: "success" },
  { id: "password", title: "Password Last Changed", detail: "30 days ago", tone: "neutral" },
  { id: "check", title: "Last Security Check", detail: "Today at 2:30 PM", tone: "neutral" },
];

const profileChoices: PrivacyChoice[] = [
  { id: "public", title: "Public", description: "Anyone can view your profile" },
  { id: "community", title: "Community Only", description: "Only ZEWADI members can view" },
  { id: "private", title: "Private", description: "Only you can view your profile" },
];

const initialBlogVisibility: PrivacyToggleItem[] = [
  { id: "public", title: "Public visibility", enabled: true },
  { id: "community", title: "Community-only visibility", enabled: false },
  { id: "draft", title: "Draft/private visibility", enabled: false },
];

const initialRecipeVisibility: PrivacyToggleItem[] = [
  { id: "approved", title: "Visible after approval", enabled: true },
  { id: "community", title: "Community-only visibility", enabled: true },
  { id: "hide", title: "Hide from profile", enabled: false },
];

const initialCommunityInteraction: PrivacyToggleItem[] = [
  { id: "comments", title: "Allow comments on blogs", enabled: true },
  { id: "recipe", title: "Allow recipe interactions", enabled: true },
  { id: "events", title: "Event participation visibility", enabled: true },
  { id: "direct", title: "Direct community engagement", enabled: true },
];

const initialDataConsent: PrivacyToggleItem[] = [
  { id: "sharing", title: "Data sharing preferences", enabled: false },
  { id: "consent", title: "Consent management", enabled: true },
];

const accountPrivacyControls: AccountPrivacyControl[] = [
  { id: "search", title: "Search visibility", description: "Allow others to find you via search" },
  { id: "email", title: "Email visibility", description: "Show email on your public profile" },
  { id: "phone", title: "Phone number visibility", description: "Display phone number to community members" },
];

const preferencesPanelData: PreferencesPanelData = {
  wellnessInterests: [
    { id: "weight-management", label: "Weight Management", icon: "weight", selected: true },
    { id: "healthy-eating", label: "Healthy Eating", icon: "healthy" },
    { id: "energy-boost", label: "Energy Boost", icon: "energy" },
    { id: "digestive-health", label: "Digestive Health", icon: "digestive", selected: true },
    { id: "lifestyle-wellness", label: "Lifestyle Wellness", icon: "lifestyle" },
    { id: "fitness-support", label: "Fitness Support", icon: "fitness", selected: true },
  ],
  dietPreferences: [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan", selected: true },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "high-protein", label: "High Protein" },
  ],
  dashboardLayout: {
    defaultView: "Card View",
    preferredWidgets: [
      { id: "daily-nutrition", label: "Daily Nutrition", selected: true },
      { id: "recipe-recommendations", label: "Recipe Recommendations", selected: true },
      { id: "community-activity", label: "Community Activity" },
    ],
  },
  consultationSettings: {
    preferredMethod: "video" as const,
    preferredTime: "Morning (8-12 PM)",
  },
  contentPreferences: [
    { id: "recipes", label: "Recipes", icon: "recipes", selected: true },
    { id: "nutrition-tips", label: "Nutrition Tips", icon: "tips", selected: true },
    { id: "community-blogs", label: "Community Blogs", icon: "blogs" },
    { id: "event-updates", label: "Event Updates", icon: "events", selected: true },
    { id: "wellness-articles", label: "Wellness Articles", icon: "articles" },
  ],
};

export default function CommunitySettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("profile");
  const [profile, setProfile] = useState<CommunityProfileData | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(initialLinkedAccounts);
  const [notificationCategories, setNotificationCategories] = useState<NotificationCategory[]>(initialNotificationCategories);
  const [deliveryChannels, setDeliveryChannels] = useState<DeliveryChannel[]>(initialDeliveryChannels);
  const [quietHours, setQuietHours] = useState<QuietHours>(initialQuietHours);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [selectedProfileVisibility, setSelectedProfileVisibility] = useState("public");
  const [blogVisibility, setBlogVisibility] = useState<PrivacyToggleItem[]>(initialBlogVisibility);
  const [recipeVisibility, setRecipeVisibility] = useState<PrivacyToggleItem[]>(initialRecipeVisibility);
  const [communityInteraction, setCommunityInteraction] = useState<PrivacyToggleItem[]>(initialCommunityInteraction);
  const [dataConsent, setDataConsent] = useState<PrivacyToggleItem[]>(initialDataConsent);
  const [statusMessage, setStatusMessage] = useState("");
  const activeSectionLabel = settingsSections.find((section) => section.id === activeSection)?.label ?? "Settings";
  const resolvedAccountDetails: AccountDetail[] = [
    { label: "Member ID", value: profile?.user_id ? `#${profile.user_id}` : accountDetails[0].value },
    accountDetails[1],
    accountDetails[2],
    accountDetails[3],
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await api.get<CommunityProfileData>("/community/profile/");
        if (isMounted) {
          setProfile(response.data);
          setDeliveryChannels((prev) =>
            prev.map((channel) =>
              channel.id === "email" ? { ...channel, detail: response.data.email } : channel
            )
          );
        }
      } catch {
        if (isMounted) {
          setStatusMessage("Unable to load profile details.");
        }
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  async function saveProfile(payload: CommunityProfileUpdatePayload) {
    setIsProfileSaving(true);
    setStatusMessage("Saving profile...");

    try {
      if (payload.photoFile) {
        const formData = new FormData();
        formData.append("photo", payload.photoFile);
        await api.patch("/community/profile/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const addressHasAnyField = Object.values(payload.address).some((value) => value.trim().length > 0);
      const jsonPayload: Record<string, unknown> = {
        full_name: payload.full_name,
        phone: payload.phone,
        date_of_birth: payload.date_of_birth || null,
        gender: payload.gender || null,
        location: payload.location,
        wellness_interests: payload.wellness_interests,
      };

      if (addressHasAnyField) {
        jsonPayload.address = payload.address;
      }

      if (payload.removePhoto) {
        jsonPayload.photo = null;
      }

      const response = await api.patch<CommunityProfileData>("/community/profile/", jsonPayload);
      setProfile(response.data);
      window.dispatchEvent(new CustomEvent(COMMUNITY_PROFILE_UPDATED_EVENT, { detail: response.data }));
      setStatusMessage("Profile updated successfully.");
    } catch {
      setStatusMessage("Failed to save profile. Please verify fields and try again.");
    } finally {
      setIsProfileSaving(false);
    }
  }

  function toggleLinkedAccount(accountId: string) {
    setLinkedAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              connected: !account.connected,
              detail: account.connected ? "Not connected" : account.provider === "Google Account" ? "sarah.johnson@gmail.com" : "Connected",
            }
          : account
      )
    );
    setStatusMessage("Linked account updated.");
  }

  function saveAccountSettings() {
    setStatusMessage("Account settings saved.");
  }

  function cancelAccountSettings() {
    setLinkedAccounts(initialLinkedAccounts);
    setStatusMessage("Account settings reset.");
  }

  function toggleNotificationCategory(categoryId: string) {
    setNotificationCategories((prev) =>
      prev.map((category) => (category.id === categoryId ? { ...category, enabled: !category.enabled } : category))
    );
    setStatusMessage("Notification category updated.");
  }

  function toggleDeliveryChannel(channelId: string) {
    setDeliveryChannels((prev) =>
      prev.map((channel) => (channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel))
    );
    setStatusMessage("Delivery channel updated.");
  }

  function toggleQuietHours() {
    setQuietHours((prev) => ({ ...prev, enabled: !prev.enabled }));
    setStatusMessage("Quiet hours updated.");
  }

  function saveNotificationSettings() {
    setStatusMessage("Notification preferences saved.");
  }

  function resetNotificationSettings() {
    setNotificationCategories(initialNotificationCategories);
    setDeliveryChannels(initialDeliveryChannels);
    setQuietHours(initialQuietHours);
    setStatusMessage("Notification preferences reset.");
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled((prev) => !prev);
    setStatusMessage("Two-factor authentication updated.");
  }

  function changePassword() {
    setStatusMessage("Password change requested.");
  }

  function saveSecuritySettings() {
    setStatusMessage("Security changes saved.");
  }

  function logoutAllDevices() {
    setStatusMessage("All other devices logged out.");
  }

  function toggleBlogVisibility(itemId: string) {
    setBlogVisibility((prev) => prev.map((item) => (item.id === itemId ? { ...item, enabled: !item.enabled } : item)));
    setStatusMessage("Blog visibility updated.");
  }

  function toggleRecipeVisibility(itemId: string) {
    setRecipeVisibility((prev) => prev.map((item) => (item.id === itemId ? { ...item, enabled: !item.enabled } : item)));
    setStatusMessage("Recipe visibility updated.");
  }

  function toggleCommunityInteraction(itemId: string) {
    setCommunityInteraction((prev) => prev.map((item) => (item.id === itemId ? { ...item, enabled: !item.enabled } : item)));
    setStatusMessage("Community interaction updated.");
  }

  function toggleDataConsent(itemId: string) {
    setDataConsent((prev) => prev.map((item) => (item.id === itemId ? { ...item, enabled: !item.enabled } : item)));
    setStatusMessage("Data consent updated.");
  }

  function downloadPersonalData() {
    setStatusMessage("Personal data download requested.");
  }

  function restorePrivacyDefaults() {
    setSelectedProfileVisibility("public");
    setBlogVisibility(initialBlogVisibility);
    setRecipeVisibility(initialRecipeVisibility);
    setCommunityInteraction(initialCommunityInteraction);
    setDataConsent(initialDataConsent);
    setStatusMessage("Privacy defaults restored.");
  }

  function savePrivacySettings() {
    setStatusMessage("Privacy settings saved.");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <SettingsHeader />

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SettingsSideNav activeSection={activeSection} sections={settingsSections} onSectionChange={setActiveSection} />

          <div className="space-y-4">
            {activeSection === "profile" && (
              <ProfileInformationPanel
                profile={profile}
                isLoading={isProfileLoading}
                isSaving={isProfileSaving}
                onSave={saveProfile}
              />
            )}
            {activeSection === "account" && (
              <AccountSettingsPanel
                accountDetails={resolvedAccountDetails}
                linkedAccounts={linkedAccounts}
                onToggleLinkedAccount={toggleLinkedAccount}
                onSave={saveAccountSettings}
                onCancel={cancelAccountSettings}
              />
            )}
            {activeSection === "notifications" && (
              <NotificationsPanel
                categories={notificationCategories}
                channels={deliveryChannels}
                reminders={reminderPreferences}
                quietHours={quietHours}
                onToggleCategory={toggleNotificationCategory}
                onToggleChannel={toggleDeliveryChannel}
                onToggleQuietHours={toggleQuietHours}
                onSave={saveNotificationSettings}
                onReset={resetNotificationSettings}
              />
            )}
            {activeSection === "security" && (
              <SecurityPanel
                twoFactorEnabled={twoFactorEnabled}
                loginActivity={loginActivity}
                securityStatus={securityStatus}
                onToggleTwoFactor={toggleTwoFactor}
                onChangePassword={changePassword}
                onSave={saveSecuritySettings}
                onLogoutAllDevices={logoutAllDevices}
              />
            )}
            {activeSection === "preferences" && <PreferencesPanel data={preferencesPanelData} />}
            {activeSection === "privacy" && (
              <PrivacyPanel
                profileChoices={profileChoices}
                selectedProfileVisibility={selectedProfileVisibility}
                blogVisibility={blogVisibility}
                recipeVisibility={recipeVisibility}
                communityInteraction={communityInteraction}
                dataConsent={dataConsent}
                accountControls={accountPrivacyControls}
                onSelectProfileVisibility={setSelectedProfileVisibility}
                onToggleBlogVisibility={toggleBlogVisibility}
                onToggleRecipeVisibility={toggleRecipeVisibility}
                onToggleCommunityInteraction={toggleCommunityInteraction}
                onToggleDataConsent={toggleDataConsent}
                onDownloadData={downloadPersonalData}
                onRestoreDefaults={restorePrivacyDefaults}
                onSave={savePrivacySettings}
              />
            )}
            {activeSection !== "profile" &&
              activeSection !== "account" &&
              activeSection !== "notifications" &&
              activeSection !== "security" &&
              activeSection !== "preferences" &&
              activeSection !== "privacy" && (
                <SettingsPlaceholderPanel title={activeSectionLabel} />
              )}
            {statusMessage && (
              <div className="rounded-lg border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm font-medium text-[#06402B]">
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
