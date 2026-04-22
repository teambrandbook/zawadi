import AvailabilityActionBar from "./AvailabilityActionBar";
import AvailabilitySuggestionCard from "./AvailabilitySuggestionCard";
import AvailabilitySummaryCard from "./AvailabilitySummaryCard";
import BlockedDatesCard from "./BlockedDatesCard";
import BookingControlsCard from "./BookingControlsCard";
import TimeSlotManagementCard from "./TimeSlotManagementCard";
import UpdateAvailabilityHeader from "./UpdateAvailabilityHeader";
import WeeklyAvailabilityCard from "./WeeklyAvailabilityCard";

export default function UpdateAvailabilityPage() {
  return (
    <main className="min-h-screen bg-[#FCFCFB] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[920px] space-y-5">
        <UpdateAvailabilityHeader />
        <AvailabilitySummaryCard />
        <WeeklyAvailabilityCard />
        <TimeSlotManagementCard />
        <BlockedDatesCard />
        <BookingControlsCard />
        <AvailabilitySuggestionCard />
        <AvailabilityActionBar />
      </div>
    </main>
  );
}
