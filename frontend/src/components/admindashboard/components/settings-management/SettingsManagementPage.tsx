"use client";

import { useEffect, useState } from "react";
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

type PersistedSettings = {
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
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [securityData, setSecurityData] = useState(securityPrivacyDefault);
  const [systemData, setSystemData] = useState(systemPreferencesDefault);
  const [lastSaved, setLastSaved] = useState("Not saved yet");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setSecurityData(saved.securityData ?? securityPrivacyDefault);
      setSystemData(saved.systemData ?? systemPreferencesDefault);
      setLastSaved(saved.lastSaved ?? "Not saved yet");
    }
  }, []);

  function persistToStorage(updatedSecurity: typeof securityPrivacyDefault, updatedSystem: typeof systemPreferencesDefault, savedAt: string) {
    const payload: PersistedSettings = {
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
    persistToStorage(securityData, systemData, savedAt);
    toast.success("Settings saved successfully! ✅");
  }

  function handleCancel() {
    const saved = loadFromStorage();
    if (saved) {
      setSecurityData(saved.securityData ?? securityPrivacyDefault);
      setSystemData(saved.systemData ?? systemPreferencesDefault);
      toast.info("Changes reverted to last saved state.");
    } else {
      setSecurityData(securityPrivacyDefault);
      setSystemData(systemPreferencesDefault);
      toast.info("Changes discarded.");
    }
  }

  function handleReset() {
    if (activeTab === "general") {
      setLastSaved("Not saved yet");
      localStorage.removeItem(STORAGE_KEY);
      toast.info("Settings reset to defaults.");
      return;
    }

    if (activeTab === "security") {
      setSecurityData(securityPrivacyDefault);
      persistToStorage(securityPrivacyDefault, systemData, lastSaved);
      toast.info("Security settings reset to defaults.");
      return;
    }

    setSystemData(systemPreferencesDefault);
    persistToStorage(securityData, systemPreferencesDefault, lastSaved);
    toast.info("System preferences reset to defaults.");
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-4 lg:px-6">
      <div className="mx-auto max-w-[1120px] space-y-3">
        <SettingsHeader onSave={handleSave} />
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "general" ? (
          <>
            <PlatformInformationCard data={platformInformationDefault} />
            <LocalizationFormatCard data={localizationFormatDefault} />
            <AdminContactDetailsCard data={adminContactDefault} />
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
