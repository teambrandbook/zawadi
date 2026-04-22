import Image from "next/image";
import { FileText } from "lucide-react";
import type { ConversationItem, MessageItem } from "./messageTypes";

type Props = {
  message: MessageItem;
  clientAvatar: ConversationItem["clientAvatar"];
};

export default function MessageBubble({ message, clientAvatar }: Props) {
  if (message.sender === "system") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[448px] rounded-[8px] bg-[#A38355] px-4 py-3 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {message.title ? <p className="text-sm font-semibold">{`📋 ${message.title}`}</p> : null}
          <p className="mt-3 text-sm leading-6">{message.text}</p>
          <p className="mt-3 text-right text-xs text-[#F8EEDC]">{message.time}</p>
        </div>
      </div>
    );
  }

  if (message.sender === "consultant") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[448px]">
          <div className="rounded-[8px] bg-[#0A4833] px-4 py-3 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-sm leading-6">{message.text}</p>
          </div>
          <p className="mt-2 text-right text-xs text-[#6B7280]">{message.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 overflow-hidden rounded-full bg-[#E5E7EB]">
        <Image src={clientAvatar} alt="" width={32} height={32} className="h-full w-full object-cover" />
      </div>
      <div className="max-w-[448px]">
        <div className="rounded-[8px] bg-white px-4 py-3 text-[#0A4833] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <p className="text-sm leading-6">{message.text}</p>

          {message.attachment ? (
            <div className="mt-3 flex items-center gap-2 rounded-[4px] border border-[#E5E7EB] bg-[#EBE1CF] px-3 py-2">
              <FileText className="h-4 w-4 text-[#EF4444]" />
              <span className="text-sm">{message.attachment.name}</span>
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-[#6B7280]">{message.time}</p>
      </div>
    </div>
  );
}
