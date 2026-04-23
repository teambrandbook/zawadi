import { Lightbulb } from "lucide-react";

export default function AvailabilitySuggestionCard() {
  return (
    <section className="rounded-[12px] border border-[#A38355] bg-[rgba(163,131,85,0.08)] px-5 py-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-4 w-4 text-[#A38355]" />
        <div>
          <h2 className="text-sm font-semibold text-[#0A4833]">Smart Availability Suggestion</h2>
          <p className="mt-1 text-sm leading-6 text-[#475467]">
            Your Thursday afternoon slots have high demand. Consider adding more slots between 2-5 PM to maximize bookings.
          </p>
        </div>
      </div>
    </section>
  );
}
