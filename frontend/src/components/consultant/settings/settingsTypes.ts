export type ConsultantSettingsTabId = "account" | "notifications" | "security" | "preferences";

export type ConsultantSettingsTab = {
  id: ConsultantSettingsTabId;
  label: string;
};

export type AccountInfoField = {
  label: string;
  value: string;
};

export type PasswordField = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
};

export type NotificationPreference = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type NotificationPreferenceSection = {
  id: string;
  title: string;
  items: NotificationPreference[];
};

export type NotificationChannel = {
  id: string;
  label: string;
  enabled: boolean;
};

export type NotificationTiming = {
  quietHoursEnabled: boolean;
  startTime: string;
  endTime: string;
  weekendDoNotDisturb: boolean;
};

export type TwoFactorMethod = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  recommended?: boolean;
};

export type LoginActivityItem = {
  id: string;
  device: string;
  location: string;
  time: string;
  current?: boolean;
};

export type SecurityPreference = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type RecoveryField = {
  id: string;
  label: string;
  value: string;
};

export type PreferenceOption = {
  label: string;
  value: string;
};

export type PreferenceSelectField = {
  id: string;
  label: string;
  value: string;
  options: PreferenceOption[];
};

export type PreferenceToggle = {
  id: string;
  label: string;
  enabled: boolean;
};

export type PreferenceSegmentOption = {
  label: string;
  value: string;
};

export type PreferencesSettingsData = {
  dashboardLandingPage: PreferenceSelectField;
  preferredDashboardView: {
    label: string;
    value: string;
    options: PreferenceSegmentOption[];
  };
  dashboardToggles: PreferenceToggle[];
  consultationSelects: PreferenceSelectField[];
  consultationToggles: PreferenceToggle[];
  dietPlanTemplate: PreferenceSelectField;
  planViewDefault: {
    label: string;
    value: string;
    options: PreferenceSegmentOption[];
  };
  dietPlanToggles: PreferenceToggle[];
  communicationSelects: PreferenceSelectField[];
  communicationToggles: PreferenceToggle[];
  regionalSelects: PreferenceSelectField[];
};
