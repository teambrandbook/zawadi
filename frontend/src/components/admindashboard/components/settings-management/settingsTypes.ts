export type SettingsTab = "general" | "security" | "system" | "tax";

export type PlatformInformation = {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  region: string;
};

export type LocalizationFormat = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  preview: string;
};

export type AdminContact = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

export type SecurityPrivacySettings = {
  twoFactorEnabled: boolean;
  consentRequired: boolean;
  passwordPolicy: string;
  sessionTimeout: string;
  loginAttemptLimit: string;
  dataVisibility: "private" | "community" | "public";
  sensitiveDataAccess: string;
};

export type SystemPreferencesSettings = {
  dashboardView: string;
  themeMode: string;
  dateFormat: string;
  timeFormat: string;
  reportExportDefault: string;
  backupPreference: string;
  syncPreference: string;
  dataDisplayRange: string;
  maintenanceMode: boolean;
  autoRefreshDashboard: boolean;
  systemNotifications: boolean;
  advancedAnalytics: boolean;
};
