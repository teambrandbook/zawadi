"use client";

import ConversationFilters from "./ConversationFilters";
import ConversationListItem from "./ConversationListItem";
import ConversationSearch from "./ConversationSearch";
import type { ConversationFilter, ConversationItem } from "./messageTypes";

type Props = {
  conversations: ConversationItem[];
  selectedConversationId: string;
  searchValue: string;
  activeFilter: ConversationFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: ConversationFilter) => void;
  onSelectConversation: (conversationId: string) => void;
};

export default function ConversationSidebar({
  conversations,
  selectedConversationId,
  searchValue,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onSelectConversation,
}: Props) {
  return (
    <aside className="border border-[#DFDFDF] bg-white">
      <div className="border-b border-[#DFDFDF] p-4">
        <ConversationSearch value={searchValue} onChange={onSearchChange} />
        <ConversationFilters activeFilter={activeFilter} onFilterChange={onFilterChange} />
      </div>

      <div className="max-h-[720px] overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
}
