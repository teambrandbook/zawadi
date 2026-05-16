import MyRecipy from "@/components/communityUsers/myrecipy/MyRecipy";
import GuestGate from "@/components/shared/GuestGate";

export default function Recipy() {
  return (
    <GuestGate>
      <div>
        <MyRecipy/>
      </div>
    </GuestGate>
  );
}