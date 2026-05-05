import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";

export function EventLink({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-sans text-[13px] font-semibold ${dark
          ? "text-[#afb8ac]"
          : "text-[#7d8978] transition-colors duration-300 group-hover:text-[#afb8ac]"
        }`}
    >
      <span>More Details</span>
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${dark
            ? "bg-[#ffcd1e] text-[#0e2207]"
            : "bg-white text-[#1f6306] transition-colors duration-300 group-hover:bg-[#ffcd1e] group-hover:text-[#0e2207]"
          }`}
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

export function DateBadge({
  day,
  month,
  inverse = false,
}: {
  day: string;
  month: string;
  inverse?: boolean;
}) {
  return (
    <div
      className={`flex h-[58px] w-[62px] flex-col items-center justify-center rounded-[8px] ${inverse
          ? "bg-white text-[#0e2207]"
          : "bg-[#1A4331] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#0e2207]"
        }`}
    >
      <span className="font-sans text-[22px] font-bold leading-none">
        {day}
      </span>
      <span className="mt-1 font-sans text-[13px] font-semibold leading-none">
        {month}
      </span>
    </div>
  );
}

export function UpcomingCard({
  title,
  date,
  month,
  image,
  description,
}: {
  title: string;
  date: string;
  month: string;
  image: string;
  description?: string;
}) {
  return (
    <article className="group relative h-[450px] w-full overflow-hidden rounded-[20px]">
      {/* Background Image */}
      <div className="image-topdown absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Card Overlay */}
      <div className="zoom-item upcoming-zoom-item absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div
          className="relative rounded-[15px] bg-white p-6 shadow-xl transition-colors duration-300 group-hover:bg-[#1A4331]/95 group-hover:backdrop-blur-sm"
        >
          {/* Floating Date Badge */}
          <div className="absolute -top-6 left-6">
            <DateBadge day={date} month={month} />
          </div>

          <div className="mt-4">
            <h3
              className="text-[20px] font-bold leading-tight text-[#0e2207] transition-colors duration-300 group-hover:text-white"
            >
              {title}
            </h3>

            {description && (
              <p
                className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-400"
              >
                {description}
              </p>
            )}

            <div className="mt-5">
              <EventLink />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CompactEventCard({
  title,
  date,
  month,
}: {
  title: string;
  date: string;
  month: string;
}) {
  return (
    <article className="zoom-item upcoming-zoom-item relative mt-8 rounded-[10px] bg-[#f1f4eb] px-6 pb-6 pt-10">
      {/* Positioning the DateBadge to overlap the top border */}
      <div className="absolute -top-6 left-6">
        <DateBadge day={date} month={month} />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="max-w-[240px] text-[20px] font-bold leading-tight text-[#0e2207]">
          {title}
        </h3>

        <div className="flex items-center">
          <EventLink />
        </div>
      </div>
    </article>
  );
}
