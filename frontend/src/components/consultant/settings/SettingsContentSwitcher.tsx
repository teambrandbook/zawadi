import AccountSettingsContent from "./AccountSettingsContent";
import NotificationSettingsContent from "./NotificationSettingsContent";
import PreferencesSettingsContent from "./PreferencesSettingsContent";
import SecuritySettingsContent from "./SecuritySettingsContent";
import SettingsPlaceholderContent from "./SettingsPlaceholderContent";
import type {
  AccountInfoField,
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

type Props = {
  activeTab: ConsultantSettingsTabId;
  accountFields: AccountInfoField[];
  passwordFields: PasswordField[];
  securityPasswordFields: PasswordField[];
  notificationPreferenceSections: NotificationPreferenceSection[];
  notificationChannels: NotificationChannel[];
  notificationTiming: NotificationTiming;
  twoFactorEnabled: boolean;
  twoFactorMethods: TwoFactorMethod[];
  loginActivity: LoginActivityItem[];
  securityPreferences: SecurityPreference[];
  recoveryFields: RecoveryField[];
  preferencesData: PreferencesSettingsData;
  onSecurityPasswordChange: (fieldId: string, value: string) => void;
  onToggleNotificationPreference: (preferenceId: string) => void;
  onToggleNotificationChannel: (channelId: string) => void;
  onToggleQuietHours: () => void;
  onToggleWeekendQuietHours: () => void;
  onNotificationStartTimeChange: (value: string) => void;
  onNotificationEndTimeChange: (value: string) => void;
  onToggleTwoFactor: () => void;
  onToggleTwoFactorMethod: (methodId: string) => void;
  onToggleSecurityPreference: (preferenceId: string) => void;
  onPreferenceSelectChange: (fieldId: string, value: string) => void;
  onPreferenceToggleChange: (toggleId: string) => void;
  onPreferenceSegmentChange: (groupId: string, value: string) => void;
  onSaveAccount: () => void;
  onResetAccount: () => void;
  onSaveNotifications: () => void;
  onResetNotifications: () => void;
  onSaveSecurity: () => void;
  onResetSecurity: () => void;
  onLogoutOtherDevices: () => void;
  onSavePreferences: () => void;
  onResetPreferences: () => void;
};

export default function SettingsContentSwitcher({
  activeTab,
  accountFields,
  passwordFields,
  securityPasswordFields,
  notificationPreferenceSections,
  notificationChannels,
  notificationTiming,
  twoFactorEnabled,
  twoFactorMethods,
  loginActivity,
  securityPreferences,
  recoveryFields,
  preferencesData,
  onSecurityPasswordChange,
  onToggleNotificationPreference,
  onToggleNotificationChannel,
  onToggleQuietHours,
  onToggleWeekendQuietHours,
  onNotificationStartTimeChange,
  onNotificationEndTimeChange,
  onToggleTwoFactor,
  onToggleTwoFactorMethod,
  onToggleSecurityPreference,
  onPreferenceSelectChange,
  onPreferenceToggleChange,
  onPreferenceSegmentChange,
  onSaveAccount,
  onResetAccount,
  onSaveNotifications,
  onResetNotifications,
  onSaveSecurity,
  onResetSecurity,
  onLogoutOtherDevices,
  onSavePreferences,
  onResetPreferences,
}: Props) {
  if (activeTab === "account") {
    return (
      <AccountSettingsContent
        accountFields={accountFields}
        passwordFields={passwordFields}
        onSave={onSaveAccount}
        onReset={onResetAccount}
      />
    );
  }

  if (activeTab === "notifications") {
    return (
      <NotificationSettingsContent
        preferenceSections={notificationPreferenceSections}
        channels={notificationChannels}
        timing={notificationTiming}
        onTogglePreference={onToggleNotificationPreference}
        onToggleChannel={onToggleNotificationChannel}
        onToggleQuietHours={onToggleQuietHours}
        onToggleWeekendQuietHours={onToggleWeekendQuietHours}
        onStartTimeChange={onNotificationStartTimeChange}
        onEndTimeChange={onNotificationEndTimeChange}
        onSave={onSaveNotifications}
        onReset={onResetNotifications}
      />
    );
  }

  if (activeTab === "security") {
    return (
      <SecuritySettingsContent
        passwordFields={securityPasswordFields}
        twoFactorEnabled={twoFactorEnabled}
        twoFactorMethods={twoFactorMethods}
        loginActivity={loginActivity}
        securityPreferences={securityPreferences}
        recoveryFields={recoveryFields}
        onPasswordChange={onSecurityPasswordChange}
        onToggleTwoFactor={onToggleTwoFactor}
        onToggleTwoFactorMethod={onToggleTwoFactorMethod}
        onToggleSecurityPreference={onToggleSecurityPreference}
        onSave={onSaveSecurity}
        onReset={onResetSecurity}
        onLogoutOtherDevices={onLogoutOtherDevices}
      />
    );
  }

  if (activeTab === "preferences") {
    return (
      <PreferencesSettingsContent
        data={preferencesData}
        onSelectChange={onPreferenceSelectChange}
        onToggleChange={onPreferenceToggleChange}
        onSegmentChange={onPreferenceSegmentChange}
        onSave={onSavePreferences}
        onReset={onResetPreferences}
      />
    );
  }

  return <SettingsPlaceholderContent title="Settings" description="Additional settings content will appear here." />;
}
