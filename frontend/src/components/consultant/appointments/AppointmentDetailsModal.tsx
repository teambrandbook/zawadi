"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { ScheduleItem } from "./appointmentsData";

type Props = {
  appointment: ScheduleItem | null;
  onClose: () => void;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[#F9FAFB] p-4">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[#98A2B3]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#101828]">{value}</p>
    </div>
  );
}

export default function AppointmentDetailsModal({ appointment, onClose }: Props) {
  if (!appointment || appointment.isEmpty) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#101828]/55 px-4 py-6" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-[#E4E7EC] bg-white shadow-[0_28px_90px_rgba(16,24,40,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EAECF0] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-[#E5E7EB]">
              <Image src={appointment.avatar} alt={appointment.name} width={56} height={56} className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#101828]">{appointment.name}</h2>
              <p className="text-sm text-[#667085]">{appointment.type}</p>
              <p className="mt-1 text-sm font-medium text-[#0A4833]">{appointment.status}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[#344054] transition hover:bg-[#E5E7EB]"
            aria-label="Close appointment details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <section className="rounded-[16px] border border-[#EAECF0] p-5">
            <h3 className="text-lg font-semibold text-[#0A4833]">Appointment Details</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailRow label="Date" value={appointment.date} />
              <DetailRow label="Time" value={`${appointment.time} • ${appointment.duration}`} />
              <DetailRow label="Consultation Mode" value={appointment.consultationMode} />
              <DetailRow label="Consultant" value={appointment.consultant} />
              <DetailRow label="Focus Area" value={appointment.focus} />
              <DetailRow label="Tags" value={appointment.meta.length ? appointment.meta.join(", ") : "No tags"} />
            </div>
          </section>

          <section className="rounded-[16px] bg-[#F9F5EF] p-5">
            <h3 className="text-lg font-semibold text-[#0A4833]">Session Notes</h3>
            <p className="mt-4 text-sm leading-7 text-[#475467]">{appointment.notes}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
