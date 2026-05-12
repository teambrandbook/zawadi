import CreateEventsPage from "@/components/admindashboard/components/event-management/CreateEventsPage";

type Props = {
  searchParams?: Promise<{
    eventId?: string;
  }>;
};

export default async function AdminCreateEventPage({ searchParams }: Props) {
  const params = await searchParams;
  return <CreateEventsPage eventId={params?.eventId} />;
}
