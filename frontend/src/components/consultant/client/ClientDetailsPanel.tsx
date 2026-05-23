"use client";

import type { BackendClientItem } from "./clientTypes";
import ClientAvatar from "./ClientAvatar";

type Props = {
  client: BackendClientItem;
  onOpenProfile: (client: BackendClientItem) => void;
};

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div className="h-full rounded-full bg-[linear-gradient(90deg,#0A4833_0%,#6AA67E_100%)]" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ClientDetailsPanel({ client, onOpenProfile }: Props) {
  return (
    <aside className="h-fit rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_12px_30px_rgba(16,24,40,0.06)] xl:sticky xl:top-6">
      <div className="border-b border-[#EAECF0] pb-5 text-center">
        <ClientAvatar src={client.avatar} name={client.name} size={64} className="mx-auto h-16 w-16 text-lg ring-4 ring-[#F4F7F5]" />
        <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-[#101828]">{client.name}</h2>
        <p className="text-sm text-[#667085]">{`${client.age} years • ${client.gender}`}</p>
        <p className="mt-2 text-sm font-medium text-[#17914F]">{client.status}</p>
      </div>

      <div className="space-y-5 py-5">
        <section>
          <h3 className="text-sm font-semibold text-[#0A4833]">Health Summary</h3>
          <div className="mt-3 space-y-3 text-sm text-[#344054]">
            <div className="flex items-center justify-between gap-4">
              <span>Current Weight:</span>
              <span className="font-medium text-[#101828]">{client.currentWeight}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Target Weight:</span>
              <span className="font-medium text-[#101828]">{client.targetWeight}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>BMI:</span>
              <span className="font-medium text-[#101828]">{client.bmi}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#0A4833]">Current Diet Plan</h3>
          <div className="mt-3 rounded-[10px] bg-[#F7F4EE] px-4 py-3 text-sm text-[#344054]">
            <p className="font-medium text-[#9E7A41]">{client.planName}</p>
            <p className="mt-1 text-xs text-[#667085]">{client.activeSince}</p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#0A4833]">Latest Notes</h3>
          <div className="mt-3 rounded-[10px] bg-[#F9FAFB] px-4 py-3 text-sm leading-6 text-[#475467]">{client.latestNotes}</div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#0A4833]">Progress Snapshot</h3>
          <div className="mt-3 space-y-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[#667085]">Weight Lost:</span>
              <span className="font-medium text-[#17914F]">{client.weightLost}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#667085]">Diet Adherence:</span>
                <span className="font-medium text-[#17914F]">{client.adherence}%</span>
              </div>
              <ProgressBar value={client.adherence} />
            </div>
            <p className="text-xs text-[#667085]">{client.progressSummary}</p>
          </div>
        </section>
      </div>

      <div className="space-y-3">
        <button type="button" className="h-10 w-full rounded-[10px] bg-[#0A4833] text-sm font-medium text-white transition hover:bg-[#083727]">
          Schedule Consultation
        </button>
        <button type="button" className="h-10 w-full rounded-[10px] bg-[#B48A4A] text-sm font-medium text-white transition hover:bg-[#9D753B]">
          Update Diet Plan
        </button>
        <button
          type="button"
          onClick={() => onOpenProfile(client)}
          className="h-10 w-full rounded-[10px] border border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
        >
          View Full Profile
        </button>
      </div>
    </aside>
  );
}
