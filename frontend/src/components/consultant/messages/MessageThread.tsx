import MessageBubble from "./MessageBubble";
import type { ConversationItem } from "./messageTypes";

type Props = {
  conversation: ConversationItem;
};

export default function MessageThread({ conversation }: Props) {
  return (
    <div className="min-h-[560px] flex-1 bg-[#FAF9F6] px-5 py-4">
      <p className="mb-4 text-center text-xs text-[#6B7280]">Today</p>
      <div className="space-y-6">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} clientAvatar={conversation.clientAvatar} />
        ))}
      </div>
    </div>
  );
}
