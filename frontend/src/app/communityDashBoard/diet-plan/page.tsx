import DietPlanPageContent from "@/components/communityUsers/consaltation/DietPlanPageContent";
import GuestGate from "@/components/shared/GuestGate";

export default function DietPlanPage() {
  return (
    <GuestGate>
      <DietPlanPageContent />
    </GuestGate>
  );
}
