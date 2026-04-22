import { Eye, Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { BlockedDate, VisibilityControl } from "./profileTypes";

type Props = {
  controls: VisibilityControl[];
  blockedDates: BlockedDate[];
  onToggleControl: (controlId: string) => void;
};

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full transition",
        enabled ? "bg-[#A38355]" : "bg-[#E5E7EB]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
          enabled ? "left-[22px]" : "left-0.5",
        )}
      />
    </span>
  );
}

export default function VisibilityControlsCard({ controls, blockedDates, onToggleControl }: Props) {
  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <Eye className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Visibility Controls</h2>
      </div>

      <div className="mt-5 space-y-5">
        {controls.map((control) => (
          <article key={control.title} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-[#111827]">{control.title}</p>
              <p className="mt-1 text-sm text-[#6B7280]">{control.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggleControl(control.id)}
              className="shrink-0"
              aria-pressed={control.enabled}
              aria-label={control.title}
            >
              <Toggle enabled={control.enabled} />
            </button>
          </article>
        ))}
      </div>

      <div className="mt-6 border-t border-[#F0ECE5] pt-6">
        <h3 className="text-[15px] font-medium text-[#111827]">Blocked Dates</h3>

        <div className="mt-4 space-y-2">
          {blockedDates.map((item) => (
            <article
              key={item.label}
              className="flex items-center justify-between rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-3"
            >
              <span className="text-sm text-[#B91C1C]">{item.label}</span>
              <button type="button" className="text-[#DC2626] transition hover:text-[#B91C1C]" aria-label={`Remove blocked date ${item.label}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#EEE7DA] bg-white text-sm text-[#6B7280] transition hover:border-[#D6C6AA] hover:text-[#4B5563]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Blocked Date</span>
          </button>
        </div>
      </div>
    </section>
  );
}
