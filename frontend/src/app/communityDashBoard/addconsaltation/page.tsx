import AddConsaltation from "@/components/communityUsers/addconsaltation/AddConsaltation";
import GuestGate from "@/components/shared/GuestGate";

export default function AddConsaltationPage() {
  return (
    <GuestGate>
      <AddConsaltation />
    </GuestGate>
  );
}
