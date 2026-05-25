import Link from "next/link";

type AvailabilityItem = {
  day: string;
  start_time: string;
  end_time: string;
};

type Props = {
  availability: AvailabilityItem[];
};

function formatDay(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(value: string) {
  const [hourValue, minuteValue] = value.split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function QuickAvailabilityCard({ availability }: Props) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <h2 className="text-base font-semibold text-[#0A4833]">Quick Availability</h2>

      <div className="mt-5 space-y-3">
        {availability.length === 0 ? (
          <p className="text-sm text-[#667085]">No availability added yet.</p>
        ) : null}

        {availability.map((item) => (
          <div key={`${item.day}-${item.start_time}`} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#667085]">{formatDay(item.day)}</span>
            <span className="font-medium text-[#0A4833]">{`${formatTime(item.start_time)} - ${formatTime(item.end_time)}`}</span>
          </div>
        ))}
      </div>

      <Link
        href="/consultant/appointments/update-availability"
        className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[#A7C4B8] bg-white text-sm font-medium text-[#0A4833] transition hover:bg-[#F6FBF8]"
      >
        Update Schedule
      </Link>
    </section>
  );
}
