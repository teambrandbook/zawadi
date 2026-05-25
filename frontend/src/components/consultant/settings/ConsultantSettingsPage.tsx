"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import SettingsContentSwitcher from "./SettingsContentSwitcher";
import SettingsTabs from "./SettingsTabs";
import type {
  AccountInfoField,
  ConsultantSettingsTab,
  ConsultantSettingsTabId,
  LoginActivityItem,
  NotificationChannel,
  NotificationPreferenceSection,
  NotificationTiming,
  PasswordField,
  PreferencesSettingsData,
  RecoveryField,
  SecurityPreference,
  TwoFactorMethod,
} from "./settingsTypes";

const settingsTabs: ConsultantSettingsTab[] = [
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
];

const emptyAccountInfo: AccountInfoField[] = [
  { label: "Email Address", value: "" },
  { label: "Phone Number", value: "" },
  { label: "Full Name", value: "" },
  { label: "Specialization", value: "" },
];

const loadingAccountInfo: AccountInfoField[] = [
  { label: "Email Address", value: "Loading..." },
  { label: "Phone Number", value: "Loading..." },
  { label: "Full Name", value: "Loading..." },
  { label: "Specialization", value: "Loading..." },
];

type ConsultantProfileApiResponse = {
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  qualification: string;
  experience_areas: string;
};

type ConsultantSettingsApiResponse = {
  accept_new: boolean;
  allow_same_day: boolean;
  show_profile: boolean;
  auto_close_full_day: boolean;
  followup_priority: boolean;
};

type ConsultantProfileUpdateResponse = {
  message: string;
  data: ConsultantProfileApiResponse;
};

const passwordFieldsFromBackend: PasswordField[] = [
  { id: "current-password", label: "Current Password", value: "", placeholder: "" },
  { id: "new-password", label: "New Password", value: "", placeholder: "" },
];

const securityPasswordFieldsFromBackend: PasswordField[] = [
  { id: "current-password", label: "Current Password", value: "", placeholder: "Enter current password" },
  { id: "new-password", label: "New Password", value: "", placeholder: "Enter new password" },
  { id: "confirm-new-password", label: "Confirm New Password", value: "", placeholder: "Confirm new password" },
];

const notificationPreferenceSectionsFromBackend: NotificationPreferenceSection[] = [
  {
    id: "consultation",
    title: "Consultation Notifications",
    items: [
      {
        id: "new-consultation-assigned",
        title: "New consultation assigned",
        description: "Get notified when new consultations are assigned to you",
        enabled: true,
      },
      {
        id: "consultation-reminder",
        title: "Consultation reminder before session",
        description: "15 minutes before scheduled consultations",
        enabled: true,
      },
      {
        id: "rescheduled-alerts",
        title: "Rescheduled consultation alerts",
        description: "When clients reschedule their appointments",
        enabled: false,
      },
      {
        id: "follow-up-reminders",
        title: "Follow-up due reminders",
        description: "Remind when follow-up consultations are due",
        enabled: true,
      },
    ],
  },
  {
    id: "client-communication",
    title: "Client Communication Alerts",
    items: [
      {
        id: "new-client-message",
        title: "New client message notifications",
        description: "Instant alerts for new client messages",
        enabled: true,
      },
      {
        id: "priority-client-message",
        title: "Priority client message alerts",
        description: "Special alerts for urgent client messages",
        enabled: true,
      },
      {
        id: "daily-unread-summary",
        title: "Daily unread summary",
        description: "Summary of unread messages at end of day",
        enabled: false,
      },
    ],
  },
  {
    id: "events-community",
    title: "Event & Community Notifications",
    items: [
      {
        id: "upcoming-wellness-session",
        title: "Upcoming wellness session alerts",
        description: "Reminders for webinars and wellness sessions",
        enabled: true,
      },
      {
        id: "community-participation",
        title: "Community participation notices",
        description: "Updates on community discussions and activities",
        enabled: false,
      },
    ],
  },
];

const notificationChannelsFromBackend: NotificationChannel[] = [
  { id: "in-app", label: "In-app notifications", enabled: true },
  { id: "sms", label: "SMS notifications", enabled: false },
  { id: "email", label: "Email notifications", enabled: true },
  { id: "push", label: "Push notifications", enabled: true },
];

const notificationTimingFromBackend: NotificationTiming = {
  quietHoursEnabled: true,
  startTime: "10:00 PM",
  endTime: "7:00 AM",
  weekendDoNotDisturb: false,
};

const twoFactorMethodsFromBackend: TwoFactorMethod[] = [
  { id: "email", title: "Email Verification", description: "Secure code via email", enabled: false },
  { id: "sms", title: "SMS Verification", description: "One-time code via SMS", enabled: false },
  { id: "authenticator", title: "Authentication App", description: "Use Authenticator app", enabled: true, recommended: true },
];

const loginActivityFromBackend: LoginActivityItem[] = [
  { id: "chrome-windows", device: "Chrome on Windows", location: "Kannur, India", time: "Today, 10:24 AM", current: true },
  { id: "safari-iphone", device: "Safari on iPhone", location: "Kannur, India", time: "Yesterday, 8:12 PM" },
  { id: "firefox-macos", device: "Firefox on MacOS", location: "Kochi, India", time: "Dec 18, 2024 3:45 PM" },
];

const securityPreferencesFromBackend: SecurityPreference[] = [
  {
    id: "login-alerts",
    title: "Email me for new login alerts",
    description: "Get notified when someone logs into your account",
    enabled: true,
  },
  {
    id: "password-change-verification",
    title: "Require verification on password change",
    description: "Extra security step when changing your password",
    enabled: true,
  },
  {
    id: "auto-logout",
    title: "Auto logout after inactivity",
    description: "Automatically log out after 30 minutes of inactivity",
    enabled: false,
  },
  {
    id: "data-access-alerts",
    title: "Secure consultant data access alerts",
    description: "Get alerts when sensitive client data is accessed",
    enabled: true,
  },
];

const recoveryFieldsFromBackend: RecoveryField[] = [
  { id: "recovery-email", label: "Recovery Email", value: "dr.chen@example.com" },
  { id: "recovery-phone", label: "Recovery Phone Number", value: "+91 98765 43210" },
];

const preferencesDataFromBackend: PreferencesSettingsData = {
  dashboardLandingPage: {
    id: "dashboard-landing-page",
    label: "Default Landing Page",
    value: "dashboard-overview",
    options: [
      { label: "Dashboard Overview", value: "dashboard-overview" },
      { label: "Today Schedule", value: "today-schedule" },
      { label: "Client Summary", value: "client-summary" },
    ],
  },
  preferredDashboardView: {
    label: "Preferred Dashboard View",
    value: "compact",
    options: [
      { label: "Compact", value: "compact" },
      { label: "Spacious", value: "spacious" },
    ],
  },
  dashboardToggles: [
    { id: "quick-stats-cards", label: "Show Quick Stats Cards", enabled: true },
    { id: "recent-activity", label: "Show Recent Activity", enabled: true },
    { id: "reminders-panel", label: "Show Reminders Panel", enabled: false },
  ],
  consultationSelects: [
    {
      id: "default-session-type",
      label: "Default Session Type",
      value: "video-consultation",
      options: [
        { label: "Video Consultation", value: "video-consultation" },
        { label: "Phone Consultation", value: "phone-consultation" },
        { label: "In-person Consultation", value: "in-person-consultation" },
      ],
    },
    {
      id: "preferred-consultation-duration",
      label: "Preferred Consultation Duration",
      value: "30-minutes",
      options: [
        { label: "30 minutes", value: "30-minutes" },
        { label: "45 minutes", value: "45-minutes" },
        { label: "60 minutes", value: "60-minutes" },
      ],
    },
    {
      id: "default-follow-up-reminder",
      label: "Default Follow-up Reminder",
      value: "1-week",
      options: [
        { label: "1 week", value: "1-week" },
        { label: "2 weeks", value: "2-weeks" },
        { label: "1 month", value: "1-month" },
      ],
    },
  ],
  consultationToggles: [
    { id: "auto-open-client-profile", label: "Auto-open Client Profile", enabled: true },
    { id: "show-notes-preview", label: "Show Notes Preview", enabled: true },
    { id: "priority-client-highlight", label: "Priority Client Highlight", enabled: true },
  ],
  dietPlanTemplate: {
    id: "default-diet-plan-template",
    label: "Default Diet Plan Template",
    value: "buckwheat-wellness-plan",
    options: [
      { label: "Buckwheat Wellness Plan", value: "buckwheat-wellness-plan" },
      { label: "Balanced Nutrition Plan", value: "balanced-nutrition-plan" },
      { label: "Digestive Support Plan", value: "digestive-support-plan" },
    ],
  },
  planViewDefault: {
    label: "Plan View Default",
    value: "weekly",
    options: [
      { label: "Weekly", value: "weekly" },
      { label: "Daily", value: "daily" },
    ],
  },
  dietPlanToggles: [
    { id: "include-buckwheat-default", label: "Include Buckwheat by Default", enabled: true },
    { id: "show-nutrition-breakdown", label: "Show Nutrition Breakdown", enabled: true },
    { id: "calorie-target-field", label: "Calorie Target Field", enabled: true },
    { id: "auto-save-draft-plans", label: "Auto-save Draft Plans", enabled: true },
  ],
  communicationSelects: [
    {
      id: "response-style",
      label: "Response Style",
      value: "professional-warm",
      options: [
        { label: "Professional & Warm", value: "professional-warm" },
        { label: "Concise & Direct", value: "concise-direct" },
        { label: "Friendly & Casual", value: "friendly-casual" },
      ],
    },
    {
      id: "reminder-message-tone",
      label: "Reminder Message Tone",
      value: "encouraging",
      options: [
        { label: "Encouraging", value: "encouraging" },
        { label: "Neutral", value: "neutral" },
        { label: "Formal", value: "formal" },
      ],
    },
  ],
  communicationToggles: [
    { id: "enable-canned-replies", label: "Enable Canned Replies", enabled: true },
    { id: "show-unread-first", label: "Show Unread Messages First", enabled: true },
    { id: "event-invitation-visibility", label: "Event Invitation Visibility", enabled: false },
    { id: "priority-message-sorting", label: "Priority Message Sorting", enabled: true },
  ],
  regionalSelects: [
    {
      id: "language",
      label: "Language",
      value: "english-us",
      options: [
        { label: "English (US)", value: "english-us" },
        { label: "English (UK)", value: "english-uk" },
      ],
    },
    {
      id: "timezone",
      label: "Timezone",
      value: "gmt-8-pacific",
      options: [
        { label: "GMT-8 (Pacific Time)", value: "gmt-8-pacific" },
        { label: "GMT-5 (Eastern Time)", value: "gmt-5-eastern" },
        { label: "GMT+5:30 (India Time)", value: "gmt-plus-530-india" },
      ],
    },
    {
      id: "date-format",
      label: "Date Format",
      value: "mm-dd-yyyy",
      options: [
        { label: "MM/DD/YYYY", value: "mm-dd-yyyy" },
        { label: "DD/MM/YYYY", value: "dd-mm-yyyy" },
        { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
      ],
    },
    {
      id: "time-format",
      label: "Time Format",
      value: "12-hour",
      options: [
        { label: "12-hour (AM/PM)", value: "12-hour" },
        { label: "24-hour", value: "24-hour" },
      ],
    },
    {
      id: "week-starts-on",
      label: "Week Starts On",
      value: "sunday",
      options: [
        { label: "Sunday", value: "sunday" },
        { label: "Monday", value: "monday" },
        { label: "Saturday", value: "saturday" },
      ],
    },
  ],
};

function accountFieldsFromProfile(profile: ConsultantProfileApiResponse): AccountInfoField[] {
  return [
    { label: "Email Address", value: profile.email || "" },
    { label: "Phone Number", value: profile.phone || "" },
    { label: "Full Name", value: profile.full_name || profile.user_name || "" },
    { label: "Specialization", value: profile.experience_areas || profile.qualification || "" },
  ];
}

function applyBackendSettingsToNotifications(
  sections: NotificationPreferenceSection[],
  settings: ConsultantSettingsApiResponse,
) {
  const values: Record<string, boolean> = {
    "new-consultation-assigned": settings.accept_new,
    "consultation-reminder": settings.allow_same_day,
    "follow-up-reminders": settings.followup_priority,
  };

  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      enabled: values[item.id] ?? item.enabled,
    })),
  }));
}

function applyBackendSettingsToPreferences(data: PreferencesSettingsData, settings: ConsultantSettingsApiResponse) {
  const toggleValues: Record<string, boolean> = {
    "auto-open-client-profile": settings.show_profile,
    "priority-client-highlight": settings.followup_priority,
    "auto-save-draft-plans": settings.auto_close_full_day,
  };
  const toggleList = (items: typeof data.dashboardToggles) =>
    items.map((item) => ({
      ...item,
      enabled: toggleValues[item.id] ?? item.enabled,
    }));

  return {
    ...data,
    consultationToggles: toggleList(data.consultationToggles),
    dietPlanToggles: toggleList(data.dietPlanToggles),
  };
}

export default function ConsultantSettingsPage() {
  const [activeTab, setActiveTab] = useState<ConsultantSettingsTabId>("account");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [accountFields, setAccountFields] = useState(emptyAccountInfo);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const [accountPasswordFields, setAccountPasswordFields] = useState(passwordFieldsFromBackend);
  const [consultantSettings, setConsultantSettings] = useState<ConsultantSettingsApiResponse | null>(null);
  const [notificationPreferenceSections, setNotificationPreferenceSections] = useState(notificationPreferenceSectionsFromBackend);
  const [notificationChannels, setNotificationChannels] = useState(notificationChannelsFromBackend);
  const [notificationTiming, setNotificationTiming] = useState(notificationTimingFromBackend);
  const [securityPasswordFields, setSecurityPasswordFields] = useState(securityPasswordFieldsFromBackend);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethods, setTwoFactorMethods] = useState(twoFactorMethodsFromBackend);
  const [securityPreferences, setSecurityPreferences] = useState(securityPreferencesFromBackend);
  const [preferencesData, setPreferencesData] = useState(preferencesDataFromBackend);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountProfile() {
      setIsAccountLoading(true);
      try {
        const { data } = await api.get<ConsultantProfileApiResponse>("/consultant/profile/");
        if (!isMounted) return;
        setAccountFields(accountFieldsFromProfile(data));
      } catch {
        if (isMounted) {
          setAccountFields(emptyAccountInfo);
          setStatusMessage("Could not load account information.");
        }
      } finally {
        if (isMounted) setIsAccountLoading(false);
      }
    }

    async function loadConsultantSettings() {
      try {
        const { data: settings } = await api.get<ConsultantSettingsApiResponse>("/consultant/settings/");
        if (!isMounted) return;
        setConsultantSettings(settings);
        setNotificationPreferenceSections((current) => applyBackendSettingsToNotifications(current, settings));
        setPreferencesData((current) => applyBackendSettingsToPreferences(current, settings));
      } catch {
        // Account information should still be usable even if preference settings fail.
      }
    }

    void loadAccountProfile();
    void loadConsultantSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  function getErrorMessage(error: unknown, fallback: string) {
    const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
    const detail = data?.error || data?.detail;
    if (typeof detail === "string") return detail;
    return fallback;
  }

  function changeAccountField(label: string, value: string) {
    setAccountFields((current) =>
      current.map((field) =>
        field.label === label
          ? {
              ...field,
              value,
            }
          : field,
      ),
    );
  }

  function changeAccountPasswordField(fieldId: string, value: string) {
    setAccountPasswordFields((current) =>
      current.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              value,
            }
          : field,
      ),
    );
  }

  function accountValue(label: string) {
    return accountFields.find((field) => field.label === label)?.value || "";
  }

  async function saveAccountSettings() {
    setIsSaving(true);
    setStatusMessage("");
    const currentPassword = accountPasswordFields.find((field) => field.id === "current-password")?.value.trim() || "";
    const newPassword = accountPasswordFields.find((field) => field.id === "new-password")?.value.trim() || "";

    try {
      const profileResponse = await api.patch<ConsultantProfileUpdateResponse>("/consultant/profile/", {
        full_name: accountValue("Full Name"),
        phone: accountValue("Phone Number"),
        experience_areas: accountValue("Specialization"),
      });
      setAccountFields(accountFieldsFromProfile(profileResponse.data.data));

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          setStatusMessage("Fill both password fields to change password.");
          return;
        }
        await api.post("/account/change-password/", {
          current_password: currentPassword,
          new_password: newPassword,
        });
        setAccountPasswordFields(passwordFieldsFromBackend);
        setStatusMessage("Account settings and password saved.");
        return;
      }

      setStatusMessage("Account settings saved.");
    } catch (error: unknown) {
      setStatusMessage(getErrorMessage(error, "Could not save account settings."));
    } finally {
      setIsSaving(false);
    }
  }

  function resetAccountSettings() {
    setIsAccountLoading(true);
    api
      .get<ConsultantProfileApiResponse>("/consultant/profile/")
      .then(({ data }) => {
        setAccountFields(accountFieldsFromProfile(data));
        setAccountPasswordFields(passwordFieldsFromBackend);
        setStatusMessage("Account settings reset.");
      })
      .catch(() => setStatusMessage("Could not reset account settings."))
      .finally(() => setIsAccountLoading(false));
  }

  function buildSettingsPayloadFromCurrent(): ConsultantSettingsApiResponse {
    const notificationEnabled = (id: string) =>
      notificationPreferenceSections
        .flatMap((section) => section.items)
        .find((item) => item.id === id)?.enabled ?? true;
    const preferenceEnabled = (id: string) =>
      [
        ...preferencesData.dashboardToggles,
        ...preferencesData.consultationToggles,
        ...preferencesData.dietPlanToggles,
        ...preferencesData.communicationToggles,
      ].find((item) => item.id === id)?.enabled ?? false;

    return {
      accept_new: notificationEnabled("new-consultation-assigned"),
      allow_same_day: notificationEnabled("consultation-reminder"),
      show_profile: preferenceEnabled("auto-open-client-profile"),
      auto_close_full_day: preferenceEnabled("auto-save-draft-plans"),
      followup_priority:
        notificationEnabled("follow-up-reminders") || preferenceEnabled("priority-client-highlight"),
    };
  }

  async function saveConsultantSettings(successMessage: string) {
    setIsSaving(true);
    setStatusMessage("");

    try {
      const payload = buildSettingsPayloadFromCurrent();
      const { data } = await api.put<{ data: ConsultantSettingsApiResponse }>("/consultant/settings/", payload);
      setConsultantSettings(data.data);
      setStatusMessage(successMessage);
    } catch {
      setStatusMessage("Could not save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function saveNotificationSettings() {
    void saveConsultantSettings("Notification settings saved.");
  }

  function resetNotificationSettings() {
    setNotificationPreferenceSections(notificationPreferenceSectionsFromBackend);
    setNotificationChannels(notificationChannelsFromBackend);
    setNotificationTiming(notificationTimingFromBackend);
    const fallback = consultantSettings ?? {
      accept_new: true,
      allow_same_day: true,
      show_profile: true,
      auto_close_full_day: true,
      followup_priority: false,
    };
    setNotificationPreferenceSections(applyBackendSettingsToNotifications(notificationPreferenceSectionsFromBackend, fallback));
    setStatusMessage("Notification settings reset.");
  }

  function toggleNotificationPreference(preferenceId: string) {
    setNotificationPreferenceSections((current) =>
      current.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === preferenceId
            ? {
                ...item,
                enabled: !item.enabled,
              }
            : item,
        ),
      })),
    );
  }

  function toggleNotificationChannel(channelId: string) {
    setNotificationChannels((current) =>
      current.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              enabled: !channel.enabled,
            }
          : channel,
      ),
    );
  }

  function toggleQuietHours() {
    setNotificationTiming((current) => ({
      ...current,
      quietHoursEnabled: !current.quietHoursEnabled,
    }));
  }

  function toggleWeekendQuietHours() {
    setNotificationTiming((current) => ({
      ...current,
      weekendDoNotDisturb: !current.weekendDoNotDisturb,
    }));
  }

  function changeNotificationStartTime(value: string) {
    setNotificationTiming((current) => ({
      ...current,
      startTime: value,
    }));
  }

  function changeNotificationEndTime(value: string) {
    setNotificationTiming((current) => ({
      ...current,
      endTime: value,
    }));
  }

  function changeSecurityPassword(fieldId: string, value: string) {
    setSecurityPasswordFields((current) =>
      current.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              value,
            }
          : field,
      ),
    );
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled((current) => !current);
  }

  function toggleTwoFactorMethod(methodId: string) {
    setTwoFactorMethods((current) =>
      current.map((method) =>
        method.id === methodId
          ? {
              ...method,
              enabled: !method.enabled,
            }
          : method,
      ),
    );
  }

  function toggleSecurityPreference(preferenceId: string) {
    setSecurityPreferences((current) =>
      current.map((item) =>
        item.id === preferenceId
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  }

  async function saveSecuritySettings() {
    const currentPassword = securityPasswordFields.find((field) => field.id === "current-password")?.value;
    const newPassword = securityPasswordFields.find((field) => field.id === "new-password")?.value;
    const confirmPassword = securityPasswordFields.find((field) => field.id === "confirm-new-password")?.value;

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setStatusMessage("Fill all password fields to change password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMessage("New password and confirm password do not match.");
        return;
      }
      setIsSaving(true);
      setStatusMessage("");
      try {
        await api.post("/account/change-password/", {
          current_password: currentPassword,
          new_password: newPassword,
        });
        setSecurityPasswordFields(securityPasswordFieldsFromBackend);
        setStatusMessage("Password changed successfully.");
      } catch {
        setStatusMessage("Could not change password. Check current password.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setStatusMessage("Security preferences saved locally.");
  }

  function resetSecuritySettings() {
    setSecurityPasswordFields(securityPasswordFieldsFromBackend);
    setTwoFactorEnabled(true);
    setTwoFactorMethods(twoFactorMethodsFromBackend);
    setSecurityPreferences(securityPreferencesFromBackend);
    setStatusMessage("Security settings reset to default values.");
  }

  function logoutOtherDevices() {
    api
      .post("/account/logout-all/")
      .then(() => setStatusMessage("Other devices logged out."))
      .catch(() => setStatusMessage("Could not logout other devices."));
  }

  function changePreferenceSelect(fieldId: string, value: string) {
    setPreferencesData((current) => {
      if (current.dashboardLandingPage.id === fieldId) {
        return {
          ...current,
          dashboardLandingPage: {
            ...current.dashboardLandingPage,
            value,
          },
        };
      }

      if (current.dietPlanTemplate.id === fieldId) {
        return {
          ...current,
          dietPlanTemplate: {
            ...current.dietPlanTemplate,
            value,
          },
        };
      }

      const updateField = (fields: typeof current.consultationSelects) =>
        fields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                value,
              }
            : field,
        );

      return {
        ...current,
        consultationSelects: updateField(current.consultationSelects),
        communicationSelects: updateField(current.communicationSelects),
        regionalSelects: updateField(current.regionalSelects),
      };
    });
  }

  function togglePreference(toggleId: string) {
    setPreferencesData((current) => {
      const toggleList = (items: typeof current.dashboardToggles) =>
        items.map((item) =>
          item.id === toggleId
            ? {
                ...item,
                enabled: !item.enabled,
              }
            : item,
        );

      return {
        ...current,
        dashboardToggles: toggleList(current.dashboardToggles),
        consultationToggles: toggleList(current.consultationToggles),
        dietPlanToggles: toggleList(current.dietPlanToggles),
        communicationToggles: toggleList(current.communicationToggles),
      };
    });
  }

  function changePreferenceSegment(groupId: string, value: string) {
    setPreferencesData((current) => {
      if (groupId === "preferredDashboardView") {
        return {
          ...current,
          preferredDashboardView: {
            ...current.preferredDashboardView,
            value,
          },
        };
      }

      if (groupId === "planViewDefault") {
        return {
          ...current,
          planViewDefault: {
            ...current.planViewDefault,
            value,
          },
        };
      }

      return current;
    });
  }

  function savePreferences() {
    void saveConsultantSettings("Preferences saved.");
  }

  function resetPreferences() {
    const fallback = consultantSettings ?? {
      accept_new: true,
      allow_same_day: true,
      show_profile: true,
      auto_close_full_day: true,
      followup_priority: false,
    };
    setPreferencesData(applyBackendSettingsToPreferences(preferencesDataFromBackend, fallback));
    setStatusMessage("Preferences reset.");
  }

  return (
    <main className="min-h-screen bg-[#FCFCFB] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.5px] text-[#0A4833]">Settings</h1>
        </div>

        <div className="space-y-4">
          <SettingsTabs activeTab={activeTab} tabs={settingsTabs} onChange={setActiveTab} />

          <SettingsContentSwitcher
            activeTab={activeTab}
            accountFields={isAccountLoading ? loadingAccountInfo : accountFields}
            passwordFields={accountPasswordFields}
            securityPasswordFields={securityPasswordFields}
            notificationPreferenceSections={notificationPreferenceSections}
            notificationChannels={notificationChannels}
            notificationTiming={notificationTiming}
            twoFactorEnabled={twoFactorEnabled}
            twoFactorMethods={twoFactorMethods}
            loginActivity={loginActivityFromBackend}
            securityPreferences={securityPreferences}
            recoveryFields={recoveryFieldsFromBackend}
            preferencesData={preferencesData}
            onAccountFieldChange={changeAccountField}
            onAccountPasswordChange={changeAccountPasswordField}
            onSecurityPasswordChange={changeSecurityPassword}
            onToggleNotificationPreference={toggleNotificationPreference}
            onToggleNotificationChannel={toggleNotificationChannel}
            onToggleQuietHours={toggleQuietHours}
            onToggleWeekendQuietHours={toggleWeekendQuietHours}
            onNotificationStartTimeChange={changeNotificationStartTime}
            onNotificationEndTimeChange={changeNotificationEndTime}
            onToggleTwoFactor={toggleTwoFactor}
            onToggleTwoFactorMethod={toggleTwoFactorMethod}
            onToggleSecurityPreference={toggleSecurityPreference}
            onPreferenceSelectChange={changePreferenceSelect}
            onPreferenceToggleChange={togglePreference}
            onPreferenceSegmentChange={changePreferenceSegment}
            onSaveAccount={saveAccountSettings}
            onResetAccount={resetAccountSettings}
            onSaveNotifications={saveNotificationSettings}
            onResetNotifications={resetNotificationSettings}
            onSaveSecurity={saveSecuritySettings}
            onResetSecurity={resetSecuritySettings}
            onLogoutOtherDevices={logoutOtherDevices}
            onSavePreferences={savePreferences}
            onResetPreferences={resetPreferences}
          />

          {statusMessage ? (
            <div className="rounded-[10px] border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm font-medium text-[#0A4833]">
              {isSaving ? "Saving..." : statusMessage}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
