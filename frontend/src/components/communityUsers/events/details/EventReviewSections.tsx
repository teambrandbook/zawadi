import Image from "next/image";
import { Video } from "lucide-react";
import { EventReviewData } from "./types";

type Props = {
  event: EventReviewData;
};

const sectionClass =
  "rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

export default function EventReviewSections({ event }: Props) {
  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold text-[#0A4833]">About This Event</h2>
        <div className="mt-5 space-y-5 text-base leading-8 text-[#374151]">
          {event.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold text-[#0A4833]">Session Agenda</h2>
        <div className="mt-5 space-y-4">
          {event.agenda.map((item, index) => (
            <article key={item.title} className="rounded-xl bg-[#EBE1CF] px-4 py-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A4833] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0A4833]">
                    {item.title} ({item.duration})
                  </h3>
                  <p className="mt-1 text-sm text-[#4B5563]">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold text-[#0A4833]">Your Host</h2>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image src={event.host.image} alt={event.host.name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0A4833]">{event.host.name}</h3>
            <p className="mt-1 text-sm font-medium text-[#9F8151]">{event.host.role}</p>
            <p className="mt-3 text-sm leading-7 text-[#4B5563]">{event.host.bio}</p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold text-[#0A4833]">How to Join</h2>
        <div className="mt-5 rounded-xl bg-[#EBE1CF] p-5">
          <div className="flex items-center gap-3 text-[#0A4833]">
            <Video className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{event.joinInfo.title}</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#4B5563]">{event.joinInfo.description}</p>

          <div className="mt-5 space-y-1 text-sm text-[#4B5563]">
            <p>
              <span className="font-semibold">Platform:</span> {event.joinInfo.platform}
            </p>
            <p>
              <span className="font-semibold">Duration:</span> {event.joinInfo.duration}
            </p>
            <p>
              <span className="font-semibold">Recording:</span> {event.joinInfo.recording}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
