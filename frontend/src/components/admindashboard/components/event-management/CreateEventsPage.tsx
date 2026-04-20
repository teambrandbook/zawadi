"use client";

import CreateEventActions from "./components/create-event/CreateEventActions";
import CreateEventFormSections from "./components/create-event/CreateEventFormSections";
import CreateEventPreview from "./components/create-event/CreateEventPreview";

export default function CreateEventsPage() {
  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-2xl font-semibold text-[#0A4833]">Create Events</h1>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <CreateEventFormSections />
            <CreateEventActions />
          </div>
          <CreateEventPreview />
        </div>
      </div>
    </section>
  );
}

