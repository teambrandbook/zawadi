"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import CreateEventActions from "./components/create-event/CreateEventActions";
import CreateEventFormSections from "./components/create-event/CreateEventFormSections";
import CreateEventPreview from "./components/create-event/CreateEventPreview";
import type { CreateEventFormData } from "./types";

type Props = {
  eventId?: string;
};

type ApiEventDetail = {
  title?: string;
  short_subtitle?: string;
  short_description?: string;
  full_description?: string;
  event_type?: string;
  status?: string;
  cover_image?: string | null;
  host_speaker_name?: string;
  timezone?: string;
  agenda_highlights?: string;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  registration_deadline?: string | null;
  is_online?: boolean;
  location?: string;
  meeting_link?: string;
  max_attendees?: number | null;
  show_in_community?: boolean;
  enable_registration?: boolean;
  waitlist_enabled?: boolean;
  approval_required?: boolean;
};

function asTime(value?: string | null) {
  return value ? value.slice(0, 5) : "";
}

function asDate(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

export default function CreateEventsPage({ eventId }: Props) {
  const router = useRouter();
  const { upload: uploadBanner, isUploading: isImageUploading } = useCloudinaryUpload("event_cover");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(Boolean(eventId));
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    short_subtitle: "",
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
    enable_registration: true,
    waitlist_enabled: false,
    approval_required: false,
    institutional_name: "",
    host_type: "Individual",
    timezone: "UTC",
    agenda_highlights: "",
    banner_file: null,
    banner_preview_url: "",
  });
  const isEditing = Boolean(eventId);

  useEffect(() => {
    if (!eventId) return;

    let isMounted = true;
    async function fetchEvent() {
      setIsLoadingEvent(true);
      try {
        const res = await api.get<ApiEventDetail>(`/events/${eventId}/`);
        const event = res.data;
        if (!isMounted) return;
        setFormData({
          title: event.title ?? "",
          short_subtitle: event.short_subtitle ?? "",
          short_description: event.short_description ?? "",
          full_description: event.full_description ?? "",
          event_type: event.event_type ?? "webinar",
          start_date: asDate(event.event_date),
          start_time: asTime(event.start_time),
          end_date: asDate(event.registration_deadline),
          end_time: asTime(event.end_time),
          is_online: event.is_online ?? true,
          location: event.location ?? "",
          meeting_link: event.meeting_link ?? "",
          max_attendees: event.max_attendees != null ? String(event.max_attendees) : "",
          status: event.status ?? "published",
          show_in_community: event.show_in_community ?? true,
          enable_registration: event.enable_registration ?? true,
          waitlist_enabled: event.waitlist_enabled ?? false,
          approval_required: event.approval_required ?? false,
          institutional_name: event.host_speaker_name ?? "",
          host_type: "Individual",
          timezone: event.timezone ?? "UTC",
          agenda_highlights: event.agenda_highlights ?? "",
          banner_file: null,
          banner_preview_url: event.cover_image ?? "",
        });
        if (event.cover_image) setBannerImageUrl(event.cover_image);
      } catch {
        toast.error("Failed to load event details.");
      } finally {
        if (isMounted) setIsLoadingEvent(false);
      }
    }

    fetchEvent();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  useEffect(() => {
    return () => {
      if (formData.banner_preview_url.startsWith("blob:")) {
        URL.revokeObjectURL(formData.banner_preview_url);
      }
    };
  }, [formData.banner_preview_url]);

  async function handleFormDataChange(next: CreateEventFormData) {
    const prevBannerFile = formData.banner_file;
    setFormData(next);
    if (next.banner_file && next.banner_file !== prevBannerFile) {
      try {
        const url = await uploadBanner(next.banner_file);
        setBannerImageUrl(url);
      } catch {
        // error handled in hook
      }
    }
  }

  async function submitEvent(status: "draft" | "published" = formData.status as "draft" | "published", data = formData) {
    if (!data.title) {
      toast.error("Event title is required.");
      return;
    }
    if (!data.short_description.trim()) {
      toast.error("Short description is required.");
      return;
    }
    if (!data.start_date || !data.start_time || !data.end_time) {
      toast.error("Event date, start time, and end time are required.");
      return;
    }

    const start = new Date(`${data.start_date}T${data.start_time}`);
    const end = new Date(`${data.start_date}T${data.end_time}`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      toast.error("End time must be after start time.");
      return;
    }
    if (isImageUploading) { toast.error("Image is still uploading, please wait."); return; }

    setIsSubmitting(true);
    try {
      const registrationDeadline = data.end_date ? new Date(`${data.end_date}T00:00:00`).toISOString() : undefined;
      const payload = {
        title: data.title,
        short_subtitle: data.short_subtitle,
        short_description: data.short_description,
        full_description: data.full_description,
        event_type: data.event_type,
        host_speaker_name: data.institutional_name,
        event_date: data.start_date,
        start_time: data.start_time,
        end_time: data.end_time,
        is_online: data.is_online,
        location: data.location,
        meeting_link: data.meeting_link,
        max_attendees: data.max_attendees ? parseInt(data.max_attendees, 10) : undefined,
        timezone: data.timezone,
        agenda_highlights: data.agenda_highlights,
        registration_deadline: registrationDeadline,
        status,
        show_in_community: data.show_in_community,
      };

      const finalPayload = {
        ...payload,
        ...(bannerImageUrl ? { cover_image: bannerImageUrl } : {}),
      };
      if (isEditing) {
        await api.patch(`/events/${eventId}/`, finalPayload);
      } else {
        await api.post("/events/", finalPayload);
      }

      toast.success(
        isEditing
          ? status === "draft"
            ? "Event updated as draft."
            : "Event updated successfully."
          : status === "draft"
            ? "Event saved as draft."
            : "Event created successfully."
      );
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

  function saveDraft() {
    const draftData = { ...formData, status: "draft" };
    setFormData(draftData);
    submitEvent("draft", draftData);
  }

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-2xl font-bold text-[#0A4833]">{isEditing ? "Update Event" : "Create Events"}</h1>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            {isLoadingEvent ? (
              <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">Loading event details...</div>
            ) : (
              <CreateEventFormSections formData={formData} onChange={handleFormDataChange} />
            )}
            <CreateEventActions
              onSubmit={() => submitEvent("published")}
              onSaveDraft={saveDraft}
              isSubmitting={isSubmitting}
              submitLabel={isEditing ? "Update Event" : "Create Event"}
              draftLabel={isEditing ? "Update as Draft" : "Save as Draft"}
            />
          </div>
          <CreateEventPreview formData={formData} />
        </div>
      </div>
    </section>
  );
}
