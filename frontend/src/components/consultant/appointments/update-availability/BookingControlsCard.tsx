import { bookingControls } from "./updateAvailabilityData";

export default function BookingControlsCard() {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#0A4833]">Consultation Booking Controls</h2>

      <div className="mt-4 space-y-3">
        {bookingControls.map((item) => (
          <label key={item.title} className="flex items-center justify-between gap-4 rounded-[8px] bg-[#F1E8D7] px-4 py-4">
            <div>
              <p className="text-sm font-medium text-[#0A4833]">{item.title}</p>
              <p className="mt-1 text-xs text-[#8A8F98]">{item.description}</p>
            </div>
            <span className="relative inline-flex">
              <input type="checkbox" defaultChecked={item.enabled} className="peer sr-only" />
              <span className="h-6 w-11 rounded-full bg-[#D1D5DB] transition peer-checked:bg-[#0A4833]" />
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
