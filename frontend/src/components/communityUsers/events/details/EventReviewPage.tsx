import EventReviewHero from "./EventReviewHero";
import EventReviewSections from "./EventReviewSections";
import EventReviewSidebar from "./EventReviewSidebar";
import { EventReviewData } from "./types";

type Props = {
  event: EventReviewData;
};

export default function EventReviewPage({ event }: Props) {
  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <EventReviewHero event={event} />
            <EventReviewSections event={event} />
          </div>
          <EventReviewSidebar event={event} />
        </div>
      </div>
    </section>
  );
}
