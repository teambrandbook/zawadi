"use client";

import { Paperclip, Send } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onApplyTemplate: (value: string) => void;
  onSend: () => void;
};

const templates = [
  "📅 Consultation Reminder",
  "📋 Diet Plan Shared",
  "💬 Check-in Message",
  "📝 Follow-up Note",
];

export default function MessageComposer({ value, onChange, onApplyTemplate, onSend }: Props) {
  return (
    <div className="border-t border-[#DFDFDF] bg-white px-4 py-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template}
            type="button"
            onClick={() => onApplyTemplate(template)}
            className="rounded-full bg-[#EBE1CF] px-3 py-1.5 text-xs text-[#0A4833] transition hover:bg-[#E1D4BC]"
          >
            {template}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-3">
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-[#0A4833] transition hover:text-[#083727]" aria-label="Attach file">
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type your message..."
          className="min-h-[72px] flex-1 resize-none rounded-[8px] border border-[#DFDFDF] bg-white px-4 py-3 text-sm text-[#344054] outline-none placeholder:text-[#98A2B3]"
        />

        <button
          type="button"
          onClick={onSend}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0A4833] text-white transition hover:bg-[#083727]"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
