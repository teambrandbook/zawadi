"use client";

import { useState } from "react";
import { toast } from "sonner";
import AdminContactDetailsCard from "./components/AdminContactDetailsCard";
import LocalizationFormatCard from "./components/LocalizationFormatCard";
import PlatformInformationCard from "./components/PlatformInformationCard";
import SecurityPrivacySection from "./components/SecurityPrivacySection";
import SettingsHeader from "./components/SettingsHeader";
import SettingsPageActions from "./components/SettingsPageActions";
import SettingsTabs from "./components/SettingsTabs";
import SystemPreferencesSection from "./components/SystemPreferencesSection";
import {
  adminContactDefault,
  localizationFormatDefault,
  platformInformationDefault,
  securityPrivacyDefault,
  systemPreferencesDefault,
} from "./settingsMockData";
import type { SettingsTab } from "./settingsTypes";

const STORAGE_KEY = "zawadi_admin_settings";

// MVP note: these admin settings are UI-only and persist in this browser.
// They are not platform-wide settings until a backend settings API is added.
type PersistedSettings = {
  platformData: typeof platformInformationDefault;
  localizationData: typeof localizationFormatDefault;
  adminContactData: typeof adminContactDefault;
  securityData: typeof securityPrivacyDefault;
  systemData: typeof systemPreferencesDefault;
  lastSaved: string;
};

function loadFromStorage(): PersistedSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSettings;
  } catch {
    return null;
  }
}

export default function SettingsManagementPage() {
  const [savedSettings] = useState(loadFromStorage);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [platformData, setPlatformData] = useState(savedSettings?.platformData ?? platformInformationDefault);
  const [localizationData, setLocalizationData] = useState(savedSettings?.localizationData ?? localizationFormatDefault);
  const [adminContactData, setAdminContactData] = useState(savedSettings?.adminContactData ?? adminContactDefault);
  const [securityData, setSecurityData] = useState(savedSettings?.securityData ?? securityPrivacyDefault);
  const [systemData, setSystemData] = useState(savedSettings?.systemData ?? systemPreferencesDefault);
  const [lastSaved, setLastSaved] = useState(savedSettings?.lastSaved ?? "Not saved yet");

  function persistToStorage(
    updatedPlatform: typeof platformInformationDefault,
    updatedLocalization: typeof localizationFormatDefault,
    updatedAdminContact: typeof adminContactDefault,
    updatedSecurity: typeof securityPrivacyDefault,
    updatedSystem: typeof systemPreferencesDefault,
    savedAt: string,
  ) {
    const payload: PersistedSettings = {
      platformData: updatedPlatform,
      localizationData: updatedLocalization,
      adminContactData: updatedAdminContact,
      securityData: updatedSecurity,
      systemData: updatedSystem,
      lastSaved: savedAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function handleSave() {
    const savedAt = new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " by Admin User";
    setLastSaved(savedAt);
    persistToStorage(platformData, localizationData, adminContactData, securityData, systemData, savedAt);
    toast.success("Settings saved successfully! ✅");
  }

  function handleCancel() {
    const saved = loadFromStorage();
    if (saved) {
      setPlatformData(saved.platformData ?? platformInformationDefault);
      setLocalizationData(saved.localizationData ?? localizationFormatDefault);
      setAdminContactData(saved.adminContactData ?? adminContactDefault);
      setSecurityData(saved.securityData ?? securityPrivacyDefault);
      setSystemData(saved.systemData ?? systemPreferencesDefault);
      toast.info("Changes reverted to last saved state.");
    } else {
      setPlatformData(platformInformationDefault);
      setLocalizationData(localizationFormatDefault);
      setAdminContactData(adminContactDefault);
      setSecurityData(securityPrivacyDefault);
      setSystemData(systemPreferencesDefault);
      toast.info("Changes discarded.");
    }
  }

  function handleReset() {
    if (activeTab === "general") {
      setPlatformData(platformInformationDefault);
      setLocalizationData(localizationFormatDefault);
      setAdminContactData(adminContactDefault);
      persistToStorage(platformInformationDefault, localizationFormatDefault, adminContactDefault, securityData, systemData, lastSaved);
      toast.info("General settings reset to defaults.");
      return;
    }

    if (activeTab === "security") {
      setSecurityData(securityPrivacyDefault);
      persistToStorage(platformData, localizationData, adminContactData, securityPrivacyDefault, systemData, lastSaved);
      toast.info("Security settings reset to defaults.");
      return;
    }

    setSystemData(systemPreferencesDefault);
    persistToStorage(platformData, localizationData, adminContactData, securityData, systemPreferencesDefault, lastSaved);
    toast.info("System preferences reset to defaults.");
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-4 lg:px-6">
      <div className="mx-auto max-w-[1120px] space-y-3">
        <SettingsHeader onSave={handleSave} />
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "general" ? (
          <>
            <PlatformInformationCard
              data={platformData}
              onChange={(field, value) => setPlatformData((current) => ({ ...current, [field]: value }))}
            />
            <LocalizationFormatCard
              data={localizationData}
              onChange={(field, value) => setLocalizationData((current) => ({ ...current, [field]: value }))}
            />
            <AdminContactDetailsCard
              data={adminContactData}
              onChange={(field, value) => setAdminContactData((current) => ({ ...current, [field]: value }))}
            />
            <SettingsPageActions
              lastSaved={lastSaved}
              onReset={handleReset}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </>
        ) : null}

        {activeTab === "security" ? (
          <SecurityPrivacySection
            data={securityData}
            onChange={setSecurityData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : null}

        {activeTab === "system" ? (
          <SystemPreferencesSection
            data={systemData}
            onChange={setSystemData}
            onSave={handleSave}
            onReset={handleReset}
          />
        ) : null}
      </div>
    </section>
  );
}
