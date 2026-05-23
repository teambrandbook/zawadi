import { notFound } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import PublicEventDetailPage, { type PublicEventDetail } from "@/components/events/PublicEventDetailPage";
import { API_BASE_URL } from "@/lib/config";

type EventResponse =
  | PublicEventDetail
  | {
      data?: PublicEventDetail;
    };

function eventFromResponse(payload: EventResponse): PublicEventDetail | undefined {
  if ("id" in payload) return payload;
  return payload.data;
}

async function getEvent(eventId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/`, {
      cache: "no-store",
    });

    if (!response.ok) return undefined;

    const payload = (await response.json()) as EventResponse;
    return eventFromResponse(payload);
  } catch {
    return undefined;
  }
}

export default async function PublicEventDetailRoute({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) notFound();

  return (
    <div>
      <Navbar />
      <PublicEventDetailPage event={event} />
      <Footer />
    </div>
  );
}
