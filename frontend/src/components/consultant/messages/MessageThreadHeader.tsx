import Image from "next/image";
import { MoreVertical, Phone, Video } from "lucide-react";
import type { ConversationItem } from "./messageTypes";

type Props = {
  conversation: ConversationItem;
};

export default function MessageThreadHeader({ conversation }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-[#DFDFDF] bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-[#E5E7EB]">
          <Image src={conversation.clientAvatar} alt={conversation.clientName} width={40} height={40} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-base font-semibold text-[#0A4833]">{conversation.clientName}</p>
          <p className="text-sm text-[#6B7280]">{conversation.activeStatus}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[#0A4833]">
        <button type="button" className="transition hover:text-[#083727]" aria-label="Call client">
          <Phone className="h-4 w-4" />
        </button>
        <button type="button" className="transition hover:text-[#083727]" aria-label="Start video call">
          <Video className="h-4 w-4" />
        </button>
        <button type="button" className="transition hover:text-[#083727]" aria-label="More options">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
