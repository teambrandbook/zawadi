import Image from "next/image";
import { Video } from "lucide-react";

export default function NextAppointmentCard() {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <h2 className="text-base font-semibold text-[#0A4833]">Next Appointment</h2>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#E5E7EB]">
          <Image src="/recipe/recipe-3.webp" alt="Michael Thompson" width={48} height={48} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#101828]">Michael Thompson</p>
          <p className="text-xs text-[#667085]">Weight Management</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-[12px] bg-[#F9FAFB] p-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#98A2B3]">Starting In</p>
          <p className="mt-1 text-sm font-medium text-[#101828]">25 minutes</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#98A2B3]">Session Time</p>
          <p className="mt-1 text-sm font-medium text-[#0A4833]">9:00 AM - 10:00 AM</p>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0A4833] text-sm font-medium text-white transition hover:bg-[#083727]"
      >
        <Video className="h-4 w-4" />
        <span>Join Session</span>
      </button>
    </section>
  );
}
