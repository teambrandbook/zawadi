"use client";

import type { NotificationCategory } from "./notificationTypes";

type NotificationTab = {
  id: NotificationCategory;
  label: string;
};

type Props = {
  tabs: NotificationTab[];
  activeTab: NotificationCategory;
  onChange: (tab: NotificationCategory) => void;
};

export default function NotificationTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="overflow-x-auto border-b border-[#DFDFDF]">
      <div className="flex min-w-max items-center gap-6 px-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`border-b-2 px-0 py-4 text-sm transition ${
                isActive
                  ? "border-[#0A4833] font-medium text-[#0A4833]"
                  : "border-transparent text-[#A88751] hover:text-[#0A4833]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

