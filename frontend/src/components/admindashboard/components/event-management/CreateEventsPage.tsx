"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import CreateEventActions from "./components/create-event/CreateEventActions";
import CreateEventFormSections from "./components/create-event/CreateEventFormSections";
import CreateEventPreview from "./components/create-event/CreateEventPreview";

export default function CreateEventsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Nutrition Session",
    event_type: "Online",
    description: "",
    start_date: "",
    end_date: "",
    max_attendees: "",
  });

  async function handleSubmit() {
    if (!formData.title) {
      toast.error("Event title is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/events/", {
        title: formData.title,
        category: formData.category,
        event_type: formData.event_type.toLowerCase(),
        description: formData.description,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees, 10) : undefined,
      });
      router.push("/admindashboard/events");
    } catch {
      toast.error("Failed to create event. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-2xl font-semibold text-[#0A4833]">Create Events</h1>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <CreateEventFormSections formData={formData} onChange={setFormData} />
            <CreateEventActions onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
          <CreateEventPreview />
        </div>
      </div>
    </section>
  );
}
