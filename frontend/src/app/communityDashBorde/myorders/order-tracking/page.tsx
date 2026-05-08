import { Suspense } from "react";
import OrderTrackingPage from "@/components/communityUsers/myorder/orderTracking/OrderTrackingPage";

export default function OrderTrackingRoute() {
  return (
    <Suspense fallback={<OrderTrackingFallback />}>
      <OrderTrackingPage />
    </Suspense>
  );
}

function OrderTrackingFallback() {
  return (
    <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1136px] rounded-xl border border-[#DFDFDF] bg-white p-8 text-sm text-[#4B5563] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        Loading order tracking...
      </div>
    </section>
  );
}
