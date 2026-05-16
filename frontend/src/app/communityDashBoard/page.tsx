import Home from "@/components/communityUsers/home/Home";
import GuestGate from "@/components/shared/GuestGate";

export default function HomePage() {
  return (
    <GuestGate>
      <div>
        <Home/>
      </div>
    </GuestGate>
  );
}