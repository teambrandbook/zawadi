"use client";

import CreateNotificationActions from "./components/create-notification/CreateNotificationActions";
import CreateNotificationFormSections from "./components/create-notification/CreateNotificationFormSections";
import CreateNotificationLivePreview from "./components/create-notification/CreateNotificationLivePreview";

export default function CreateNotificationPage() {
  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Notifications</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Compose and deliver announcements, reminders, alerts, and updates to the right audience across the ZEWADI platform.
        </p>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <CreateNotificationFormSections />
            <CreateNotificationActions />
          </div>
          <CreateNotificationLivePreview />
        </div>
      </div>
    </section>
  );
}

