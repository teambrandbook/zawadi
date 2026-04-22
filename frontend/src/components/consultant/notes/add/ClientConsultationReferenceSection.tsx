"use client";

import Image from "next/image";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { AddNoteFormState, NoteClientOption } from "./formTypes";

type Props = {
  clients: NoteClientOption[];
  selectedClient: NoteClientOption | undefined;
  form: AddNoteFormState;
  onFieldChange: <K extends keyof AddNoteFormState>(field: K, value: AddNoteFormState[K]) => void;
};

export default function ClientConsultationReferenceSection({ clients, selectedClient, form, onFieldChange }: Props) {
  const [searchValue, setSearchValue] = useState(selectedClient?.name ?? "");

  useEffect(() => {
    setSearchValue(selectedClient?.name ?? "");
  }, [selectedClient]);

  function handleClientSearch(value: string) {
    setSearchValue(value);

    const matchedClient = clients.find((client) => client.name.toLowerCase() === value.trim().toLowerCase());

    if (matchedClient) {
      onFieldChange("userId", matchedClient.id);
    }
  }

  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-[#0A4833]" />
        <h2 className="text-lg font-semibold text-[#0A4833]">Client &amp; Consultation Reference</h2>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Search or Select Client</label>
          <div className="relative">
            <input
              list="consultant-note-clients"
              value={searchValue}
              onChange={(event) => handleClientSearch(event.target.value)}
              placeholder="Type client name..."
              className="h-12 w-full rounded-[8px] border border-[#DFDFDF] bg-[#EBE1CF] px-4 pr-10 text-sm text-[#111827] outline-none placeholder:text-[#6B7280]"
            />
            <datalist id="consultant-note-clients">
              {clients.map((client) => (
                <option key={client.id} value={client.name} />
              ))}
            </datalist>
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A88751]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Consultation ID</label>
          <div className="flex h-12 items-center rounded-[8px] border border-[#DFDFDF] bg-[#DFDFDF] px-4 text-sm text-[#4B5563]">
            {selectedClient?.consultationId ?? ""}
          </div>
        </div>
      </div>

      {selectedClient ? (
        <div className="mt-4 rounded-[8px] bg-[#EBE1CF] p-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white">
                <Image src={selectedClient.avatar} alt={selectedClient.name} width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A4833]">{selectedClient.name}</p>
                <p className="text-xs text-[#6B7280]">{selectedClient.wellnessGoal}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280]">Session Date</p>
              <p className="mt-1 text-sm text-[#111827]">{selectedClient.sessionDate}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280]">Session Mode</p>
              <p className="mt-1 text-sm text-[#111827]">{selectedClient.sessionMode}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280]">Follow-up Section</p>
              <p className="mt-1 text-sm text-[#111827]">{selectedClient.focusArea}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
