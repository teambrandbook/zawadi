"use client";

import { useState } from "react";
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

export default function SettingsManagementPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [securityData, setSecurityData] = useState(securityPrivacyDefault);
  const [systemData, setSystemData] = useState(systemPreferencesDefault);
  const [lastSaved, setLastSaved] = useState("December 28, 2024 at 2:30 PM by Admin User");

  function handleSave() {
    setLastSaved(`${new Date().toLocaleString()} by Admin User`);
  }

  function handleCancel() {
    setSecurityData(securityPrivacyDefault);
    setSystemData(systemPreferencesDefault);
  }

  function handleReset() {
    if (activeTab === "general") {
      setLastSaved("Not saved yet");
      return;
    }

    if (activeTab === "security") {
      setSecurityData(securityPrivacyDefault);
      return;
    }

    setSystemData(systemPreferencesDefault);
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
