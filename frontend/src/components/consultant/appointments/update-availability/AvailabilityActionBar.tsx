import Link from "next/link";

export default function AvailabilityActionBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/consultant/appointments?status=saved"
        className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#0A4833] px-6 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(10,72,51,0.18)] transition hover:bg-[#083727]"
      >
        Save Availability
      </Link>

      <Link
        href="/consultant/appointments?status=draft"
        className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#A38355] px-6 text-sm font-medium text-white transition hover:bg-[#8E7149]"
      >
        Save as Draft
      </Link>

      <Link
        href="/consultant/appointments/update-availability?preview=true#weekly-availability"
        className="inline-flex h-12 items-center justify-center rounded-[8px] border-2 border-[#0A4833] bg-white px-6 text-sm font-medium text-[#0A4833] transition hover:bg-[#F7FBF9]"
      >
        Preview Schedule
      </Link>

      <Link href="/consultant/appointments" className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-[#4B5563] transition hover:text-[#0A4833]">
        Cancel
      </Link>
    </div>
  );
}
