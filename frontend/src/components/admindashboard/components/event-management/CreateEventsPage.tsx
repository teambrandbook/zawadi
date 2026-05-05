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
    short_description: "",
    full_description: "",
    event_type: "webinar",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    is_online: true,
    location: "",
    meeting_link: "",
    max_attendees: "",
    status: "published",
    show_in_community: true,
  });

  async function handleSubmit() {
    if (!formData.title) {
      toast.error("Event title is required.");
      return;
    }
    if (!formData.short_description.trim()) {
      toast.error("Short description is required.");
      return;
    }
    if (!formData.start_date || !formData.start_time || !formData.end_date || !formData.end_time) {
      toast.error("Start and end date/time are required.");
      return;
    }

    const start = new Date(`${formData.start_date}T${formData.start_time}`);
    const end = new Date(`${formData.end_date}T${formData.end_time}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      toast.error("End date/time must be after start date/time.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/events/", {
        title: formData.title,
        short_description: formData.short_description,
        full_description: formData.full_description,
        event_type: formData.event_type,
        start_datetime: start.toISOString(),
        end_datetime: end.toISOString(),
        is_online: formData.is_online,
        location: formData.location,
        meeting_link: formData.meeting_link,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees, 10) : undefined,
        status: formData.status,
        show_in_community: formData.show_in_community,
      });
      toast.success("Event created successfully.");
      router.push("/admindashboard/events");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail = Object.entries(data ?? {})
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
        .join(" | ");
      toast.error(detail || "Failed to create event. Please check your inputs and try again.");
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
