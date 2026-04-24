"use client";

import { useState } from "react";
import ConversationSidebar from "./ConversationSidebar";
import { backendConversations } from "./messageData";
import MessagePanel from "./MessagePanel";
import MessagesPageHeader from "./MessagesPageHeader";
import type { ConversationFilter } from "./messageTypes";

export default function ConsultantMessagesPage() {
  const [conversationsFromBackend, setConversationsFromBackend] = useState(backendConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(conversationsFromBackend[0]?.id ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("All");
  const [draftMessage, setDraftMessage] = useState("");

  const filteredConversations = conversationsFromBackend.filter((conversation) => {
    const matchesSearch =
      searchValue.trim().length === 0 ||
      conversation.clientName.toLowerCase().includes(searchValue.toLowerCase()) ||
      conversation.preview.toLowerCase().includes(searchValue.toLowerCase()) ||
      conversation.tag.toLowerCase().includes(searchValue.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Unread" && Boolean(conversation.unreadCount)) ||
      (activeFilter === "Priority" && conversation.priorityFlag === "priority");

    return matchesSearch && matchesFilter;
  });

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedConversationId) ?? filteredConversations[0] ?? conversationsFromBackend[0];

  function handleSendMessage() {
    if (!draftMessage.trim() || !selectedConversation) return;

    setConversationsFromBackend((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              preview: draftMessage.trim(),
              updatedAt: "Just now",
              messages: [
                ...conversation.messages,
                {
                  id: `${conversation.id}-${Date.now()}`,
                  sender: "consultant",
                  text: draftMessage.trim(),
                  time: "Just now",
                },
              ],
            }
          : conversation
      )
    );
    setDraftMessage("");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1240px] space-y-4">
        <MessagesPageHeader />

        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ConversationSidebar
            conversations={filteredConversations}
            selectedConversationId={selectedConversation?.id ?? ""}
            searchValue={searchValue}
            activeFilter={activeFilter}
            onSearchChange={setSearchValue}
            onFilterChange={setActiveFilter}
            onSelectConversation={setSelectedConversationId}
          />

          {selectedConversation ? (
            <MessagePanel
              conversation={selectedConversation}
              draftMessage={draftMessage}
              onDraftChange={setDraftMessage}
              onApplyTemplate={setDraftMessage}
              onSendMessage={handleSendMessage}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
