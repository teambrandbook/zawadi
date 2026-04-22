"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import CreateNotificationFormSections from "./components/create-notification/CreateNotificationFormSections";
import CreateNotificationLivePreview from "./components/create-notification/CreateNotificationLivePreview";

type NotifFormData = {
  title: string;
  body: string;
  notification_type: string;
  target_role: string;
  status: "DRAFT" | "SENT";
};

export default function CreateNotificationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NotifFormData>({
    title: "",
    body: "",
    notification_type: "SYSTEM",
    target_role: "ALL",
    status: "DRAFT",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof NotifFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(status: "DRAFT" | "SENT") {
    if (!formData.title.trim()) { toast.error("Notification title is required."); return; }
    if (!formData.body.trim()) { toast.error("Notification body is required."); return; }

    setIsSubmitting(true);
    try {
      await api.post("/notifications/", { ...formData, status });
      toast.success(status === "DRAFT" ? "Notification saved as draft." : "Notification sent! ✅");
      router.push("/admindashboard/notifications");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg ?? "Failed to create notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Create Notification</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Compose and deliver announcements, reminders, alerts, and updates to the right audience across the ZEWADI platform.
        </p>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            {/* Form — CreateNotificationFormSections accepts callbacks for key fields */}
            <CreateNotificationFormSections
              title={formData.title}
              onTitleChange={(v) => updateField("title", v)}
              body={formData.body}
              onBodyChange={(v) => updateField("body", v)}
              notificationType={formData.notification_type}
              onTypeChange={(v) => updateField("notification_type", v)}
              targetRole={formData.target_role}
              onTargetRoleChange={(v) => updateField("target_role", v)}
            />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DFDFDF] bg-white p-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("SENT")}
                className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Create Notification"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("DRAFT")}
                className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563] disabled:opacity-50"
              >
                Save as Draft
              </button>
            </div>
          </div>

          <CreateNotificationLivePreview title={formData.title} body={formData.body} />
        </div>
      </div>
    </section>
  );
}
