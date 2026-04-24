"use client";

import Image from "next/image";
import type { ConversationItem } from "./messageTypes";

type Props = {
  conversation: ConversationItem;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
};

function tagTone(tag: ConversationItem["tag"]) {
  if (tag === "Diet Plan") return "text-[#A38355]";
  if (tag === "Follow-up") return "text-[#0A4833]";
  if (tag === "Check-in") return "text-[#16A34A]";
  return "text-[#2563EB]";
}

export default function ConversationListItem({ conversation, isSelected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`w-full border-b border-[#DFDFDF] px-4 py-4 text-left transition ${
        isSelected ? "bg-[rgba(235,225,207,0.55)]" : "bg-white hover:bg-[#FAFAF8]"
      }`}
    >
      <div className="flex gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#E5E7EB]">
          <Image src={conversation.clientAvatar} alt={conversation.clientName} width={48} height={48} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-base font-medium text-[#0A4833]">{conversation.clientName}</p>
            <span className="shrink-0 text-xs text-[#6B7280]">{conversation.updatedAt}</span>
          </div>

          <p className="mt-1 truncate text-sm text-[#4B5563]">{conversation.preview}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`text-xs ${tagTone(conversation.tag)}`}>{conversation.tag}</span>
            {conversation.unreadCount ? (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] text-white ${
                  conversation.tag === "Consultation" ? "bg-[#EF4444]" : "bg-[#A38355]"
                }`}
              >
                {conversation.tag === "Consultation" ? "!" : conversation.unreadCount}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
