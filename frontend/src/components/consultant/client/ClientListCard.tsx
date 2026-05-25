"use client";

import { Eye, MessageSquare, SquarePen } from "lucide-react";
import { cn } from "@/utils/cn";
import type { BackendClientItem } from "./clientTypes";
import ClientAvatar from "./ClientAvatar";

type Props = {
  client: BackendClientItem;
  isSelected: boolean;
  onSelect: (client: BackendClientItem) => void;
  onOpenProfile: (client: BackendClientItem) => void;
};

const statusTone: Record<BackendClientItem["status"], string> = {
  Active: "text-[#17914F]",
  "Follow-up Due": "text-[#C47A1B]",
  "High Priority": "text-[#D92D20]",
  New: "text-[#1570EF]",
};

export default function ClientListCard({ client, isSelected, onSelect, onOpenProfile }: Props) {
  return (
    <article
      onClick={() => onSelect(client)}
      className={cn(
        "cursor-pointer rounded-[14px] border bg-white transition shadow-[0_8px_24px_rgba(16,24,40,0.04)]",
        isSelected ? "border-[#0A4833] ring-1 ring-[#0A4833]/15" : "border-[#E4E7EC] hover:border-[#BFC8C2]"
      )}
    >
      <div className="flex flex-col gap-5 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClientAvatar src={client.avatar} name={client.name} size={44} className="h-11 w-11 text-sm" />
            <div>
              <h3 className="text-base font-semibold text-[#101828]">{client.name}</h3>
              <p className="text-sm text-[#667085]">{`${client.age} years • ${client.gender}`}</p>
            </div>
          </div>

          <span className={cn("text-xs font-medium", statusTone[client.status])}>{client.status}</span>
        </div>

        <div className="grid gap-4 text-sm text-[#344054] sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-[#98A2B3]">Wellness Goal</p>
              <p className="font-medium text-[#101828]">{client.goal}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#98A2B3]">Allergies</p>
              <p className="font-medium text-[#101828]">{client.allergies.join(", ")}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-[#98A2B3]">Diet Preference</p>
              <p className="font-medium text-[#101828]">{client.dietPreference}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#98A2B3]">Last Consultation</p>
              <p className="font-medium text-[#101828]">{client.lastConsultation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#EAECF0] pt-3">
          <p className="text-xs text-[#B38744]">{client.planName}</p>

          <div className="flex items-center gap-3 text-[#475467]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenProfile(client);
              }}
              className="transition hover:text-[#0A4833]"
              aria-label={`View full details for ${client.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button type="button" onClick={(event) => event.stopPropagation()} className="transition hover:text-[#0A4833]" aria-label={`Open notes for ${client.name}`}>
              <SquarePen className="h-4 w-4" />
            </button>
            <button type="button" onClick={(event) => event.stopPropagation()} className="transition hover:text-[#0A4833]" aria-label={`Message ${client.name}`}>
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
