import React from 'react';
import EventsDashboard from '@/components/communityUsers/events/EventsDashboard';
import GuestGate from "@/components/shared/GuestGate";

export default function MyEventsPage() {
  return (
    <GuestGate>
      <EventsDashboard />
    </GuestGate>
  );
}
