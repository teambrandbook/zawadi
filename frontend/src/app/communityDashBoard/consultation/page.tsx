import Consultation from "@/components/communityUsers/consaltation/Consultation";
import GuestGate from "@/components/shared/GuestGate";

export default function ConsultationPage() {
  return (
    <GuestGate>
      <Consultation />
    </GuestGate>
  );
}
