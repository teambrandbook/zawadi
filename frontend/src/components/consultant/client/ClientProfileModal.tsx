"use client";

import { X } from "lucide-react";
import type { BackendClientItem } from "./clientTypes";
import ClientAvatar from "./ClientAvatar";

type Props = {
  client: BackendClientItem | null;
  onClose: () => void;
};

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[#F9FAFB] p-4">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[#98A2B3]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#101828]">{value}</p>
    </div>
  );
}

export default function ClientProfileModal({ client, onClose }: Props) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#101828]/55 px-4 py-6" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[24px] border border-[#E4E7EC] bg-white shadow-[0_28px_90px_rgba(16,24,40,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EAECF0] px-6 py-5">
          <div className="flex items-center gap-4">
            <ClientAvatar src={client.avatar} name={client.name} size={64} className="h-16 w-16 text-lg" />
            <div>
              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-[#101828]">{client.name}</h2>
              <p className="text-sm text-[#667085]">{`${client.age} years • ${client.gender}`}</p>
              <p className="mt-1 text-sm font-medium text-[#0A4833]">{client.goal}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[#344054] transition hover:bg-[#E5E7EB]"
            aria-label="Close profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-5">
            <section className="rounded-[16px] border border-[#EAECF0] p-5">
              <h3 className="text-lg font-semibold text-[#0A4833]">Profile Overview</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailCard label="Status" value={client.status} />
                <DetailCard label="Diet Preference" value={client.dietPreference} />
                <DetailCard label="Last Consultation" value={client.lastConsultation} />
                <DetailCard label="Next Session" value={client.nextSession} />
                <DetailCard label="Email" value={client.email} />
                <DetailCard label="Phone" value={client.phone} />
              </div>
            </section>

            <section className="rounded-[16px] border border-[#EAECF0] p-5">
              <h3 className="text-lg font-semibold text-[#0A4833]">Health Notes</h3>
              <p className="mt-4 text-sm leading-7 text-[#475467]">{client.healthSummary}</p>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#98A2B3]">Allergies</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {client.allergies.map((item) => (
                    <span key={item} className="rounded-full bg-[#FDF2E9] px-3 py-1 text-xs font-medium text-[#B54708]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-[16px] bg-[#F8FAF8] p-5">
              <h3 className="text-lg font-semibold text-[#0A4833]">Goals & Progress</h3>
              <div className="mt-4 space-y-3 text-sm text-[#344054]">
                <div className="flex items-center justify-between gap-4">
                  <span>Current Weight</span>
                  <span className="font-medium text-[#101828]">{client.currentWeight}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Target Weight</span>
                  <span className="font-medium text-[#101828]">{client.targetWeight}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>BMI</span>
                  <span className="font-medium text-[#101828]">{client.bmi}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Weight Change</span>
                  <span className="font-medium text-[#17914F]">{client.weightLost}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Diet Adherence</span>
                  <span className="font-medium text-[#17914F]">{client.adherence}%</span>
                </div>
              </div>
            </section>

            <section className="rounded-[16px] bg-[#F9F5EF] p-5">
              <h3 className="text-lg font-semibold text-[#0A4833]">Current Plan</h3>
              <p className="mt-4 text-sm font-medium text-[#9E7A41]">{client.planName}</p>
              <p className="mt-1 text-sm text-[#667085]">{client.activeSince}</p>
              <p className="mt-4 text-sm leading-7 text-[#475467]">{client.latestNotes}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
