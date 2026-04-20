import type {
  AdminContact,
  LocalizationFormat,
  PlatformInformation,
  SecurityPrivacySettings,
  SystemPreferencesSettings,
} from "./settingsTypes";

// Backend-ready defaults: replace with API response payloads.
export const platformInformationDefault: PlatformInformation = {
  platformName: "ZEWADI Health Community",
  supportEmail: "support@zewadi.com",
  supportPhone: "+1 (555) 123-4567",
  region: "United States",
};

export const localizationFormatDefault: LocalizationFormat = {
  language: "English (US)",
  timezone: "UTC-5 (Eastern Time)",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12-hour (AM/PM)",
  preview: "12/28/2024 at 3:45 PM EST",
};

export const adminContactDefault: AdminContact = {
  fullName: "Michael Anderson",
  email: "admin@zewadi.com",
  phone: "+1(555) 987-6543",
  role: "Super Administrator",
};

export const securityPrivacyDefault: SecurityPrivacySettings = {
  twoFactorEnabled: true,
  consentRequired: true,
  passwordPolicy: "8 characters",
  sessionTimeout: "15 minutes",
  loginAttemptLimit: "5",
  dataVisibility: "private",
  sensitiveDataAccess: "Super Admin only",
};

export const systemPreferencesDefault: SystemPreferencesSettings = {
  dashboardView: "Analytics Overview",
  themeMode: "Light Mode",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12-hour (AM/PM)",
  reportExportDefault: "PDF Document",
  backupPreference: "Daily at 2:00 AM",
  syncPreference: "Real-time Sync",
  dataDisplayRange: "Last 7 days",
  maintenanceMode: false,
  autoRefreshDashboard: true,
  systemNotifications: true,
  advancedAnalytics: true,
};
