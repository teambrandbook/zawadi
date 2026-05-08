"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import CreateEventActions from "./components/create-event/CreateEventActions";
import CreateEventFormSections from "./components/create-event/CreateEventFormSections";
import CreateEventPreview from "./components/create-event/CreateEventPreview";
import type { CreateEventFormData } from "./types";

export default function CreateEventsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventFormData>({
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
    institutional_name: "",
    host_type: "Individual",
    timezone: "UTC",
    agenda_highlights: "",
    banner_file: null,
    banner_preview_url: "",
    enable_registration: true,
    waitlist_enabled: false,
    approval_required: false,
  });

  useEffect(() => {
    return () => {
      if (formData.banner_preview_url.startsWith("blob:")) {
        URL.revokeObjectURL(formData.banner_preview_url);
      }
    };
  }, [formData.banner_preview_url]);

  async function submitEvent(status: "draft" | "published" = formData.status as "draft" | "published") {
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
      const payload = {
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
        status,
        show_in_community: formData.show_in_community,
      };

      if (formData.banner_file) {
        const fd = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined) fd.append(key, String(value));
        });
        fd.append("cover_image", formData.banner_file);
        await api.post("/events/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/events/", payload);
      }

      toast.success(status === "draft" ? "Event saved as draft." : "Event created successfully.");
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
            <CreateEventActions
              onSubmit={() => submitEvent("published")}
              onSaveDraft={() => submitEvent("draft")}
              isSubmitting={isSubmitting}
            />
          </div>
          <CreateEventPreview formData={formData} />
        </div>
      </div>
    </section>
  );
}
