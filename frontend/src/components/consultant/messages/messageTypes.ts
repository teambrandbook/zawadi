export type ConversationTag = "Diet Plan" | "Follow-up" | "Check-in" | "Consultation";

export type ConversationFilter = "All" | "Unread" | "Priority";

export type MessageAttachment = {
  id: string;
  name: string;
};

export type MessageItem = {
  id: string;
  sender: "client" | "consultant" | "system";
  text: string;
  time: string;
  title?: string;
  attachment?: MessageAttachment;
};

export type ConversationItem = {
  id: string;
  clientName: string;
  clientAvatar: string;
  activeStatus: string;
  preview: string;
  updatedAt: string;
  tag: ConversationTag;
  unreadCount?: number;
  priorityFlag?: string;
  messages: MessageItem[];
};
