import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompactEventCard, UpcomingCard } from "@/components/events/EventPrimitives";
import { upcomingPrimary, upcomingSecondary } from "@/components/events/eventsData";

export default function UpcomingEvents() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-[34px] tracking-[-0.02em] text-[#0e2207] md:text-[45px] fade-in">
              Upcoming Events
            </h2>
            <p className="mt-3 max-w-[900px] font-sans text-[15px] leading-7 text-black md:text-[16px] md:leading-[30px] fade-in">
              There&apos;s always something happening at Zewadi. From small, thoughtful
              gatherings to special experiences, each event is a chance to connect,
              explore, and be part of something more. Take a look at what&apos;s coming
              up and join us whenever it feels right.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-[54px] w-[220px] items-center justify-between rounded-full bg-[#1A4331]/95 px-2 pl-4 font-sans text-[14px] font-semibold text-white transition hover:bg-[#174b05]"
          >
            <span>Join the event</span>

            <span className="inline-flex h-10 w-10 items-center ml-11 justify-center rounded-full bg-white text-[#1f6306]">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr_424px]">
          {upcomingPrimary.map((event) => (
            <UpcomingCard key={event.title} {...event} />
          ))}
          <div className=" grid gap-6">
            {upcomingSecondary.map((event) => (
              <CompactEventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
