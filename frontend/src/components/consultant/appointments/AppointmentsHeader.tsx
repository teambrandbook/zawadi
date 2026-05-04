import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Search } from "lucide-react";

export default function AppointmentsHeader() {
  return (
    <section className="py-4 flex flex-col gap-4">

      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}
        <div>
          <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-[#0A4833]">
            Appointments
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">

          {/* Date Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">

            <button
              type="button"
              className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#A38355] px-3 text-sm font-medium text-white hover:bg-[#8e7149]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Today</span>
            </button>

            <span className="text-sm font-medium text-[#344054] whitespace-nowrap">
              March 15, 2024
            </span>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#A38355] text-white hover:bg-[#8e7149]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="h-10 w-full rounded-[10px] border border-[#E4E7EC] bg-white pl-10 pr-3 text-sm text-[#344054] outline-none focus:ring-1 focus:ring-[#0A4833]/20"
            />
          </div>

          {/* Button */}
          <Link
            href="/consultant/appointments/update-availability"
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-10 px-4 rounded-[10px] bg-[#0A4833] text-sm font-medium text-white hover:bg-[#083727]"
          >
            <Clock3 className="h-4 w-4" />
            <span>Update Availability</span>
          </Link>

        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#667085]">
        Manage your schedule, track sessions, and organize consultation availability efficiently.
      </p>

    </section>
  );
}
