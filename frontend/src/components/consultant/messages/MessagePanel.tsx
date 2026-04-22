import MessageComposer from "./MessageComposer";
import MessageThread from "./MessageThread";
import MessageThreadHeader from "./MessageThreadHeader";
import type { ConversationItem } from "./messageTypes";

type Props = {
  conversation: ConversationItem;
  draftMessage: string;
  onDraftChange: (value: string) => void;
  onApplyTemplate: (value: string) => void;
  onSendMessage: () => void;
};

export default function MessagePanel({ conversation, draftMessage, onDraftChange, onApplyTemplate, onSendMessage }: Props) {
  return (
    <section className="border border-[#DFDFDF]">
      <MessageThreadHeader conversation={conversation} />
      <MessageThread conversation={conversation} />
      <MessageComposer value={draftMessage} onChange={onDraftChange} onApplyTemplate={onApplyTemplate} onSend={onSendMessage} />
    </section>
  );
}
