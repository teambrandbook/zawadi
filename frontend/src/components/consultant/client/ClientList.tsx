"use client";

import ClientListCard from "./ClientListCard";
import type { BackendClientItem } from "./clientTypes";

type Props = {
  clients: BackendClientItem[];
  selectedClientId: string;
  onSelect: (client: BackendClientItem) => void;
  onOpenProfile: (client: BackendClientItem) => void;
  visibleCount: number;
  onLoadMore: () => void;
};

export default function ClientList({ clients, selectedClientId, onSelect, onOpenProfile, visibleCount, onLoadMore }: Props) {
  const visibleClients = clients.slice(0, visibleCount);
  const hasMore = clients.length > visibleCount;

  return (
    <section className="space-y-4">
      {visibleClients.map((client) => (
        <ClientListCard
          key={client.id}
          client={client}
          isSelected={selectedClientId === client.id}
          onSelect={onSelect}
          onOpenProfile={onOpenProfile}
        />
      ))}

      {clients.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#D0D5DD] bg-white px-5 py-10 text-center text-sm text-[#667085]">
          No clients match the current filters.
        </div>
      ) : null}

      {hasMore ? (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[#0A4833] px-5 text-sm font-medium text-white transition hover:bg-[#083727]"
          >
            Load More Clients
          </button>
        </div>
      ) : null}
    </section>
  );
}
