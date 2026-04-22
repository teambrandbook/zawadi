"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ConversationSearch({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search conversations..."
        className="h-11 w-full rounded-[8px] border border-[#DFDFDF] bg-white pl-10 pr-4 text-sm text-[#344054] outline-none placeholder:text-[#98A2B3]"
      />
    </div>
  );
}
