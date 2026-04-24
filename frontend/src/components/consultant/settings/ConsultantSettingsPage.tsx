"use client";

import { useState } from "react";
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

const accountInfoFromBackend: AccountInfoField[] = [
  { label: "Email Address", value: "sarah.johnson@zewadi.com" },
  { label: "Phone Number", value: "+1 (555) 123-4567" },
  { label: "Full Name", value: "Dr. Sarah Johnson" },
  { label: "Specialization", value: "Nutritional Therapy" },
];

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

export default function ConsultantSettingsPage() {
  const [activeTab, setActiveTab] = useState<ConsultantSettingsTabId>("account");
  const [statusMessage, setStatusMessage] = useState("");
  const [notificationPreferenceSections, setNotificationPreferenceSections] = useState(notificationPreferenceSectionsFromBackend);
  const [notificationChannels, setNotificationChannels] = useState(notificationChannelsFromBackend);
  const [notificationTiming, setNotificationTiming] = useState(notificationTimingFromBackend);
  const [securityPasswordFields, setSecurityPasswordFields] = useState(securityPasswordFieldsFromBackend);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethods, setTwoFactorMethods] = useState(twoFactorMethodsFromBackend);
  const [securityPreferences, setSecurityPreferences] = useState(securityPreferencesFromBackend);
  const [preferencesData, setPreferencesData] = useState(preferencesDataFromBackend);

  function saveAccountSettings() {
    setStatusMessage("Account settings are ready to connect to the backend save endpoint.");
  }

  function resetAccountSettings() {
    setStatusMessage("Account settings reset action is ready for backend defaults.");
  }

  function saveNotificationSettings() {
    setStatusMessage("Notification settings are ready to connect to the backend save endpoint.");
  }

  function resetNotificationSettings() {
    setNotificationPreferenceSections(notificationPreferenceSectionsFromBackend);
    setNotificationChannels(notificationChannelsFromBackend);
    setNotificationTiming(notificationTimingFromBackend);
    setStatusMessage("Notification settings reset to default values.");
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

  function saveSecuritySettings() {
    setStatusMessage("Security settings are ready to connect to the backend save endpoint.");
  }

  function resetSecuritySettings() {
    setSecurityPasswordFields(securityPasswordFieldsFromBackend);
    setTwoFactorEnabled(true);
    setTwoFactorMethods(twoFactorMethodsFromBackend);
    setSecurityPreferences(securityPreferencesFromBackend);
    setStatusMessage("Security settings reset to default values.");
  }

  function logoutOtherDevices() {
    setStatusMessage("Other device logout is ready to connect to the backend security endpoint.");
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
    setStatusMessage("Preferences settings are ready to connect to the backend save endpoint.");
  }

  function resetPreferences() {
    setPreferencesData(preferencesDataFromBackend);
    setStatusMessage("Preferences settings reset to default values.");
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
            accountFields={accountInfoFromBackend}
            passwordFields={passwordFieldsFromBackend}
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
              {statusMessage}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
