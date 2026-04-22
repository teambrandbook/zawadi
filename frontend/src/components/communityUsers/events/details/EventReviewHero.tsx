import Image from "next/image";
import { CalendarDays, Clock3, Video } from "lucide-react";
import { EventReviewData } from "./types";

type Props = {
  event: EventReviewData;
};

export default function EventReviewHero({ event }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div className="relative h-[260px] overflow-hidden bg-[#A3A3A3]">
        <Image src={event.heroImage} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <span className="absolute left-4 top-4 rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {event.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {event.status}
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#0A4833]">{event.title}</h1>
          <p className="mt-3 max-w-[660px] text-base leading-7 text-[#4B5563]">{event.summary}</p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-[#4B5563]">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#0A4833]" />
            {event.date}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#0A4833]" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-2">
            <Video className="h-4 w-4 text-[#0A4833]" />
            {event.mode}
          </span>
        </div>
      </div>
    </section>
  );
}
