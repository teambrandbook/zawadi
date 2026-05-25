"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import CreateNotificationFormSections, {
  type DeliveryChannel,
  type ScheduleMode,
} from "./components/create-notification/CreateNotificationFormSections";
import CreateNotificationLivePreview from "./components/create-notification/CreateNotificationLivePreview";

type NotifFormData = {
  title: string;
  body: string;
  notification_type: string;
  target_role: string;
  delivery_channels: DeliveryChannel[];
  scheduleMode: ScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
};

function getScheduledAt(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}

export default function CreateNotificationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NotifFormData>({
    title: "",
    body: "",
    notification_type: "SYSTEM",
    target_role: "ALL",
    delivery_channels: ["in_app"],
    scheduleMode: "now",
    scheduleDate: "",
    scheduleTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof NotifFormData>(field: K, value: NotifFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!formData.title.trim()) { toast.error("Notification title is required."); return; }
    if (!formData.body.trim()) { toast.error("Notification body is required."); return; }
    if (formData.delivery_channels.length === 0) { toast.error("Select at least one delivery channel."); return; }
    if (formData.scheduleMode === "later" && (!formData.scheduleDate || !formData.scheduleTime)) {
      toast.error("Schedule date and time are required.");
      return;
    }

    const status = formData.scheduleMode === "later" ? "SCHEDULED" : "SENT";
    const scheduled_at = formData.scheduleMode === "later"
      ? getScheduledAt(formData.scheduleDate, formData.scheduleTime)
      : null;

    setIsSubmitting(true);
    try {
      await api.post("/notifications/", {
        title: formData.title,
        body: formData.body,
        notification_type: formData.notification_type,
        target_role: formData.target_role,
        delivery_channels: formData.delivery_channels,
        status,
        scheduled_at,
      });
      toast.success(status === "SCHEDULED" ? "Notification scheduled." : "Notification sent.");
      router.push("/admindashboard/notifications");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } })?.response?.data;
      const msg =
        typeof data === "object" && data !== null && "detail" in data
          ? String((data as { detail?: string }).detail)
          : "Failed to create notification. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Create Notification</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Compose and deliver in-app and email notifications to the right audience across the ZEWADI platform.
        </p>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <CreateNotificationFormSections
              title={formData.title}
              onTitleChange={(value) => updateField("title", value)}
              body={formData.body}
              onBodyChange={(value) => updateField("body", value)}
              notificationType={formData.notification_type}
              onTypeChange={(value) => updateField("notification_type", value)}
              targetRole={formData.target_role}
              onTargetRoleChange={(value) => updateField("target_role", value)}
              deliveryChannels={formData.delivery_channels}
              onDeliveryChannelsChange={(value) => updateField("delivery_channels", value)}
              scheduleMode={formData.scheduleMode}
              onScheduleModeChange={(value) => updateField("scheduleMode", value)}
              scheduleDate={formData.scheduleDate}
              onScheduleDateChange={(value) => updateField("scheduleDate", value)}
              scheduleTime={formData.scheduleTime}
              onScheduleTimeChange={(value) => updateField("scheduleTime", value)}
            />

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DFDFDF] bg-white p-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white disabled:opacity-50"
              >
                {isSubmitting
                  ? formData.scheduleMode === "later" ? "Scheduling..." : "Sending..."
                  : formData.scheduleMode === "later" ? "Schedule Notification" : "Send Notification"}
              </button>
            </div>
          </div>

          <CreateNotificationLivePreview
            title={formData.title}
            body={formData.body}
            channels={formData.delivery_channels}
          />
        </div>
      </div>
    </section>
  );
}
